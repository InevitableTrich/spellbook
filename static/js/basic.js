function format_string(str, ...params) {
    for (var i = 0; i < params.length; i++) {
        var reg = new RegExp("\\{" + i + "\\}", "gm");
        str = str.replace(reg, params[i]);
    }
    return str;
}