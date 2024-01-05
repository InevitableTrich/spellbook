// set the displayed and stored character to the chosen index
function set_character(index) {
// set active character
    active_character = index;

// character selector
    // set the new character in storage
    localStorage.active_character = index;
    const character = character_list[index];

    // resize the character selector
    resize_character_selector();

// class and level
    // set level
    document.getElementById("level").value = character.level;

    // if data hasn't loaded, don't set data that needs loaded
    if (spell_list.length == 0) {
        return;
    }

    // set class
    set_class(character.class, false);
    // set level width
    const level_input = document.getElementById("level");
    if (character.level > 9) {
        level_input.style.width = "1.6rem";
    } else {
        level_input.style.width = ".8rem";
    }

    // get spell slot amounts
    get_spell_slots();

    // create spellbook
    create_spellbook();
}

// resize the character selector
function resize_character_selector() {
    const character_selector = document.getElementById("spellbook_selector");

    // create a temp element to get the width wanted to change the selector to
    var x = document.createElement("p"); // create new p element
    x.classList.add("spellbook_name"); // with same class for sizing
    x.classList.add("overflow"); // with overflow for width clipping
    character_selector.parentElement.style.width = "60%"; // set to occupy as large as it can for measurement
    // set a max-width for overflow clipping, set width to fit for correct size
    x.style = `max-width: calc(${character_selector.parentElement.clientWidth}px - 13rem); width: fit-content;`;
    character_selector.parentElement.style.width = ""; // remove fixed size
    x.innerHTML = character_selector.children[active_character].innerHTML; // set its text to the option
    document.body.appendChild(x); // add to the body (otherwise width == 0)
    const width = x.clientWidth; // get the width
    document.body.removeChild(x); // remove the new element

    // set the width to measured size, plus constant offset for down arrow and spacing
    character_selector.style.width = `calc(${width}px + 1.35rem)`;
}

// check for resizing of window, recalculate sizes
addEventListener("resize", (event) => {
    if (page == "book") {
        resize_character_selector();
    }
});

// takes filter_options classes and forms the class selector
function create_class_list() {
    const class_selector = document.getElementById("class_selector");
    // get classes from filter_options
    const class_list = [...filter_options["classes"]];
    // template for class options
    const class_template = `<option value="{0}">{0}</option>`

    var classes = "";
    // for all classes, create an option to select it
    for (var _class of class_list) {
        classes += format_string(class_template, _class);
    }

    // set the HTML
    class_selector.innerHTML = classes;
    // set the active class
    class_selector.value = character_list[active_character].class;
}

// set class to given class name. saves by default
function set_class(class_name, save=true) {
    // get class_selector and set the class to the new class
    const class_selector = document.getElementById("class_selector");
    class_selector.value = class_name;

    // create a temp element to get the width wanted to change the selector to
    var x = document.createElement("p"); // create new p element
    x.classList.add("class_level"); // with same class for sizing
    x.innerHTML = class_name; // set its text to the option
    document.body.appendChild(x); // add to the body (otherwise width == 0)
    const width = x.clientWidth; // get the width
    document.body.removeChild(x); // remove the new element

    // set the width to measured size, plus constant offset for down arrow and spacing
    class_selector.style.width = `calc(${width}px + 1.25rem)`;

    // change class in character, save character
    if (save) {
        character_list[active_character].class = class_name;
        save_characters();

        // set new spell slot values
        get_spell_slots();
    }
}

// sets stores level to storage, and changes width of input based on number
function set_level(level) {
    // on blank level, ignore
    if (level == "") {
        return;
    }

    // ensure integer
    level = parseInt(level);

    // adjust width for numbers > 9
    const level_input = document.getElementById("level");
    if (level > 9) {
        level_input.style.width = "1.6rem";
    } else {
        level_input.style.width = ".8rem";
    }

    // clamp the level to valid levels
    level = clamp(level, 1, 20);

    // set and save level
    document.getElementById("level").value = level;  // needed incase clamp is used from typing
    character_list[active_character].level = level;
    save_characters();

    // set new spell slot values
    get_spell_slots();
}