// ==UserScript==
// @name         YouTube Playables Script Engine
// @namespace    http://tampermonkey.net/
// @version      2025-04-07
// @description  Script loader for youtube playables with some startup scripts
// @author       You
// @match        https://*.playables.usercontent.goog/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    //Contains the most important stuff
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

    // --- UI Elements ---
    const panel = document.createElement('div');
    const scriptEditor = document.createElement('textarea');
    const scriptSelect = document.createElement('select');
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

    scriptSelect.onchange = () => {
        const name = scriptSelect.value;
        scriptEditor.value = ScriptStore[name];
    };

    // Execute user script
    runBtn.onclick = () => {
        try {
            var code = scriptEditor.value;
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
            const sandbox = new Function('ytgame','hb_protect' , 'showMessage', 'dataParse', 'dataDeParse', code.replace("%updateValues", script_update_values));

            sandbox(ytgame, hb_protect, showMessage, dataParse, dataDeParse);
            showMessage('Script executed');
        } catch (e) {
            console.error('[Script Error]', e);
            showMessage('Script failed', 'error');
        }
    };

    panel.appendChild(scriptSelect);
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
