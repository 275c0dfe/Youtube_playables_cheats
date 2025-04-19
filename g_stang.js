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
        speedLabel.innerText = `Fly Speed: ${slider.value}`;
    });

    // --- Coords Display ---
    const coords = document.createElement('div');
    coords.style.marginTop = '8px';
    coords.innerText = 'X: 0\nY: 0\nZ: 0';

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
        coords.innerText = `X: ${pos.x.toFixed(2)}\nY: ${pos.y.toFixed(2)}\nZ: ${pos.z.toFixed(2)}`;
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
        showMessage(`value changed: ${window.last_value}, ${ig.game.sessionData.collectedCoin}`);
        console.log(`value changed: ${window.last_value}, ${ig.game.sessionData.collectedCoin}`);
        window.last_value = ig.game.sessionData.collectedCoin;
    }
}, 50);

window.update_watcher = update_watcher;