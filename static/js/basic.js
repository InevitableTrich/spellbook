function format_string(str, ...params) {
    for (var i = 0, size = params.length; i < size; i++) {
        var reg = new RegExp("\\{" + i + "\\}", "gm");
        str = str.replace(reg, params[i]);
    }
    return str;
}

function sort_spells(list) {
    list.sort((spellX, spellY) => {
        if (spellX.name > spellY.name) return 1;
        return -1;
    })
}