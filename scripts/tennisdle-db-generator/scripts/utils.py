import json
from typing import Any
import logging


def clean(text: str) -> str:
    """
    Clean the text by removing useless characters

    Args:
        text (str): Text to clean

    Returns:
        str: Cleaned text
    """
    return text.replace("\xa0", " ")


def remove_useless_text(text: str) -> str:
    """
    Remove useless text from the text

    Args:
        text (str): Text to clean

    Returns:
        str: Cleaned text
    """
    return (
        text.replace("\xa0", " ")
        .replace(" ", "")
        .split("(")[0]
        .split("[")[0]
        .split("W")[0]
    )


def load_config(category: str) -> list:
    """
    Load the configuration file containing the list of players to scrape"

    Args:
        category (str): Category of players to scrape

    Returns:
        list: List of players to scrape
    """
    with open(f"players/{category}.json", encoding="utf-8") as f:
        config = json.load(f)
    return list(set(config))


def save_json(data: Any, filename: str) -> None:
    """
    Save data to a JSON file

    Args:
        data: Data to save
        filename (str): Filename to save the data

    Returns:
        None
    """
    with open(filename, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=4)
