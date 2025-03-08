from bs4 import BeautifulSoup
import requests
import pandas as pd
from datetime import date as Date
from typing import List, Dict, Any
from .utils import clean, remove_useless_text

BASE_WIKIPEDIA_URL = "https://en.wikipedia.org/wiki/"


def scrape_players(config: List[str], category: str, logging: Any) -> pd.DataFrame:
    """
    Scrapes the Wikipedia page of a list of tennis players and returns a DataFrame with their information.

    Args:
        config (List[str]): A list of tennis players to scrape.
        category (str): The category of players, either 'atp' or 'wta'.
        logging (Any): A logger object.

    Returns:
        pd.DataFrame: A DataFrame containing the player's information including:
            - player: Name of the player
            - country: Country of the player
            - birthDate: Birth date of the player
            - height: Height of the player
            - yearTurnedPro: Year the player turned professional
            - yearRetired: Year the player retired
            - isRightHanded: Whether the player is right-handed
            - isTwoHandedBackhand: Whether the player uses a two-handed backhand
            - careerTitles: Number of career titles won by the player
            - highestRanking: Highest ranking achieved by the player
            - noAusOpenTitles: Number of Australian Open titles won by the player
            - noFrenchOpenTitles: Number of French Open titles won by the player
            - noWimbledonTitles: Number of Wimbledon titles won by the player
            - noUSOpenTitles: Number of US Open titles won by the player
            - noTourFinalsTitles: Number of Tour Finals titles won by the player
            - noOlympicTitles: Number of Olympic titles won by the player
            - image: URL of the player's image
    """

    def scraper(tennis_player: str) -> pd.DataFrame:
        """
        Scrapes the Wikipedia page of a given tennis player and returns a DataFrame with the player's information.

        Args:
            tennis_player (str): The name of the tennis player.

        Returns:
            pd.DataFrame: A DataFrame containing the player's information including:
                - player: Name of the player
                - country: Country of the player
                - birthDate: Birth date of the player
                - height: Height of the player
                - yearTurnedPro: Year the player turned professional
                - yearRetired: Year the player retired
                - isRightHanded: Whether the player is right-handed
                - isTwoHandedBackhand: Whether the player uses a two-handed backhand
                - careerTitles: Number of career titles won by the player
                - highestRanking: Highest ranking achieved by the player
                - noAusOpenTitles: Number of Australian Open titles won by the player
                - noFrenchOpenTitles: Number of French Open titles won by the player
                - noWimbledonTitles: Number of Wimbledon titles won by the player
                - noUSOpenTitles: Number of US Open titles won by the player
                - noTourFinalsTitles: Number of Tour Finals titles won by the player
                - noOlympicTitles: Number of Olympic titles won by the player
                - image: URL of the player's image
        """

        def get_wikipedia_page() -> str:
            """
            Fetches the Wikipedia page of the tennis player.

            Returns:
                str: The HTML content of the Wikipedia page.
            """
            url = BASE_WIKIPEDIA_URL + tennis_player.replace(" ", "_")
            response = requests.get(url)
            return response.text

        def parse_infobox(page: str) -> BeautifulSoup:
            """
            Parses the infobox from the given Wikipedia page.

            Args:
                page (str): The HTML content of the Wikipedia page.

            Returns:
                BeautifulSoup: The infobox table element.

            Raises:
                Exception: If no infobox is found on the page.
            """
            soup = BeautifulSoup(page, "html.parser")
            infobox = soup.find("table", {"class": "infobox"})
            if not infobox:
                raise Exception("No infobox found")
            return infobox

        def get_rows(page: str) -> List[BeautifulSoup]:
            """
            Retrieves all rows from the infobox table.

            Args:
                page (str): The HTML content of the Wikipedia page.

            Returns:
                List[BeautifulSoup]: A list of all row elements in the infobox table.
            """
            infobox = parse_infobox(page)
            return infobox.find_all("tr")

        def get_infobox_image() -> str:
            """
            Retrieves the URL of the image from the infobox.

            Returns:
                str: The URL of the image if found, otherwise None.
            """
            image = infobox.find("img")
            return "https:" + image["src"] if image else None

        def get_birth_date() -> Date:
            """
            Retrieves the birth date from the infobox.

            Returns:
                Date: The birth date if found, otherwise None.
            """
            bday = infobox.find("span", {"class": "bday"})
            return Date.fromisoformat(bday.text) if bday else None

        def get_height() -> float:
            """
            Retrieves the height from the infobox.

            Returns:
                float: The height in meters if found, otherwise None.
            """
            for row in rows:
                if "height" in clean(row.text.lower()):
                    height = row.find("td").text
                    if "cm" in height:
                        custom = height.split("cm")[0].replace(" ", "")
                        return float(custom[-4] + "." + custom[-3:-1])
                    if "1." in height:
                        return float("1." + height.split("1.")[1][:2])
                    if "2." in height:
                        return float("2." + height.split("2.")[1][:2])

        def get_turned_pro() -> int:
            """
            Retrieves the year the player turned professional from the infobox.

            Returns:
                int: The year the player turned professional if found, otherwise None.
            """
            for row in rows:
                if "turned pro" in clean(row.text.lower()):
                    return int(remove_useless_text(row.find("td").text)[-4:])

        def get_retired() -> int:
            """
            Retrieves the year the player retired from the infobox.

            Returns:
                int: The year the player retired if found, otherwise None.
            """
            for row in rows:
                if "retired" in clean(row.text.lower()):
                    if " (last match " in row.find("td").text:
                        return int(remove_useless_text(row.find("td").text)[-4:])
                    if "(last match " in row.find("td").text:
                        return int(
                            row.find("td").text.split("(last match ")[1].split(")")[0]
                        )
                    return int(remove_useless_text(row.find("td").text)[-4:])

        def get_right_handed() -> bool:
            """
            Checks if the player is right-handed from the infobox.

            Returns:
                bool: True if the player is right-handed, otherwise False.
            """
            for row in rows:
                if "plays" in clean(row.text.lower()):
                    plays = row.find("td").text
                    return "right" in plays.lower()

        def get_two_handed_backhand() -> bool:
            """
            Checks if the player uses a two-handed backhand from the infobox.

            Returns:
                bool: True if the player uses a two-handed backhand, otherwise False.
            """
            for row in rows:
                if "plays" in clean(row.text.lower()):
                    plays = row.find("td").text
                    return "two" in plays.lower()

        def get_career_titles() -> int:
            """
            Retrieves the number of career titles won by the player from the infobox.

            Returns:
                int: The number of career titles if found, otherwise None.
            """
            for row in rows:
                if "titles" in clean(row.text.lower()):
                    return int(remove_useless_text(row.find("td").text))

        def get_highest_ranking() -> int:
            """
            Retrieves the highest ranking achieved by the player from the infobox.

            Returns:
                int: The highest ranking if found, otherwise None.
            """
            for row in rows:
                if "highest" in clean(row.text.lower()):
                    if "No. " in row.find("td").text:
                        return int(row.find("td").text.split("No. ")[1].split(" ")[0])
                    else:
                        return int(row.find("td").text.split("No.")[1].split(" ")[0])

        def get_no_grand_slam_titles(title: str) -> int:
            """
            Retrieves the number of Grand Slam titles won by the player for a specific tournament from the infobox.

            Args:
                title (str): The title of the Grand Slam tournament.

            Returns:
                int: The number of titles won if found, otherwise 0.
            """
            th_with_title = infobox.find_all("th", recursive=True)
            for th in th_with_title:
                link = th.find("a", {"title": lambda x: x and title in x})
                if link:
                    data_cell = th.find_next_sibling("td")
                    if data_cell:
                        if "W" in data_cell.get_text():
                            return len(data_cell.find_all("a"))
                        return 0
            return 0

        def get_country() -> str:
            """
            Retrieves the country of the player from the infobox.

            Returns:
                str: The country if found, otherwise None.
            """
            for row in rows:
                if "country" in clean(row.text.lower()):
                    return remove_useless_text(row.find("td").text)

        page = get_wikipedia_page()
        infobox = parse_infobox(page)
        rows = get_rows(page)

        return pd.DataFrame(
            {
                "player": tennis_player.split(" (tennis)")[0],
                "country": get_country(),
                "birthDate": get_birth_date(),
                "height": get_height(),
                "yearTurnedPro": get_turned_pro(),
                "yearRetired": get_retired(),
                "isRightHanded": get_right_handed(),
                "isTwoHandedBackhand": get_two_handed_backhand(),
                "careerTitles": get_career_titles(),
                "highestRanking": get_highest_ranking(),
                "noAusOpenTitles": get_no_grand_slam_titles("Australian Open"),
                "noFrenchOpenTitles": get_no_grand_slam_titles("French Open"),
                "noWimbledonTitles": get_no_grand_slam_titles("Wimbledon"),
                "noUSOpenTitles": get_no_grand_slam_titles("US Open"),
                "noTourFinalsTitles": get_no_grand_slam_titles("Tour Finals"),
                "noOlympicTitles": get_no_grand_slam_titles("Olympic"),
                "image": get_infobox_image(),
            },
            index=[0],
        )

    df = pd.DataFrame()
    for player in config:
        msg = f"Scraping {player}"
        if category == "atp":
            logging.atp(msg)
        else:
            logging.wta(msg)
        page = scraper(player)
        df = pd.concat([df, page], ignore_index=True)
    return df
