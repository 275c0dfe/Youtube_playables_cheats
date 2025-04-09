// My Mini Mart
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

//%updateValues

updateValues({"cashAmount":3000});
window.name = "reload_game";
window.location.reload();