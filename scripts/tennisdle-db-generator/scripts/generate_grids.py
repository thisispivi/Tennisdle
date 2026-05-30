"""
Generates 365+ unique grid puzzles using player data and grid categories.
Each puzzle is a 3x3 grid where rows/cols are categories and cells need players matching both.
"""

import json
import random
import itertools
from datetime import datetime, timedelta
from typing import Any

# Expanded grid categories with more variety
GRID_CATEGORIES = [
    # Tournament winners
    {"id": "won-australian-open", "labelKey": "grid.categories.wonAustralianOpen", "type": "tournament"},
    {"id": "won-french-open", "labelKey": "grid.categories.wonFrenchOpen", "type": "tournament"},
    {"id": "won-wimbledon", "labelKey": "grid.categories.wonWimbledon", "type": "tournament"},
    {"id": "won-us-open", "labelKey": "grid.categories.wonUSOpen", "type": "tournament"},
    {"id": "won-tour-finals", "labelKey": "grid.categories.wonTourFinals", "type": "tournament"},
    {"id": "won-olympic-gold", "labelKey": "grid.categories.wonOlympicGold", "type": "tournament"},

    # Hand
    {"id": "left-handed", "labelKey": "grid.categories.leftHanded", "type": "hand"},
    {"id": "right-handed", "labelKey": "grid.categories.rightHanded", "type": "hand"},
    {"id": "one-handed-backhand", "labelKey": "grid.categories.oneHandedBackhand", "type": "hand"},

    # Countries
    {"id": "spanish", "labelKey": "grid.categories.spanish", "type": "country"},
    {"id": "swiss", "labelKey": "grid.categories.swiss", "type": "country"},
    {"id": "serbian", "labelKey": "grid.categories.serbian", "type": "country"},
    {"id": "australian", "labelKey": "grid.categories.australian", "type": "country"},
    {"id": "american", "labelKey": "grid.categories.american", "type": "country"},
    {"id": "european", "labelKey": "grid.categories.european", "type": "country"},
    {"id": "german", "labelKey": "grid.categories.german", "type": "country"},
    {"id": "french", "labelKey": "grid.categories.french", "type": "country"},
    {"id": "british", "labelKey": "grid.categories.british", "type": "country"},
    {"id": "russian", "labelKey": "grid.categories.russian", "type": "country"},
    {"id": "argentinian", "labelKey": "grid.categories.argentinian", "type": "country"},
    {"id": "italian", "labelKey": "grid.categories.italian", "type": "country"},
    {"id": "czech", "labelKey": "grid.categories.czech", "type": "country"},
    {"id": "croatian", "labelKey": "grid.categories.croatian", "type": "country"},
    {"id": "swedish", "labelKey": "grid.categories.swedish", "type": "country"},

    # Ranking / Achievements
    {"id": "number-1", "labelKey": "grid.categories.number1", "type": "ranking"},
    {"id": "top-5-ranking", "labelKey": "grid.categories.top5Ranking", "type": "ranking"},
    {"id": "10-plus-titles", "labelKey": "grid.categories.tenPlusTitles", "type": "ranking"},
    {"id": "30-plus-titles", "labelKey": "grid.categories.thirtyPlusTitles", "type": "ranking"},
    {"id": "50-plus-titles", "labelKey": "grid.categories.fiftyPlusTitles", "type": "ranking"},

    # Era
    {"id": "active-player", "labelKey": "grid.categories.activePlayer", "type": "era"},
    {"id": "retired-player", "labelKey": "grid.categories.retiredPlayer", "type": "era"},
    {"id": "turned-pro-before-2000", "labelKey": "grid.categories.turnedProBefore2000", "type": "era"},
    {"id": "turned-pro-after-2010", "labelKey": "grid.categories.turnedProAfter2010", "type": "era"},
]

# European countries for the "european" category
EUROPEAN_COUNTRIES = {
    "Spain", "France", "Germany", "GreatBritain", "Italy", "Switzerland",
    "Sweden", "Austria", "CzechRepublic", "Croatia", "Serbia", "Russia",
    "Romania", "Greece", "Belgium", "Netherlands", "Denmark", "Norway",
    "Poland", "Slovakia", "Slovenia", "Ukraine", "Hungary", "Bulgaria",
    "Georgia", "Finland", "Portugal", "BosniaAndHerzegovina", "Montenegro",
    "Belarus", "Latvia", "Lithuania", "Estonia", "Moldova", "Cyprus",
}


def player_matches_category(player: dict, category_id: str) -> bool:
    """Check if a player matches a given category."""
    country = player.get("country", "")

    match category_id:
        # Tournaments
        case "won-australian-open": return player.get("noAusOpenTitles", 0) > 0
        case "won-french-open": return player.get("noFrenchOpenTitles", 0) > 0
        case "won-wimbledon": return player.get("noWimbledonTitles", 0) > 0
        case "won-us-open": return player.get("noUSOpenTitles", 0) > 0
        case "won-tour-finals": return player.get("noTourFinalsTitles", 0) > 0
        case "won-olympic-gold": return player.get("noOlympicTitles", 0) > 0

        # Hand
        case "left-handed": return player.get("isRightHanded") is False
        case "right-handed": return player.get("isRightHanded") is True
        case "one-handed-backhand": return player.get("isTwoHandedBackhand") is False

        # Countries
        case "spanish": return country == "Spain"
        case "swiss": return country == "Switzerland"
        case "serbian": return country == "Serbia"
        case "australian": return country == "Australia"
        case "american": return country in ("UnitedStates", "United States")
        case "european": return country in EUROPEAN_COUNTRIES
        case "german": return country == "Germany"
        case "french": return country == "France"
        case "british": return country in ("GreatBritain", "Great Britain", "United Kingdom")
        case "russian": return country == "Russia"
        case "argentinian": return country == "Argentina"
        case "italian": return country == "Italy"
        case "czech": return country in ("CzechRepublic", "Czech Republic")
        case "croatian": return country == "Croatia"
        case "swedish": return country == "Sweden"

        # Ranking
        case "number-1": return player.get("highestRanking", 999) == 1
        case "top-5-ranking": return player.get("highestRanking", 999) <= 5
        case "10-plus-titles": return player.get("careerTitles", 0) >= 10
        case "30-plus-titles": return player.get("careerTitles", 0) >= 30
        case "50-plus-titles": return player.get("careerTitles", 0) >= 50

        # Era
        case "active-player": return player.get("yearRetired") is None or player.get("yearRetired") == 0
        case "retired-player": return player.get("yearRetired") is not None and player.get("yearRetired") > 0
        case "turned-pro-before-2000": return (player.get("yearTurnedPro") or 9999) < 2000
        case "turned-pro-after-2010": return (player.get("yearTurnedPro") or 0) >= 2010

    return False


def find_solutions(players: list[dict], row_id: str, col_id: str) -> list[str]:
    """Find all players matching both a row and column category."""
    return [
        p["player"]
        for p in players
        if player_matches_category(p, row_id) and player_matches_category(p, col_id)
    ]


def is_valid_puzzle(players: list[dict], rows: list[str], cols: list[str], min_solutions: int = 1) -> bool:
    """Check that every cell in the grid has at least min_solutions valid answers."""
    for row_id in rows:
        for col_id in cols:
            solutions = find_solutions(players, row_id, col_id)
            if len(solutions) < min_solutions:
                return False
    return True


def generate_puzzle(
    players: list[dict],
    categories: list[dict],
    puzzle_id: str,
    date_str: str,
    used_combos: set,
    rng: random.Random,
) -> dict | None:
    """Generate a single valid puzzle, or None if not possible after many attempts."""

    category_ids = [c["id"] for c in categories]
    types = {c["id"]: c["type"] for c in categories}

    for _ in range(200):
        rows = rng.sample(category_ids, 3)
        cols = rng.sample([c for c in category_ids if c not in rows], 3)

        # Ensure diversity: rows and cols should have different types mixed
        row_types = [types[r] for r in rows]
        col_types = [types[c] for c in cols]

        # Avoid all same type
        if len(set(row_types)) == 1 and len(set(col_types)) == 1:
            continue

        combo_key = tuple(sorted(rows)) + tuple(sorted(cols))
        if combo_key in used_combos:
            continue

        if is_valid_puzzle(players, rows, cols):
            used_combos.add(combo_key)

            solutions = {}
            for row_id in rows:
                for col_id in cols:
                    key = f"{row_id}_{col_id}"
                    solutions[key] = find_solutions(players, row_id, col_id)

            return {
                "id": puzzle_id,
                "date": date_str,
                "rows": rows,
                "cols": cols,
                "solutions": solutions,
            }

    return None


def generate_grids(atp_players: list[dict], wta_players: list[dict], logging: Any, num_puzzles: int = 400) -> tuple[list[dict], list[dict]]:
    """Generate grid categories and puzzles."""
    all_players = atp_players + wta_players

    rng = random.Random(42)  # deterministic seed
    used_combos: set = set()
    puzzles = []
    start_date = datetime(2025, 1, 1)

    for i in range(num_puzzles):
        date_str = (start_date + timedelta(days=i)).strftime("%Y-%m-%d")
        puzzle_id = f"puzzle-{i+1}"

        puzzle = generate_puzzle(all_players, GRID_CATEGORIES, puzzle_id, date_str, used_combos, rng)
        if puzzle:
            puzzles.append(puzzle)
            if (i + 1) % 50 == 0:
                logging.info(f"Generated {i+1}/{num_puzzles} grid puzzles")
        else:
            logging.warning(f"Could not generate puzzle {puzzle_id} for {date_str}")

    logging.info(f"Generated {len(puzzles)} grid puzzles total")

    return GRID_CATEGORIES, puzzles
