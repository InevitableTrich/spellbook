function format_string(str, ...params) {
    for (var i = 0, size = params.length; i < size; i++) {
        var reg = new RegExp("\\{" + i + "\\}", "gm");
        str = str.replace(reg, params[i]);
    }
    return str;
}

function scroll_to_top() {
    window.scrollBy({top: -(window.scrollY), left: 0, behavior: 'smooth'});
}

function sort_spells(list) {
    list.sort((spellX, spellY) => {
        if (spellX.name > spellY.name) return 1;
        return -1;
    })
}