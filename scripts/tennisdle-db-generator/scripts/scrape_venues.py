"""
Scrapes tennis venue data from Wikipedia for the Guess the Venue game mode.
Targets 60+ venues to provide 365+ days of daily content.
"""

from bs4 import BeautifulSoup
import requests
import json
import time
import re
from typing import Any

BASE_URL = "https://en.wikipedia.org/wiki/"
COMMONS_BASE = "https://upload.wikimedia.org/wikipedia/commons/thumb/"
HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36 TennisdleBot/1.0"
}

# All major professional tennis tournaments with their Wikipedia pages
VENUES = [
    # Grand Slams
    {"wiki": "Australian_Open", "tournament": "Australian Open", "venue": "Melbourne Park", "city": "Melbourne", "country": "Australia", "surface": "Hard", "category": "Grand Slam"},
    {"wiki": "French_Open", "tournament": "French Open", "venue": "Stade Roland Garros", "city": "Paris", "country": "France", "surface": "Clay", "category": "Grand Slam"},
    {"wiki": "The_Championships,_Wimbledon", "tournament": "Wimbledon", "venue": "All England Lawn Tennis Club", "city": "London", "country": "United Kingdom", "surface": "Grass", "category": "Grand Slam"},
    {"wiki": "US_Open_(tennis)", "tournament": "US Open", "venue": "USTA Billie Jean King National Tennis Center", "city": "New York", "country": "United States", "surface": "Hard", "category": "Grand Slam"},

    # ATP Masters 1000
    {"wiki": "Indian_Wells_Masters", "tournament": "Indian Wells Masters", "venue": "Indian Wells Tennis Garden", "city": "Indian Wells", "country": "United States", "surface": "Hard", "category": "Masters 1000"},
    {"wiki": "Miami_Open", "tournament": "Miami Open", "venue": "Hard Rock Stadium", "city": "Miami", "country": "United States", "surface": "Hard", "category": "Masters 1000"},
    {"wiki": "Monte-Carlo_Masters", "tournament": "Monte-Carlo Masters", "venue": "Monte Carlo Country Club", "city": "Roquebrune-Cap-Martin", "country": "France", "surface": "Clay", "category": "Masters 1000"},
    {"wiki": "Madrid_Open_(tennis)", "tournament": "Madrid Open", "venue": "Caja Mágica", "city": "Madrid", "country": "Spain", "surface": "Clay", "category": "Masters 1000"},
    {"wiki": "Italian_Open_(tennis)", "tournament": "Italian Open", "venue": "Foro Italico", "city": "Rome", "country": "Italy", "surface": "Clay", "category": "Masters 1000"},
    {"wiki": "Canadian_Open_(tennis)", "tournament": "Canadian Open", "venue": "IGA Stadium / Sobeys Stadium", "city": "Montreal / Toronto", "country": "Canada", "surface": "Hard", "category": "Masters 1000"},
    {"wiki": "Cincinnati_Masters", "tournament": "Cincinnati Masters", "venue": "Lindner Family Tennis Center", "city": "Cincinnati", "country": "United States", "surface": "Hard", "category": "Masters 1000"},
    {"wiki": "Shanghai_Masters_(tennis)", "tournament": "Shanghai Masters", "venue": "Qizhong Forest Sports City Arena", "city": "Shanghai", "country": "China", "surface": "Hard", "category": "Masters 1000"},
    {"wiki": "Paris_Masters", "tournament": "Paris Masters", "venue": "Accor Arena", "city": "Paris", "country": "France", "surface": "Hard (indoor)", "category": "Masters 1000"},

    # ATP 500
    {"wiki": "Rotterdam_Open", "tournament": "Rotterdam Open", "venue": "Rotterdam Ahoy", "city": "Rotterdam", "country": "Netherlands", "surface": "Hard (indoor)", "category": "ATP 500"},
    {"wiki": "Rio_Open", "tournament": "Rio Open", "venue": "Jockey Club Brasileiro", "city": "Rio de Janeiro", "country": "Brazil", "surface": "Clay", "category": "ATP 500"},
    {"wiki": "Dubai_Tennis_Championships", "tournament": "Dubai Tennis Championships", "venue": "Dubai Duty Free Tennis Stadium", "city": "Dubai", "country": "United Arab Emirates", "surface": "Hard", "category": "ATP 500"},
    {"wiki": "Mexican_Open_(tennis)", "tournament": "Mexican Open", "venue": "Arena GNP Seguros", "city": "Acapulco", "country": "Mexico", "surface": "Hard", "category": "ATP 500"},
    {"wiki": "Barcelona_Open_Banc_Sabadell", "tournament": "Barcelona Open", "venue": "Real Club de Tenis Barcelona", "city": "Barcelona", "country": "Spain", "surface": "Clay", "category": "ATP 500"},
    {"wiki": "Hamburg_European_Open", "tournament": "Hamburg Open", "venue": "Am Rothenbaum", "city": "Hamburg", "country": "Germany", "surface": "Clay", "category": "ATP 500"},
    {"wiki": "Queen%27s_Club_Championships", "tournament": "Queen's Club Championships", "venue": "Queen's Club", "city": "London", "country": "United Kingdom", "surface": "Grass", "category": "ATP 500"},
    {"wiki": "Halle_Open", "tournament": "Halle Open", "venue": "OWL Arena", "city": "Halle", "country": "Germany", "surface": "Grass", "category": "ATP 500"},
    {"wiki": "Washington_Open_(tennis)", "tournament": "Washington Open", "venue": "William H.G. FitzGerald Tennis Center", "city": "Washington D.C.", "country": "United States", "surface": "Hard", "category": "ATP 500"},
    {"wiki": "China_Open_(tennis)", "tournament": "China Open", "venue": "National Tennis Center", "city": "Beijing", "country": "China", "surface": "Hard", "category": "ATP 500"},
    {"wiki": "Japan_Open_Tennis_Championships", "tournament": "Japan Open", "venue": "Ariake Coliseum", "city": "Tokyo", "country": "Japan", "surface": "Hard", "category": "ATP 500"},
    {"wiki": "Swiss_Indoors", "tournament": "Swiss Indoors", "venue": "St. Jakobshalle", "city": "Basel", "country": "Switzerland", "surface": "Hard (indoor)", "category": "ATP 500"},
    {"wiki": "Erste_Bank_Open", "tournament": "Vienna Open", "venue": "Wiener Stadthalle", "city": "Vienna", "country": "Austria", "surface": "Hard (indoor)", "category": "ATP 500"},

    # ATP 250 notable
    {"wiki": "Brisbane_International", "tournament": "Brisbane International", "venue": "Queensland Tennis Centre", "city": "Brisbane", "country": "Australia", "surface": "Hard", "category": "ATP 250"},
    {"wiki": "Qatar_ExxonMobil_Open", "tournament": "Qatar Open", "venue": "Khalifa International Tennis Complex", "city": "Doha", "country": "Qatar", "surface": "Hard", "category": "ATP 250"},
    {"wiki": "ASB_Classic", "tournament": "ASB Classic", "venue": "ASB Tennis Arena", "city": "Auckland", "country": "New Zealand", "surface": "Hard", "category": "ATP 250"},
    {"wiki": "Marseille_Open", "tournament": "Marseille Open", "venue": "Palais des Sports de Marseille", "city": "Marseille", "country": "France", "surface": "Hard (indoor)", "category": "ATP 250"},
    {"wiki": "Estoril_Open", "tournament": "Estoril Open", "venue": "Clube de Ténis do Estoril", "city": "Estoril", "country": "Portugal", "surface": "Clay", "category": "ATP 250"},
    {"wiki": "Lyon_Open", "tournament": "Lyon Open", "venue": "Palais des Sports de Gerland", "city": "Lyon", "country": "France", "surface": "Clay", "category": "ATP 250"},
    {"wiki": "Swedish_Open", "tournament": "Swedish Open", "venue": "Båstad Tennis Stadium", "city": "Båstad", "country": "Sweden", "surface": "Clay", "category": "ATP 250"},
    {"wiki": "Swiss_Open_Gstaad", "tournament": "Swiss Open Gstaad", "venue": "Roy Emerson Arena", "city": "Gstaad", "country": "Switzerland", "surface": "Clay", "category": "ATP 250"},
    {"wiki": "Winston-Salem_Open", "tournament": "Winston-Salem Open", "venue": "Wake Forest Tennis Complex", "city": "Winston-Salem", "country": "United States", "surface": "Hard", "category": "ATP 250"},
    {"wiki": "Moselle_Open", "tournament": "Moselle Open", "venue": "Les Arènes de Metz", "city": "Metz", "country": "France", "surface": "Hard (indoor)", "category": "ATP 250"},
    {"wiki": "Sofia_Open", "tournament": "Sofia Open", "venue": "Arena Armeec", "city": "Sofia", "country": "Bulgaria", "surface": "Hard (indoor)", "category": "ATP 250"},
    {"wiki": "Stockholm_Open", "tournament": "Stockholm Open", "venue": "Kungliga Tennishallen", "city": "Stockholm", "country": "Sweden", "surface": "Hard (indoor)", "category": "ATP 250"},

    # WTA notable
    {"wiki": "WTA_Finals", "tournament": "WTA Finals", "venue": "Various", "city": "Various", "country": "Various", "surface": "Hard (indoor)", "category": "WTA Finals"},
    {"wiki": "Stuttgart_Open", "tournament": "Stuttgart Open", "venue": "Porsche Arena", "city": "Stuttgart", "country": "Germany", "surface": "Clay (indoor)", "category": "WTA 500"},
    {"wiki": "Eastbourne_International", "tournament": "Eastbourne International", "venue": "Devonshire Park", "city": "Eastbourne", "country": "United Kingdom", "surface": "Grass", "category": "WTA 500"},
    {"wiki": "San_Diego_Open", "tournament": "San Diego Open", "venue": "Barnes Tennis Center", "city": "San Diego", "country": "United States", "surface": "Hard", "category": "WTA 500"},
    {"wiki": "Pan_Pacific_Open", "tournament": "Pan Pacific Open", "venue": "Ariake Coliseum", "city": "Tokyo", "country": "Japan", "surface": "Hard", "category": "WTA 500"},

    # ATP/WTA Finals
    {"wiki": "ATP_Finals", "tournament": "ATP Finals", "venue": "Pala Alpitour", "city": "Turin", "country": "Italy", "surface": "Hard (indoor)", "category": "ATP Finals"},
    {"wiki": "Next_Generation_ATP_Finals", "tournament": "Next Gen ATP Finals", "venue": "Allianz Cloud", "city": "Milan", "country": "Italy", "surface": "Hard (indoor)", "category": "ATP Next Gen"},
    {"wiki": "Laver_Cup", "tournament": "Laver Cup", "venue": "Various", "city": "Various", "country": "Various", "surface": "Hard (indoor)", "category": "Exhibition"},

    # Historic venues
    {"wiki": "Davis_Cup", "tournament": "Davis Cup", "venue": "Various", "city": "Various", "country": "Various", "surface": "Various", "category": "Team Event"},
    {"wiki": "Hopman_Cup", "tournament": "Hopman Cup", "venue": "Perth Arena", "city": "Perth", "country": "Australia", "surface": "Hard", "category": "Exhibition"},

    # More ATP 250 for variety
    {"wiki": "Adelaide_International", "tournament": "Adelaide International", "venue": "Memorial Drive Tennis Centre", "city": "Adelaide", "country": "Australia", "surface": "Hard", "category": "ATP 250"},
    {"wiki": "Delray_Beach_Open", "tournament": "Delray Beach Open", "venue": "Delray Beach Tennis Center", "city": "Delray Beach", "country": "United States", "surface": "Hard", "category": "ATP 250"},
    {"wiki": "Dallas_Open", "tournament": "Dallas Open", "venue": "Styslinger/Altec Tennis Complex", "city": "Dallas", "country": "United States", "surface": "Hard (indoor)", "category": "ATP 250"},
    {"wiki": "Argentina_Open", "tournament": "Argentina Open", "venue": "Buenos Aires Lawn Tennis Club", "city": "Buenos Aires", "country": "Argentina", "surface": "Clay", "category": "ATP 250"},
    {"wiki": "Chile_Open_(tennis)", "tournament": "Chile Open", "venue": "Estadio Nacional", "city": "Santiago", "country": "Chile", "surface": "Clay", "category": "ATP 250"},
    {"wiki": "BMW_Open", "tournament": "Munich Open", "venue": "MTTC Iphitos", "city": "Munich", "country": "Germany", "surface": "Clay", "category": "ATP 250"},
    {"wiki": "Geneva_Open", "tournament": "Geneva Open", "venue": "Tennis Club de Genève", "city": "Geneva", "country": "Switzerland", "surface": "Clay", "category": "ATP 250"},
    {"wiki": "Mallorca_Championships", "tournament": "Mallorca Championships", "venue": "Mallorca Country Club", "city": "Mallorca", "country": "Spain", "surface": "Grass", "category": "ATP 250"},
    {"wiki": "Newport_Tennis_Hall_of_Fame_Open", "tournament": "Newport Open", "venue": "International Tennis Hall of Fame", "city": "Newport", "country": "United States", "surface": "Grass", "category": "ATP 250"},
    {"wiki": "Atlanta_Open", "tournament": "Atlanta Open", "venue": "Atlantic Station", "city": "Atlanta", "country": "United States", "surface": "Hard", "category": "ATP 250"},
    {"wiki": "Korea_Open_(tennis)", "tournament": "Korea Open", "venue": "Olympic Park Tennis Center", "city": "Seoul", "country": "South Korea", "surface": "Hard", "category": "ATP 250"},
    {"wiki": "Chengdu_Open", "tournament": "Chengdu Open", "venue": "Sichuan International Tennis Center", "city": "Chengdu", "country": "China", "surface": "Hard", "category": "ATP 250"},
]


def scrape_venue_image(wiki_page: str) -> str | None:
    """Scrape the main image from a Wikipedia article."""
    try:
        url = BASE_URL + wiki_page
        response = requests.get(url, headers=HEADERS)
        soup = BeautifulSoup(response.text, "html.parser")

        infobox = soup.find("table", {"class": "infobox"})
        if infobox:
            img = infobox.find("img")
            if img and img.get("src"):
                src = img["src"]
                if not src.startswith("http"):
                    src = "https:" + src
                return src

        # Fallback: first image in the article body
        content = soup.find("div", {"id": "mw-content-text"})
        if content:
            for img in content.find_all("img"):
                src = img.get("src", "")
                if "wiki" in src and any(ext in src.lower() for ext in [".jpg", ".jpeg", ".png"]):
                    if not src.startswith("http"):
                        src = "https:" + src
                    return src
    except Exception:
        pass
    return None


def generate_hints(venue_data: dict) -> list[str]:
    """Generate progressive hints for a venue."""
    hints = []

    surface = venue_data["surface"]
    category = venue_data["category"]
    country = venue_data["country"]
    city = venue_data["city"]

    hints.append(f"This tournament is played on {surface}.")
    hints.append(f"It is a {category} event.")

    if country != "Various":
        hints.append(f"Located in {country}.")
    else:
        hints.append("This is a traveling event hosted in different cities.")

    if city != "Various":
        hints.append(f"The city is {city}.")
    else:
        hints.append("The host city changes each year.")

    return hints


def scrape_venues(logging: Any) -> list[dict]:
    """Scrape venue data and images from Wikipedia."""
    results = []

    for i, venue_data in enumerate(VENUES):
        wiki = venue_data["wiki"]
        tournament = venue_data["tournament"]
        logging.info(f"Scraping venue {tournament} ({i+1}/{len(VENUES)})")

        image_url = scrape_venue_image(wiki)

        venue = {
            "id": wiki.lower().replace("_", "-").replace("(", "").replace(")", "").replace(",", "").replace("%27", ""),
            "tournament": tournament,
            "venueName": venue_data["venue"],
            "city": venue_data["city"],
            "country": venue_data["country"],
            "surface": venue_data["surface"],
            "category": venue_data["category"],
            "images": [image_url] if image_url else [],
            "hints": generate_hints(venue_data),
        }
        results.append(venue)

        if i < len(VENUES) - 1:
            time.sleep(1)

    return results
