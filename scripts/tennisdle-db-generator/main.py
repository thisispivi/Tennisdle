import json
import pandas as pd
from scripts.filter import filter_players
from scripts.scraper import scrape_players
from scripts.schedule import create_schedule
from scripts.additional import add_additional_info_atp, add_additional_info_wta
from scripts.logging import get_custom_logger
from scripts.utils import load_config, save_json
from scripts.scrape_venues import scrape_venues
from scripts.scrape_top10 import scrape_top10
from scripts.generate_grids import generate_grids


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

    # Player schedule (365+ days)
    schedule = create_schedule(df_atp, df_wta)
    save_json(schedule, "output/player_schedule.json")
    logging.save("Saved player schedule to output/player_schedule.json")

    # Save player data
    df_atp = add_additional_info_atp(df_atp)
    df_atp.to_json("output/atp_players.json", orient="records", lines=True)
    logging.save("Saved ATP players to output/atp_players.json")

    df_wta = add_additional_info_wta(df_wta)
    df_wta.to_json("output/wta_players.json", orient="records", lines=True)
    logging.save("Saved WTA players to output/wta_players.json")

    # Venues (60+)
    logging.important("Scraping venue data")
    venues = scrape_venues(logging)
    save_json(venues, "output/venues.json")
    logging.save(f"Saved {len(venues)} venues to output/venues.json")

    # Top 10 categories (28+)
    logging.important("Loading Top 10 categories")
    top10 = scrape_top10(logging)
    save_json(top10, "output/top10_categories.json")
    logging.save(
        f"Saved {len(top10)} Top 10 categories to output/top10_categories.json"
    )

    # Grid puzzles (400+)
    logging.important("Generating grid puzzles")
    atp_list = json.loads(df_atp.to_json(orient="records"))
    wta_list = json.loads(df_wta.to_json(orient="records"))
    grid_categories, grid_puzzles = generate_grids(
        atp_list, wta_list, logging, num_puzzles=400
    )
    save_json(grid_categories, "output/grid_categories.json")
    save_json(grid_puzzles, "output/grid_puzzles.json")
    logging.save(
        f"Saved {len(grid_categories)} grid categories and {len(grid_puzzles)} grid puzzles"
    )
