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
    // get the page variable
    page = localStorage.active_page;

    // build the appropriate page
    if (page == "book") {
        build_book_page();
    } else {
        build_main_page();
    }
}

// changes the page between book and list
function change_page() {
    // set the scroll to zero
    window.scrollBy({top: -(window.scrollY), left: 0});

    // if page is book,
    if (page == "book") {
        // set the page to list and build the page
        page = "list";
        localStorage.active_page = "list";
        build_main_page();

        // then sort spells, filter them and create the filters
        sort_spells();
        filter_spells();
        create_filters();
    } else {
    // if the page is list
        // clear any active filters
        clear_filters();
        // set the page to book and build the page
        page = "book";
        localStorage.active_page = "book";
        build_book_page();
    }
}

// opens a collapsable
function open_collapsable(id, expand_offset) {
    // get the collapsable, set it open
    const collapsable = document.getElementById(id);
    collapsable.setAttribute("open", "");

    // expand menu
    const section_height = collapsable.scrollHeight;
    collapsable.style.height = section_height - expand_offset + "px";

    // leave it unset. waits 300ms which is transition time
    timeout_id = setTimeout(() => {
        collapsable.style.height = "unset";
        delete active_transitions[id];
    }, 300);

    // add the transition wait timer to a tracker. used for cancelling if closed before open completes
    active_transitions[id] = timeout_id;
}

// closes a collapsable
function close_collapsable(id, height) {
    // get the collapsable, set not as open
    const collapsable = document.getElementById(id);
    collapsable.removeAttribute("open");

    // remove current expanding animation if present
    if (Object.getOwnPropertyNames(active_transitions).indexOf(id) != -1) {
        clearTimeout(active_transitions[id]);
    }

    // set to current height for animation
    const section_height = collapsable.scrollHeight;
    collapsable.style.height = section_height + "px";

    // delay of 0 for animation
    setTimeout(() => {
        collapsable.style.height = height;
    }, 0);
}

// detects double clicks (not exclusive to a button)
var delete_click_tracker = 0;
function detect_double_click() {
    // if there are no previous clicks, add a new one that expires in 500ms
    if (delete_click_tracker == 0) {
        var click_id = setTimeout(() => {
            delete_click_tracker = 0;
        }, 500)

        // add the click to the tracker
        delete_click_tracker = click_id;

        // no double click
        return false;
    }

    // remove the click and its timer
    clearInterval(delete_click_tracker);
    delete_click_tracker = 0;

    // double click detected
    return true;
}