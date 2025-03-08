# Tennisdle DB Generator • ![Python](https://img.shields.io/badge/python-3670A0?style=for-the-badge&logo=python&logoColor=ffdd54)

The Tennisdle DB Generator is a Python script that scrapes player data from Wikipedia and generates JSON files for ATP and WTA tour players, which can be used for the Tennisdle game. This data includes player information like career titles, rankings, and images. The script also generates a JSON file with a daily schedule of players for the Tennisdle game.

## Table of Contents

- [Tennisdle DB Generator](#tennisdle-db-generator-----python--https---imgshieldsio-badge-python-3670a0-style-for-the-badge-logo-python-logocolor-ffdd54-)
  - [Installation](#installation)
  - [Usage](#usage)
  - [Output](#output)
    - [1. ATP players](#1-atp-players)
    - [2. WTA players](#2-wta-players)
    - [3. Player schedule](#3-player-schedule)

## Installation

1. Clone the repository:

2. Navigate to the repository folder:

   ```sh
   cd tennisdle-db-generator
   ```

3. Install the required dependencies:

   ```sh
   pip install -r requirements.txt
   ```

## Usage

1. Run the script:

   ```sh
   python main.py
   ```

2. The script will scrape data and generate the following files in the output folder:
   - `atp_players.json`
   - `wta_players.json`
   - `player_schedule.json`

## Output

The script will generate three files in the `output` folder:

### 1. ATP players

`atp_players.json`: Contains data for ATP players. An example row:

     ```json
     {
       "player": "Jannik Sinner",
       "country": "Italy",
       "birthDate": 997920000000,
       "height": 1.92,
       "yearTurnedPro": 2018,
       "yearRetired": null,
       "isRightHanded": true,
       "isTwoHandedBackhand": true,
       "careerTitles": 19,
       "highestRanking": 1,
       "noAusOpenTitles": 2,
       "noFrenchOpenTitles": 0,
       "noWimbledonTitles": 0,
       "noUSOpenTitles": 1,
       "noTourFinalsTitles": 1,
       "noOlympicTitles": 0,
       "image": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/97/Jannik_Sinner_%282024_US_Open%29_04_%28cropped%29.jpg/200px-Jannik_Sinner_%282024_US_Open%29_04_%28cropped%29.jpg"
     }
     ```

### 2. WTA players

`wta_players.json`: Contains data for WTA players. An example row:

```json
{
  "player": "Jasmine Paolini",
  "country": "Italy",
  "birthDate": 820713600000,
  "height": 1.63,
  "yearTurnedPro": 2015,
  "yearRetired": null,
  "isRightHanded": true,
  "isTwoHandedBackhand": true,
  "careerTitles": 2,
  "highestRanking": 4,
  "noAusOpenTitles": 0,
  "noFrenchOpenTitles": 0,
  "noWimbledonTitles": 0,
  "noUSOpenTitles": 0,
  "noTourFinalsTitles": 0,
  "noOlympicTitles": 0,
  "image": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Transylvania_Open_2022_WTA_250_%2852502001597%29_%28cropped%29.jpg/200px-Transylvania_Open_2022_WTA_250_%2852502001597%29_%28cropped%29.jpg"
}
```

### 3. Player schedule

`player_schedule.json`: Contains data for the daily Tennisdle game. Starting from the current date for a year, the script will choose a random WTA player and a random ATP player to guess. The data is saved in the following format:

```json
[
  {
    "date": "2025-03-06",
    "atpPlayer": "Arthur Ashe",
    "wtaPlayer": "Petra Kvitová"
  },
  {
    "date": "2025-03-07",
    "atpPlayer": "Jannik Sinner",
    "wtaPlayer": "Manuela Maleeva"
  }
]
```

It's possible that further data manipulation is needed for the web app.
