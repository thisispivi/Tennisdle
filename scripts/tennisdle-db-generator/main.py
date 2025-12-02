import pandas as pd
from scripts.filter import filter_players
from scripts.scraper import scrape_players
from scripts.schedule import create_schedule
from scripts.additional import add_additional_info_atp, add_additional_info_wta
from scripts.logging import get_custom_logger
from scripts.utils import load_config, save_json


if __name__ == "__main__":
    logging = get_custom_logger()

    df_atp = pd.DataFrame()
    df_wta = pd.DataFrame()

    for category in ["atp", "wta"]:
        logging.important(f"Scraping {category} players")
        config = load_config(category)
        df = scrape_players(config, category, logging)

        if category == "atp":
            df_atp = filter_players(df, logging)
        else:
            df_wta = filter_players(df, logging)

        print("\n")

    schedule = create_schedule(df_atp, df_wta)
    save_json(schedule, "output/player_schedule.json")
    logging.save("Saved player schedule to output/player_schedule.json")

    df_atp = add_additional_info_atp(df_atp)
    df_atp.to_json("output/atp_players.json", orient="records", lines=True)
    logging.save("Saved ATP players to output/atp_players.json")

    df_wta = add_additional_info_wta(df_wta)
    df_wta.to_json("output/wta_players.json", orient="records", lines=True)
    logging.save("Saved WTA players to output/wta_players.json")
