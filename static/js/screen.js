// called when any key is pressed
document.addEventListener("keydown", function(event) {
    // ignore input if typing in an input field, or if control/command is held
    if (document.activeElement.nodeName == "INPUT" || event.ctrlKey || event.metaKey) {
        return;
    }

    // switch to functions based on key pressed
    switch (event.key) {
        case "Escape":  // on esc, close filters if its open
            close_filters();
            break;
        case "f":  // on (unmodified) 'f', toggle filters
            toggle_filters();
            break;
    }
});

// toggle open/close filter menu
function toggle_filters() {
    const screen = document.getElementById("filter_menu")
    if (screen.classList.contains("hidden")) {
        open_filters();
    } else {
        close_filters();
    }
}

// opens filter menu
function open_filters() {
    // unhide screen
    var screen = document.getElementById("filter_menu");
    screen.classList.remove("hidden");

    // prevent body from scrolling if it currently can
    var body = document.body;
    if (!body.hasAttribute("style")) {
        body.style.overflow = "hidden";
    }
}

// closes filter menu
function close_filters() {
    // hide the filter menu if it is visible
    var screen = document.getElementById("filter_menu");
    if (!screen.classList.contains("hidden")) {
        screen.classList.add("hidden");
    }

    // allow body to scroll again if it couldn't
    var body = document.body;
    if (body.hasAttribute("style")) {
        body.removeAttribute("style");
    }
}