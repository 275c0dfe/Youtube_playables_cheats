// ==UserScript==
// @name         YouTube Playables Script Engine
// @namespace    http://tampermonkey.net/
// @version      2025-04-07
// @description  Script loader with full control over update flow for YouTube Playables cheats 🧪
// @author       You
// @match        https://*.playables.usercontent.goog/*
// @match        https://*.h5games.usercontent.goog/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    const ScriptStore = {

        'Default': `// Default Script
//Works on Crossy Road, Sets coins to 100

function dataParse(raw) {
    const parsed = JSON.parse(raw);
    console.log("Raw Data: ", raw);
    return parsed;
}

function dataDeParse(parsed){
        var raw = JSON.stringify(parsed);
        return raw;
}

//%updateValues

updateValues({"coins":200});
window.name = "reload_game";
window.location.reload();
console.log("reload 1");
`,
        'blank': ``,
        'Retro Drift':`//Retro Drift
//Run In eval mode
if (window.update_watcher) {
    clearInterval(update_watcher);
}
window.last_value = ig.game.sessionData.collectedCoin;
window.last_value_e = ig.game.entities.length
window.lock_pos_z = 10;
window.last_z = ig.gameScene.carSkeleton.chassis.position.y;
window.lock_z_enabled = false

window.setVScale = (scale)=>{
    ig.gameScene.carSkeleton.chassis.scaling.set(scale, scale, scale);
}

window.setVPos = (x , y , z)=>{
    ig.gameScene.carSkeleton.chassis.position.set(x , y, z);
}

function createFlyModMenu(targetMesh) {
    if (document.getElementById('mod-menu')) return;

    const menu = document.createElement('div');
    menu.id = 'mod-menu';
    Object.assign(menu.style, {
        position: 'fixed',
        top: '60px',
        left: '20px',
        background: 'rgba(0,0,0,0.8)',
        padding: '12px',
        color: 'white',
        zIndex: 99999,
        fontFamily: 'monospace',
        fontSize: '13px',
        borderRadius: '8px',
        width: '180px'
    });

    // --- Fly Checkbox ---
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.id = 'fly-toggle';
    checkbox.style.marginRight = '5px';

    const label = document.createElement('label');
    label.innerText = 'Enable Fly';
    label.htmlFor = 'fly-toggle';

    // --- Speed Slider ---
    const speedLabel = document.createElement('div');
    speedLabel.innerText = 'Fly Speed: 0.3';
    const slider = document.createElement('input');
    slider.type = 'range';
    slider.min = '0.1';
    slider.max = '2.0';
    slider.step = '0.1';
    slider.value = '0.3';
    slider.style.width = '100%';

    slider.addEventListener('input', () => {
        speedLabel.innerText = \`Fly Speed: \${slider.value}\`;
    });

    // --- Coords Display ---
    const coords = document.createElement('div');
    coords.style.marginTop = '8px';
    coords.innerText = 'X: 0\\nY: 0\\nZ: 0';

    // --- Fly Logic ---
    let flyMode = false;
    let baseY = targetMesh.position.y;
    let flyT = 0;
    let orgin_mass = 1;

    checkbox.addEventListener('change', () => {
        flyMode = checkbox.checked;
        if (flyMode) {
            // freeze physics
            if (targetMesh.physicsImpostor) {
                targetMesh.physicsImpostor.setMass(0);
            }

            // override isTouchingGround
            if (ig?.gameScene?.carSkeleton) {
                Object.defineProperty(ig.gameScene.carSkeleton, 'isTouchingGround', {
                    get: () => true,
                    set: () => {},
                    configurable: true
                });
            }
        }
        else{
            targetMesh.physicsImpostor.setMass(orgin_mass);
        }
    });

    // Movement controls
    document.addEventListener('keydown', (e) => {
        if (!flyMode) return;
        const speed = parseFloat(slider.value);
        switch (e.key.toLowerCase()) {
            case 'w': targetMesh.position.z += speed; break;
            case 's': targetMesh.position.z -= speed; break;
            case 'a': targetMesh.position.x -= speed; break;
            case 'd': targetMesh.position.x += speed; break;
            case 'q': targetMesh.position.y += speed; break;
            case 'e': targetMesh.position.y -= speed; break;
        }
    });

    setInterval(() => {
        const pos = targetMesh.position;
        coords.innerText = \`X: \${pos.x.toFixed(2)}\\nY: \${pos.y.toFixed(2)}\\nZ: \${pos.z.toFixed(2)}\`;
    }, 60);

    // Add to menu
    menu.appendChild(checkbox);
    menu.appendChild(label);
    menu.appendChild(document.createElement('br'));
    menu.appendChild(speedLabel);
    menu.appendChild(slider);
    menu.appendChild(coords);
    document.body.appendChild(menu);
}

createFlyModMenu(ig.gameScene.carSkeleton.chassis);


var update_watcher = setInterval(() => {

    if (ig.game.sessionData.collectedCoin < 0) {
        ig.game.sessionData.collectedCoin = 100;
        window.last_value = 100;
    }
    if (ig.game.sessionData.collectedCoin > window.last_value) {
        ig.game.sessionData.collectedCoin += (ig.game.sessionData.collectedCoin - window.last_value) * 10;
        showMessage(\`value changed: \${window.last_value}, \${ig.game.sessionData.collectedCoin}\`);
        console.log(\`value changed: \${window.last_value}, \${ig.game.sessionData.collectedCoin}\`);
        window.last_value = ig.game.sessionData.collectedCoin;
    }
}, 50);

window.update_watcher = update_watcher;
        `,
        'Hill Climb Racing': `// Hill Climb Racing Lite
//Sets coins to 300k

function dataParse(raw) {
    const parsed = JSON.parse(atob(raw));
    return parsed;
}

function dataDeParse(parsed){
        var raw = btoa(JSON.stringify(parsed));
        return raw;
}

//Very Important
//%updateValues

updateValues({"coins":300000});
window.name = "reload_game";
window.location.reload();
console.log("reload 1");
`,
        'My Mini Mart':`
// My Mini Mart
// Sets Cash = 30k
var data_cache = {};
function dataParse(raw) {
    const parsed = JSON.parse(raw);
    var val0 = JSON.parse(parsed.Value[0]);
    data_cache = { ...parsed };
    console.log("Data: ", val0);
    console.log("Cash?: ", val0.cashAmount);
    return val0;
}

function dataDeParse(parsed){
        var raw = JSON.stringify(parsed);
        var raw_obj = { ...data_cache } ;
        raw_obj.Value[0] = raw;
        var raw_whole = JSON.stringify(raw_obj);
        return raw_whole;
}

%updateValues

updateValues({"cashAmount":30000});
window.name = "reload_game";
window.location.reload();`,

        'Jetpack Joyride':`
//Halfbrick JetPack Joyride
//Sets coins = 30k
function dataParse(raw) {
    const parsed = JSON.parse(hb_protect(raw));
    return parsed;
}

function dataDeParse(parsed){
        var raw = JSON.stringify(parsed);
        return hb_protect(raw);
}

//%updateValues

updateValues({"coin":30000});
window.name = "reload_game";
window.location.reload();`,

'Fruit Ninja':`
//Halfbrick Fruit Ninja
//Sets Startfruit 300k
function dataParse(raw) {
    const parsed = JSON.parse(hb_protect(raw));
    return parsed;
}

function dataDeParse(parsed){
        var raw = JSON.stringify(parsed);
        return hb_protect(raw);
}

//%updateValues

updateValues({"star_fruit":300000});
window.name = "reload_game";
window.location.reload();`,

        'Stealth Master':`
//Stealth Master
//Gives 10k cash
function dataParse(raw) {
    const parsed = JSON.parse(raw);
    console.log(parsed.IntStorage.kCoins);
    //alt exploit in parse
    parsed.IntStorage.kCoins += 10000;
    return parsed;
}

function dataDeParse(parsed){
        var raw = JSON.stringify(parsed);
        return raw;
}

//%updateValues

updateValues({});
window.name = "reload_game";
window.location.reload();`,
    };


    const script_update_values = `
                // Core update function, script calls this directly
              async function updateValues(values) {
              try {
              var finalData_raw = await ytgame.game.loadData(); // add Parse
              var finalData = dataParse(finalData_raw);
              var v_key = Object.keys(values);
              for(var i = 0; i<v_key.length; i++){
                var key = v_key[i];
                finalData[key] = values[key]; //Update Values
               }
              var final_Ser = dataDeParse(finalData);
              if(final_Ser){
              await ytgame.game.saveData(final_Ser); // add deParse
              showMessage('Data updated');
              }
              else{
              console.log("error");
              }
              } catch (e) {
              console.error('[Update Error]', e);
              showMessage(\`Failed to update data: \${e}\`, 'error');
              }
              }
              `;

    if (window.name == "reload_game") {
        window.name = "";
        console.log("Second reload triggered");
        setTimeout(() => {
            window.location.reload();
        }, 1400); // delay to let first load finish
    }

    function hb_protect(e){
        for(var a="",t=0;t<e.length;t++)a+=String.fromCharCode(170^e.charCodeAt(t));return a
    }

    function dataParse(raw) {
        try {
            console.log("system parse");
            return JSON.parse(raw);
        } catch {
            return raw;
        }
    }

    function dataDeParse(obj) {
        try {
            return JSON.stringify(obj);
        } catch {
            return obj;
        }
    }

    // Message UI
    function showMessage(text, type = 'info') {
        const msg = document.createElement('div');
        msg.innerText = text;
        Object.assign(msg.style, {
            position: 'fixed',
            top: '50px',
            left: '10px',
            zIndex: 99999,
            padding: '10px 15px',
            backgroundColor: type === 'error' ? '#300' : '#111',
            color: type === 'error' ? '#f66' : '#0f0',
            border: `1px solid ${type === 'error' ? '#f66' : '#0f0'}`,
            borderRadius: '8px',
            fontSize: '14px',
            fontFamily: 'monospace',
            opacity: '1',
            transition: 'opacity 0.5s ease',
        });
        document.body.appendChild(msg);
        setTimeout(() => {
            msg.style.opacity = '0';
            setTimeout(() => msg.remove(), 500);
        }, 1000);
    }

    // Core update function, script calls this directly
    async function updateValues(values) {
        try {
            var finalData_raw = await ytgame.game.loadData(); // add Parse
            var finalData = dataParse(finalData_raw);
            var v_key = Object.keys(values);
            for(var i = 0; i<v_key.length; i++){
                var key = v_key[i];
                finalData[key] = values[key]; //Update Values
            }
            await ytgame.game.saveData(dataDeParse(finalData)); // add deParse
            showMessage('Data updated');
        } catch (e) {
            console.error('[Update Error]', e);
            showMessage(`Failed to update data: ${e}`, 'error');
        }
    }

    if(window.name.includes("patch: ")){
        //patch
    }

    // --- UI Elements ---
    const panel = document.createElement('div');
    const scriptEditor = document.createElement('textarea');
    const scriptSelect = document.createElement('select');
    const envSelect = document.createElement('select');
    const runBtn = document.createElement('button');

    // Panel Style
    Object.assign(panel.style, {
        position: 'fixed',
        top: '80px',
        left: '10px',
        zIndex: 99999,
        padding: '15px',
        backgroundColor: '#111',
        color: '#0f0',
        border: '1px solid #0f0',
        borderRadius: '12px',
        fontFamily: 'monospace',
        fontSize: '14px',
        width: 'fit-content',
        boxShadow: '0 0 10px #0f0a',
        display:'none',
    });

    Object.assign(scriptEditor.style, {
        width: '90%',
        margin: '0 auto',
        height: '200px',
        backgroundColor: '#000',
        color: '#0f0',
        border: '1px solid #0f0',
        borderRadius: '8px',
        fontFamily: 'monospace',
        fontSize: '13px',
        padding: '10px',
        marginTop: '10px',
        marginBottom: '10px',
        resize: 'vertical',
    });

    Object.assign(runBtn.style, {
        width: '100%',
        padding: '10px',
        backgroundColor: '#0f0',
        color: '#000',
        fontWeight: 'bold',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
    });

    runBtn.textContent = '▶ Run Script';

    // Load dropdown options
    for (let name in ScriptStore) {
        const opt = document.createElement('option');
        opt.value = name;
        opt.textContent = name;
        scriptSelect.appendChild(opt);
    }

    var exec_env = ["ytgame-sandbox" , "eval"];

    for(var i = 0; i < exec_env.length; i++){
        var env_name = exec_env[i];
        var opt = document.createElement('option');
        opt.value = env_name;
        opt.textContent = env_name;
        envSelect.appendChild(opt);
    }

    scriptSelect.onchange = () => {
        const name = scriptSelect.value;
        scriptEditor.value = ScriptStore[name];
    };

    // Execute user script
    runBtn.onclick = () => {
        try {
            var code = scriptEditor.value;
            var env_name = envSelect.value;


            if(env_name == "eval"){
                var modified_code = code.replace("%updateValues", script_update_values);
                eval(modified_code);
            }


            if(env_name == "ytgame-sandbox"){
            const sandbox = new Function('ytgame','hb_protect' , 'showMessage', 'dataParse', 'dataDeParse', code.replace("%updateValues", script_update_values));
            sandbox(ytgame, hb_protect, showMessage, dataParse, dataDeParse);
            }


            showMessage('Script executed');
        } catch (e) {
            console.error('[Script Error]', e);
            showMessage('Script failed', 'error');
        }
    };

    panel.appendChild(scriptSelect);
    panel.appendChild(envSelect);
    panel.appendChild(scriptEditor);
    panel.appendChild(runBtn);
    panel.id = 'ytp-script-ui';

    const reloadBtn = document.createElement('button');
    reloadBtn.textContent = '🔄 Reload';
    Object.assign(reloadBtn.style, {
        width: '100%',
        marginTop: '8px',
        padding: '10px',
        backgroundColor: '#222',
        color: '#0f0',
        border: '1px solid #0f0',
        borderRadius: '8px',
        fontFamily: 'monospace',
        cursor: 'pointer',
    });
    reloadBtn.onclick = () => location.reload();
    panel.appendChild(reloadBtn);
    document.body.appendChild(panel);

    // Toggle panel
    const toggleBtn = document.createElement('button');
    toggleBtn.innerText = 'Show';
    Object.assign(toggleBtn.style, {
        position: 'fixed',
        top: '10px',
        left: '10px',
        zIndex: 99999,
        padding: '10px 15px',
        backgroundColor: '#111',
        color: '#0f0',
        border: '1px solid #0f0',
        borderRadius: '8px',
        fontSize: '14px',
        fontFamily: 'monospace',
        cursor: 'pointer',
    });

    let panelVisible = false;
    toggleBtn.onclick = () => {
        panelVisible = !panelVisible;
        panel.style.display = panelVisible ? 'block' : 'none';
        toggleBtn.innerText = panelVisible ? 'Hide' : 'Show';
    };

    document.addEventListener('keydown', (e) => {
        const isInsideUI = e.target.closest('#ytp-script-ui');
        if (isInsideUI) {
            e.stopImmediatePropagation(); // Stop the game's key handler
            // optionally preventDefault ONLY if you're not typing special keys
            // e.preventDefault();
        }
    }, true);



    document.body.appendChild(toggleBtn);
    scriptEditor.value = ScriptStore['Default'];
})();
