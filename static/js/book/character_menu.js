// toggle open/close on character menus
function toggle_character_button(id) {
    // if the menu has unset height (is open), close. else open
    if (document.getElementById(id).hasAttribute("open")) {
        close_character_button(id);
    } else {
        open_character_button(id);
    }
}

// open character menu button
function open_character_button(id) {
    // get the menu, set it open
    const menu = document.getElementById(id);
    menu.setAttribute("open", "");

    // expand menu
    var section_height = menu.scrollHeight;
    menu.style.height = section_height + "px";

    // leave it unset. waits 300ms which is transition time
    timeout_id = setTimeout(() => {
        menu.style.height = "unset";
        delete active_transitions[id];

        // also after transition finishes, if rename, enter text box
        var focus_id;
        switch (id) {
            case "rename":
                focus_id = "rename_character";
                break;
            case "add_new":
                focus_id = "add_new_character";
                break;
            case "new_counter":
                focus_id = "add_counter_name";
                break;
            default:
                focus_id = "";
        }
        if (focus_id != "") {
            document.getElementById(focus_id).focus();
        }
    }, 300);

    // add the transition wait timer to a tracker. used for cancelling if closed before open completes
    active_transitions[id] = timeout_id;
}

// close character menu button
function close_character_button(id) {
    // get the menu, set not as open
    var menu = document.getElementById(id);
    menu.removeAttribute("open");

    // remove current expanding animation if present
    if (Object.getOwnPropertyNames(active_transitions).indexOf(id) != -1) {
        clearTimeout(active_transitions[id]);
    }

    // set to current height for animation
    var section_height = menu.scrollHeight;
    menu.style.height = section_height + "px";

    // delay of 0 for animation
    setTimeout(() => {
        menu.style.height = "2.5rem";
    }, 0);
}

// renames the active character to what is in the textbox
function rename_character() {
    // get the text box
    const name_input = document.getElementById("rename_character");
    const value = name_input.value;

    // if there is no text, ignore button press
    if (value == "") {
        return;
    }

    // set it on the character
    character_list[active_character].name = value;
    // set it on the name display
    document.getElementById("spellbook_selector").children[active_character].innerHTML = value;
    resize_character_selector();

    // kick out of the input
    name_input.setAttribute("disabled", "");
    name_input.removeAttribute("disabled");

    // close the rename section
    toggle_character_button("rename");

    // clear the input
    name_input.value = "";

    // save character
    save_characters();
}

// adds a new character
function add_new_character() {
    // get the name input and the value
    const name_input = document.getElementById("add_new_character");
    const value = name_input.value;

    // ignore if value is empty
    if (value == "") {
        return;
    }

    // create a character and set its name
    var new_char = Character.new_character();
    new_char.name = value;

    // add it to the list of characters and create a new option in the dropdown
    character_list.push(new_char);
    const character_selector = document.getElementById("spellbook_selector");
    const character_index = character_list.length - 1;
    character_selector.innerHTML += `<option value="${character_index}">${value}</option>`

    // set the active character
    document.getElementById("spellbook_selector").value = character_index;
    set_character(character_index);

    // kick out of the input
    name_input.setAttribute("disabled", "");
    name_input.removeAttribute("disabled");

    // close the rename section
    toggle_character_button("add_new");

    // clear the input
    name_input.value = "";

    // save the new character
    save_characters();
}

// deletes the active character. sets previous character as active
// if no characters exist, new one is forced.
var delete_click_tracker = 0;
function delete_active_character() {
    // if there are no previous clicks, add a new one that expires in 500ms
    if (delete_click_tracker < 1) {
        var click_id = setTimeout(() => {
            delete_click_tracker = 0;
        }, 500)

        // add the click to the tracker
        delete_click_tracker = 1;

        return;
    }

    // disallow further second clicks until the clear
    delete_click_tracker = -99;

    // delete the character select option
    const character_selector = document.getElementById("spellbook_selector");
    character_selector.children[active_character].remove();
    // delete the character from data
    character_list.splice(active_character, 1);

    // update character selector values
    for (var i = 0, count = character_list.length; i < count; i++) {
        character_selector.children[i].value = i;
    }

    // close the menu
    toggle_character_button("delete");

    // change to previous character or next character if there are characters left
    if (character_list.length > 0) {
        var index;
        if (active_character >= 1) {
            index = active_character - 1;
        } else {
            index = active_character;
        }

        character_selector.value = index;
        set_character(index);
    } else {
    // else create a new blank character
        toggle_character_button("add_new");
        document.getElementById("add_new_character").value = "Unnamed";
        add_new_character();

        return; // add_new_character already saves
    }

    // save changes
    save_characters();
}