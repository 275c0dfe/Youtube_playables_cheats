# YouTube Playables Script Engine – Docs

This tool lets you write custom scripts to modify save data in YouTube Playables. Useing `ytgame.game.loadData()` and `ytgame.game.saveData()` to interact with the game's save system.

---

## 🔧 Core Concepts

### `dataParse(raw)`
This function takes the raw save data and decodes it into a readable JavaScript object.

### `dataDeParse(parsed)`
This function takes the modified object and encodes it back to the raw format expected by the game.

> These are game-specific — some use plain JSON, others use `btoa`, XOR encryption, or nested structures.

---

## 🧪 Script Structure Example

```js
// 1. Decode raw save data
function dataParse(raw) {
    return JSON.parse(raw); // or atob(raw) -> JSON.parse() if base64 encoded
}

// 2. Encode modified object back
function dataDeParse(parsed) {
    //can be modified here if needed
    //ex parsed.coins += 100;
    //makes neseted structures easier to modify
    //ex parsed.player.coins += 100;

    return JSON.stringify(parsed); // or btoa(JSON.stringify()) for base64 games
}

// 3. This will be replaced by the engine with an update function using the defined functions above
//%updateValues

// 4. Modify values
updateValues({
    coins: 999999,
    gems: 500
});

// 5. Trigger reload to load modified save
window.name = "reload_game";
window.location.reload();
```

---

## Game Save Formats

### Plain JSON
```js
function dataParse(raw) {
    return JSON.parse(raw);
}

function dataDeParse(parsed) {
    return JSON.stringify(parsed);
}
```

### 🟨 Base64 Encoded JSON
```js
function dataParse(raw) {
    return JSON.parse(atob(raw));
}

function dataDeParse(parsed) {
    return btoa(JSON.stringify(parsed));
}
```

### XOR Encrypted (Halfbrick - Jetpack Joyride / Fruit Ninja)
```js
function dataParse(raw) {
    return JSON.parse(hb_protect(raw));
}

function dataDeParse(parsed) {
    return hb_protect(JSON.stringify(parsed));
}
```

`hb_protect` is provided:
```js
function hb_protect(str) {
    return str.split('').map(c => String.fromCharCode(170 ^ c.charCodeAt(0))).join('');
}
```

### Nested Format (My Mini Mart)
```js
var data_cache = {};

function dataParse(raw) {
    const parsed = JSON.parse(raw);
    const val0 = JSON.parse(parsed.Value[0]);
    data_cache = { ...parsed };
    return val0;
}

function dataDeParse(parsed) {
    const raw = JSON.stringify(parsed);
    const rebuilt = { ...data_cache };
    rebuilt.Value[0] = raw;
    return JSON.stringify(rebuilt);
}
```

---

## ⚠️ Tips

- Use `console.log(raw)` and `console.log(parsed)` to inspect formats.
- Always test your `dataParse`/`dataDeParse` logic before calling `updateValues()`.
- Reload twice if changes don’t apply cleanly:
  ```js
  window.name = "reload_game"; // forces the script engine to reload the game window again
  window.location.reload();
  ```

---

## ✅ Update API

### `updateValues({ key: value })`
Modifies the parsed save object and saves it back automatically.

```js
updateValues({
    coins: 100000,
    xp: 9999
});
```

---

## Plans
- Code injection into the games
- Url Based Scripts. (Very Sketchy And Dangerous)
