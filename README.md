<div align="center">
   <div style="display: flex;padding-block:40px;margin-bottom:20px;background-color:#1f1f1f">
      <picture>
         <source media="(prefers-color-scheme: dark)" srcset="./logos/logo_dark.png">
         <source media="(prefers-color-scheme: light)" srcset="./logos/logo_light.png">
         <img alt="logo" src="./logos/logo_dark.png" height="75">
      </picture>
   </div>
</div>

# [Tennisdle](https://tennisdle.pivi.dev/)

Tennisdle is a web app where players must guess the daily ATP or WTA tennis player based on clues such as age, height, titles won (Grand Slams, Olympics, Finals), and playing style (dominant hand and backhand type). Project is available at this [link](https://tennisdle.pivi.dev/)

![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB) ![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white) ![NPM](https://img.shields.io/badge/NPM-%23CB3837.svg?style=for-the-badge&logo=npm&logoColor=white) ![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white) ![Redux](https://img.shields.io/badge/redux-%23593d88.svg?style=for-the-badge&logo=redux&logoColor=white) ![HTML5](https://img.shields.io/badge/html5-%23E34F26.svg?style=for-the-badge&logo=html5&logoColor=white) ![Python](https://img.shields.io/badge/python-3670A0?style=for-the-badge&logo=python&logoColor=ffdd54) ![ESLint](https://img.shields.io/badge/ESLint-4B3263?style=for-the-badge&logo=eslint&logoColor=white) ![SASS](https://img.shields.io/badge/SASS-hotpink.svg?style=for-the-badge&logo=SASS&logoColor=white) ![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white) ![Vue.js](https://img.shields.io/badge/vuejs-%2335495e.svg?style=for-the-badge&logo=vuedotjs&logoColor=%234FC08D)

## Project structure

```text
.
├── logos
├── scripts
└── tennisdle
```

- `logos`: Contains all the assets used in the app.
- `scripts`: Contains one folder:
  - [Tennsidle DB generator](./scripts/tennisdle-db-generator/README.md): Python script to scrape data from wikipedia and create the database for the Tennisdle web app.
- `tennisdle`: Contains the Vue 3 web app.

## How to use it

1. Clone the repository
2. Navigate to the `tennisdle` folder
   ```bash
   cd tennisdle
   ```
3. Install the dependencies with:
   ```bash
   npm install
   ```
4. Run the app with
   ```bash
   npm start
   ```

## How to deploy

1. Navigate to the `tennisdle` folder
   ```bash
   cd tennisdle
   ```
2. Run the deploy command
   ```bash
   npm run deploy
   ```
