import pandas as pd
import logging


def filter_players(df: pd.DataFrame, logger: logging.Logger) -> pd.DataFrame:
    """
    Filters out players from the DataFrame based on the following conditions:
    - Turned pro before the year 2000
    - Have fewer than 15 career titles
    - Have no Grand Slam titles (Australian Open, French Open, Wimbledon, US Open)
    - Have no Tour Finals titles
    - Have no Olympic titles

    Args:
        df (pd.DataFrame): DataFrame containing player data with columns:
            - 'yearTurnedPro': int
            - 'careerTitles': int
            - 'noAusOpenTitles': int
            - 'noFrenchOpenTitles': int
            - 'noWimbledonTitles': int
            - 'noUSOpenTitles': int
            - 'noTourFinalsTitles': int
            - 'noOlympicTitles': int

    Returns:
        pd.DataFrame: DataFrame with players who do not meet the filtering conditions.
    """

    initial_player_count = len(df)

    filter_conditions = (
        (df["yearTurnedPro"] < 2000)
        & (df["careerTitles"] < 15)
        & (df["noAusOpenTitles"] == 0)
        & (df["noFrenchOpenTitles"] == 0)
        & (df["noWimbledonTitles"] == 0)
        & (df["noUSOpenTitles"] == 0)
        & (df["noTourFinalsTitles"] == 0)
        & (df["noOlympicTitles"] == 0)
    )

    filtered_players = df[filter_conditions]

    filtered_player_count = len(filtered_players)

    df = df.drop(filtered_players.index)

    logger.filter_players(
        f"Kept {initial_player_count - filtered_player_count}/{initial_player_count} players"
    )

    return df
