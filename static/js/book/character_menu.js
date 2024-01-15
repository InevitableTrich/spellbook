// toggle open/close on character menus
function toggle_character_button(id) {
    // if the menu has unset height (is open), close. else open
    if (document.getElementById(id).hasAttribute("open")) {
        close_collapsable(id, "calc(var(--tlrg) + 1rem)");
    } else {
        open_collapsable(id, 0);
        delayed_focus(id);
    }
}

// focuses inputs based on opened id
function delayed_focus(id) {
    setTimeout(() => {
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
    }, 175);
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
    character_selector.innerHTML += `<option value="${character_index}">${value}</option>`;

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
function delete_active_character() {
    // check for a double click
    if (!detect_double_click()) {
        return;
    }


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