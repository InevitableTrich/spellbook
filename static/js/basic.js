// keeps track of any active transitions that may need cancelling
var active_transitions = {};
// current page (list or book)
var page;

// takes strings with {#} and replaces each successive number with passed arguments
function format_string(str, ...params) {
    for (var i = 0, size = params.length; i < size; i++) {
        var reg = new RegExp("\\{" + i + "\\}", "gm");
        str = str.replace(reg, params[i]);
    }
    return str;
}

// clamps an integer to minimum given and maximum given
function clamp(int, min, max) {
    return Math.max(Math.min(int, max), min);
}

// scrolls to top with smoothing
function scroll_to_top() {
    window.scrollBy({top: -(window.scrollY), left: 0, behavior: 'smooth'});
}

// adds content to page depending on last used screen (spell-list vs spell-book)
function get_page() {
    page = localStorage.active_page;

    if (page == "book") {
        build_book_page();
    } else {
        build_main_page();
    }
}

function change_page() {
    if (page == "book") {
        page = "list";
        localStorage.active_page = "list";
        build_main_page();

        sort_spells();
        filter_spells();
        create_filters();
    } else {
        page = "book";
        localStorage.active_page = "book";
        build_book_page();
    }
}