import pandas as pd


def add_additional_info_atp(df_atp: pd.DataFrame) -> pd.DataFrame:
    """
    Add additional information to the ATP dataset.

    This function enriches the ATP dataset with additional information such as
    country, image URLs, and career details for specific players.

    Args:
        df_atp (pd.DataFrame): The ATP dataset.

    Returns:
        pd.DataFrame: The ATP dataset with additional information added.
    """
    additional_info: dict[str, dict[str, str | int]] = {
        "Boris Becker": {"country": "Germany"},
        "John Newcombe": {"country": "Australia"},
        "Kei Nishikori": {"country": "Japan"},
        "Janko Tipsarević": {"country": "Serbia"},
        "Goran Ivanišević": {"country": "Croatia"},
        "Sergi Bruguera": {
            "image": "https://tennis.fast-cdn.com/wp-content/uploads/2016/04/04bruguera.jpg"
        },
        "Petr Korda": {"country": "CzechRepublic"},
        "Miloslav Mečíř": {"country": "Slovakia"},
        "Ivan Lendl": {"country": "UnitedStates"},
        "Johan Kriek": {
            "country": "UnitedStates",
            "image": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSl87hwbMBpqsBeVcDzzO597PXQsKyo51cJrQ&s",
        },
        "Brian Teacher": {"image": "https://www.db4tennis.com/img/players/4635.jpg"},
        "Brian Gottfried": {
            "country": "UnitedStates",
            "image": "https://alchetron.com/cdn/brian-gottfried-4f52828a-6040-438b-ad8a-d5f62a23408-resize-750.jpeg",
        },
        "Harold Solomon": {
            "image": "https://www.asscotennis.it/wp-content/uploads/2010/09/Solomon.jpg"
        },
        "Željko Franulović": {"country": "Croatia"},
        "Adriano Panatta": {
            "image": "https://upload.wikimedia.org/wikipedia/it/thumb/1/19/Adriano_Panatta_1976.jpg/1024px-Adriano_Panatta_1976.jpg"
        },
        "Jan Kodeš": {"country": "CzechRepublic"},
        "Clark Graebner": {
            "image": "https://encrypted-tbn1.gstatic.com/licensed-image?q=tbn:ANd9GcTVf4XTLltVRyMR9FLpoSmXz9Ua19a8HRX_yamOqwkCAnRcQlDE_338WgyXdFdyS1j9nOGKI7msUQ2lCjE"
        },
        "Mark Edmondson": {
            "image": "https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcTMrStOpu_hY96Zl2XB1cLjZpSSvsDnR4fBwtGJPRGjLnG3kx6qPQ8UorbmiGr5pVzwHWEWY4u7VVn7VPxXPPsR7g",
            "yearTurnedPro": 1976,
            "yearRetired": 1988,
        },
        "Wojciech Fibak": {"yearTurnedPro": 1976, "yearRetired": 1988},
    }

    for player, info in additional_info.items():
        for key, value in info.items():
            df_atp.loc[df_atp["player"] == player, key] = value

    return df_atp


def add_additional_info_wta(df_wta: pd.DataFrame) -> pd.DataFrame:
    """
    Add additional information to the WTA dataset.

    This function enriches the WTA dataset with additional information such as
    country, image URLs, and career details for specific players.

    Args:
        df_wta (pd.DataFrame): The WTA dataset.

    Returns:
        pd.DataFrame: The WTA dataset with additional information added.
    """
    additional_info: dict[str, dict[str, str | int | float]] = {
        "Evonne Goolagong": {"yearTurnedPro": 1968},
        "Ann Haydon Jones": {"yearTurnedPro": 1959, "yearRetired": 1973, "height": 1.7},
        "Hana Mandlíková": {"country": "Australia"},
        "Jana Novotná": {"country": "CzechRepublic"},
        "Iva Majoli": {"country": "Croatia"},
        "Jelena Janković": {"country": "Serbia"},
        "Ana Ivanovic": {"country": "Serbia"},
        "Monica Seles": {"country": "UnitedStates"},
        "Steffi Graf": {"country": "Germany"},
        "Mima Jaušovec": {
            "country": "Slovenia",
            "image": "https://photoresources.wtatennis.com/photo-resources/2020/06/16/e6a3d340-fe18-4b19-a178-bb68c9e6d035/Pokal_Mime_Jausovec_1134_200606_VID.JPG?width=1064",
        },
        "Chris O'Neil": {
            "image": "https://content.api.news/v3/images/bin/1b51587a9ff5e5f35944d0ba86e8eb21"
        },
        "Markéta Vondroušová": {"yearTurnedPro": 2017},
        "Kerry Reid": {"yearTurnedPro": 1963},
        "Virginia Wade": {
            "image": "https://www.tennisfantastic.com/wp-content/uploads/2023/11/Virginia-Wade-2.webp",
            "country": "GreatBritain",
        },
    }

    for player, info in additional_info.items():
        for key, value in info.items():
            df_wta.loc[df_wta["player"] == player, key] = value

    return df_wta
