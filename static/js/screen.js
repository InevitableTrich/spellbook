// called when any key is pressed
document.addEventListener("keydown", function(event) {
    // ignore input if typing in an input field, or if control/command is held
    if (document.activeElement.nodeName == "INPUT" || event.ctrlKey || event.metaKey) {
        return;
    }

    // switch to functions based on key pressed
    switch (event.key) {
        case "Escape":  // on esc, close filters if its open on list page, edit_menu on book page
            if (page == "list") {
                close_screen('filter_menu');
            } else if (page == "book") {
                close_screen('edit_menu');
            }
            break;
        case "f":  // on 'f', toggle filters on list page
            if (page == "list") {
                toggle_screen('filter_menu');
            }
            break;
        case "e":  // on 'e', toggle filters on book page
            if (page == "book") {
                toggle_screen('edit_menu');
            }
            break;
    }
});

// toggle open/close screens
function toggle_screen(id) {
    const screen = document.getElementById(id);

    // if the screen is hidden, open
    if (screen.classList.contains("hidden")) {
        open_screen(id);
    } else {
        close_screen(id);
    }
}

// opens screens
function open_screen(id) {
    // unhide screen
    var screen = document.getElementById(id);
    screen.classList.remove("hidden");

    // prevent body from scrolling if it currently can
    var body = document.body;
    if (!body.hasAttribute("style")) {
        body.style.overflow = "hidden";
    }
}

// closes screens
function close_screen(id) {
    // hide the screen if it is visible
    var screen = document.getElementById(id);
    if (!screen.classList.contains("hidden")) {
        screen.classList.add("hidden");
    }

    // allow body to scroll again if it couldn't
    var body = document.body;
    if (body.hasAttribute("style")) {
        body.removeAttribute("style");
    }
}