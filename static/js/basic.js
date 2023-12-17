// keeps track of any active transitions that may need cancelling
var active_transitions = {};

// takes strings with {#} and replaces each successive number with passed arguments
function format_string(str, ...params) {
    for (var i = 0, size = params.length; i < size; i++) {
        var reg = new RegExp("\\{" + i + "\\}", "gm");
        str = str.replace(reg, params[i]);
    }
    return str;
}

// scrolls to top with smoothing
function scroll_to_top() {
    window.scrollBy({top: -(window.scrollY), left: 0, behavior: 'smooth'});
}