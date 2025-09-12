<div align="center">
   <div style="display: flex; padding-block: 40px; margin-bottom: 20px; background-color: #1f1f1f">
      <picture>
         <source media="(prefers-color-scheme: dark)" srcset="./logos/logo_dark.png">
         <source media="(prefers-color-scheme: light)" srcset="./logos/logo_light.png">
         <img alt="logo" src="./logos/logo_dark.png" height="75">
      </picture>
   </div>
</div>

# [Tennisdle](https://tennisdle.pivi.dev/)

Tennisdle is a web app where players must guess the daily ATP or WTA tennis player based on clues such as age, height, titles won (Grand Slams, Olympics, Finals), and playing style (dominant hand and backhand type). The project is available at this [link](https://tennisdle.pivi.dev/).

![Vue.js](https://img.shields.io/badge/vuejs-%2335495e.svg?style=for-the-badge&logo=vuedotjs&logoColor=%234FC08D) ![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white) ![pnpm](https://img.shields.io/badge/pnpm-%23CB3837.svg?style=for-the-badge&logo=pnpm&logoColor=white) ![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white) ![Redux](https://img.shields.io/badge/redux-%23593d88.svg?style=for-the-badge&logo=redux&logoColor=white) ![HTML5](https://img.shields.io/badge/html5-%23E34F26.svg?style=for-the-badge&logo=html5&logoColor=white) ![Python](https://img.shields.io/badge/python-3670A0?style=for-the-badge&logo=python&logoColor=ffdd54) ![ESLint](https://img.shields.io/badge/ESLint-4B3263?style=for-the-badge&logo=eslint&logoColor=white) ![SASS](https://img.shields.io/badge/SASS-hotpink.svg?style=for-the-badge&logo=SASS&logoColor=white) ![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)

## Project Structure

```text
.
├── logos
├── scripts
└── tennisdle
```

- `logos`: Contains all the assets used in the app.
- `scripts`: Contains one folder:
  - [Tennisdle DB Generator](./scripts/tennisdle-db-generator/README.md): Python script to scrape data from Wikipedia and create the database for the Tennisdle web app.
- `tennisdle`: Contains the Vue 3 web app.

## How to Use

1. Clone the repository:
   ```bash
   git clone https://github.com/thisispivi/Tennisdle.git
   ```
2. Navigate to the `tennisdle` folder:
   ```bash
   cd tennisdle
   ```
3. Install the dependencies:
   ```bash
   pnpm i
   ```
4. Run the app:
   ```bash
   pnpm dev
   ```

## How to Deploy

1. Navigate to the `tennisdle` folder:
   ```bash
   cd tennisdle
   ```
2. Run the deploy command:
   ```bash
   pnpm deploygh
   ```
