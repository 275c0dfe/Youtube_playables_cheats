# YouTube Playables Script Engine

A Tampermonkey userscript that enables custom script execution and save data editing for games on [YouTube Playables](https://www.youtube.com/playables). Designed for debugging, exploration, and game-specific customization via dynamic parsing and update hooks.

---

## Features

- In-browser script editor with support for multiple games
- Fully customizable `dataParse` / `dataDeParse` pipeline
- Game save value editing via `ytgame.loadData()` / `saveData()`
- Reload hooks and script injection on supported games
- Game-specific script presets for known titles

---

## Installation

1. **Install Tampermonkey Extension**  
   - [Chrome / Edge](https://www.tampermonkey.net/?ext=dhdg&browser=chrome)
   - [Firefox](https://addons.mozilla.org/en-US/firefox/addon/tampermonkey/)

2. **Download Script**  
   - [script_engine.js](./script_engine.js)

3. **Install Script in Tampermonkey**  
   - Click the Tampermonkey icon in your browser
   - Choose **"Create a new script"**
   - Replace the default template with the contents of `script_engine.js`
   - Save the script

4. **Visit YouTube Playables**  
   Navigate to a supported game under `https://youtube.com/playables`. The script interface should load automatically.

---

## How to Use

1. Click the "Show" button in the top-left to open the script UI.
2. Select a game from the dropdown to load a preset script.
3. Edit the script or write your own using the built-in `dataParse` and `dataDeParse` functions.
4. Click **Run Script** to execute.
5. Game will reload automatically to reflect changes.

---

## Writing Scripts

Each script must define:

- `dataParse(raw)` → converts raw save data into a JavaScript object
- `dataDeParse(obj)` → converts the modified object back to raw string

Use `updateValues({ key: value })` inside your script to patch the data. Reloads are handled automatically.

See [docs/script_guide.md](docs/script_guide.md) for writing game-specific scripts.

---

## Notes

- This tool is for educational and development purposes.
- Behavior may break if YouTube changes their game save API.
- Not all games store their data client-side.

---

## Included Game Scripts

- Default((Works on Crossy Road))
- Hill Climb Racing Lite (300k coins)
- My Mini Mart ($30k cash)
- Jetpack Joyride (30k coins)
- Fruit Ninja (300k star fruit)
- Stealth Master (+$30k cash)

---