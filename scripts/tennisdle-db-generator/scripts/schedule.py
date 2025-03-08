from datetime import datetime, timedelta
from typing import List, Dict
import pandas as pd


def create_schedule(df_atp: pd.DataFrame, df_wta: pd.DataFrame) -> List[Dict[str, str]]:
    """
    Creates a schedule of ATP and WTA players for a year.

    Args:
        df_atp (pd.DataFrame): DataFrame containing ATP players.
        df_wta (pd.DataFrame): DataFrame containing WTA players.

    Returns:
        list: A list of dictionaries, each containing a date, an ATP player, and a WTA player.

    The function selects random players from the provided DataFrames without repeating any player
    within a specified number of days. It then creates a schedule for 365 days starting from two
    days before the current date.
    """

    def select_random_players(
        df: pd.DataFrame, days: int = 365, no_repeat_days: int = 30
    ) -> List[str]:
        """
        Selects random players from the DataFrame without repeating any player within a specified number of days.

        Args:
            df (pd.DataFrame): DataFrame containing players.
            days (int): Number of days to select players for. Default is 365.
            no_repeat_days (int): Number of days within which a player should not be repeated. Default is 30.

        Returns:
            list: A list of selected players.
        """
        selected_players = []
        recent_players = []

        for day in range(days):
            available_players = df[~df["player"].isin(recent_players)]
            if available_players.empty:
                recent_players = recent_players[1:]
                available_players = df[~df["player"].isin(recent_players)]

            selected_player = available_players.sample().iloc[0]
            selected_players.append(selected_player["player"])
            recent_players.append(selected_player["player"])

            if len(recent_players) > no_repeat_days:
                recent_players.pop(0)

        return selected_players

    atp_players = select_random_players(df_atp)
    wta_players = select_random_players(df_wta)

    start_date = datetime.now() - timedelta(days=2)
    schedule = []

    for i in range(365):
        date = start_date + timedelta(days=i)
        schedule.append(
            {
                "date": date.strftime("%Y-%m-%d"),
                "atpPlayer": atp_players[i],
                "wtaPlayer": wta_players[i],
            }
        )

    return schedule
