//Halfbrick JetPack Joyride
function dataParse(raw) {
    const parsed = JSON.parse(hb_protect(raw));
    return parsed;
}

function dataDeParse(parsed){
        var raw = JSON.stringify(parsed);
        return hb_protect(raw);
}

//%updateValues

updateValues({"coin":300});
window.name = "reload_game";
window.location.reload();