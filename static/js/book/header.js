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

// counters
    // load counters
    load_counters();

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
        level_input.classList.remove("short_level");
        level_input.classList.add("long_level");
    } else {
        level_input.classList.remove("long_level");
        level_input.classList.add("short_level");
    }

    // get spell slot amounts
    get_spell_slots();

    // set subclass (creates spellbook)
    set_subclass(character.subclass);
}

// resize the character selector
function resize_character_selector() {
    const character_selector = document.getElementById("spellbook_selector");

    // create a temp element to get the width wanted to change the selector to
    // if on mobile, add some width offset
    var width_offset = 0;
    if (window.innerHeight >= 1280) {
        width_offset = 16;
    }

    var x = document.createElement("p"); // create new p element
    x.classList.add("spellbook_name"); // with same class for sizing
    x.classList.add("overflow"); // with overflow for width clipping
    character_selector.parentElement.style.width = "100%"; // set to occupy as large as it can for measurement
    // set a max-width for overflow clipping, set width to fit for correct size
    x.style = `max-width: calc(${character_selector.parentElement.clientWidth}px - 13rem); width: fit-content;`;
    character_selector.parentElement.style.width = ""; // remove fixed size
    x.innerHTML = character_selector.children[active_character].innerHTML; // set its text to the option
    document.body.appendChild(x); // add to the body (otherwise width == 0)
    const width = x.clientWidth + width_offset; // get the width
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

    // get the subclass selector
    const subclass_selector = document.getElementById("subclass_selector");

    // get all of the corresponding subclasses
    var subclass_options = [];
    for (var subclass of filter_options["subclasses"]) {
        if (subclass.startsWith(class_name)) {
            subclass_options.push(subclass.substring(subclass.indexOf("(") + 1, subclass.length - 1));
        }
    }

    // add subclasses (and None) to subclass options
    subclass_options.unshift("None");
    var selector_options = "";
    for (var subclass_option of subclass_options) {
        selector_options += `<option value="${subclass_option}">(${subclass_option})</option>`;
    }

    // set the html
    subclass_selector.innerHTML = selector_options;

    // create a temp element to get the width wanted to change the selector to
    // if on mobile, add some width offset
    var width_offset = 0;
    if (window.innerHeight >= 1280) {
        width_offset = 16;
    }

    var x = document.createElement("p"); // create new p element
    x.classList.add("class_level_text"); // with same class for sizing
    x.innerHTML = class_name; // set its text to the option
    document.body.appendChild(x); // add to the body (otherwise width == 0)
    const width = x.clientWidth + width_offset; // get the width
    document.body.removeChild(x); // remove the new element

    // set the width to measured size, plus constant offset for down arrow and spacing
    class_selector.style.width = `calc(${width}px + 1.25rem)`;


    // change class in character, save character
    if (save) {
        character_list[active_character].class = class_name;
        save_characters();

        // set new spell slot values
        get_spell_slots();
        add_spell_slots();

        // set subclass
        set_subclass("None");
    }
}

// sets the characters subclass
function set_subclass(subclass) {
    // get the subclass selector, set its value
    const subclass_selector = document.getElementById("subclass_selector");
    subclass_selector.value = subclass;

    // create a temp element to get the width wanted to change the selector to
    // if on mobile, add some width offset
    var width_offset = 0;
    if (window.innerHeight >= 1280) {
        width_offset = 16;
    }

    var x = document.createElement("p"); // create new p element
    x.classList.add("class_level_text"); // with same class for sizing
    x.innerHTML = subclass; // set its text to the option
    document.body.appendChild(x); // add to the body (otherwise width == 0)
    const width = x.clientWidth + width_offset; // get the width
    document.body.removeChild(x); // remove the new element

    // set the width to measured size, plus constant offset for down arrow and spacing
    subclass_selector.style.width = `calc(${width}px + 2.25rem)`;

    // if there is no subclass, set to None
    if (subclass == null) {
        subclass = "None";
    }

    // re-create the spellbook to include subclass spells
    create_spellbook();

    character_list[active_character].subclass = subclass;
    save_characters();
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
        level_input.classList.remove("short_level");
        level_input.classList.add("long_level");
    } else {
        level_input.classList.remove("long_level");
        level_input.classList.add("short_level");
    }

    // clamp the level to valid levels
    level = clamp(level, 1, 20);

    // set and save level
    document.getElementById("level").value = level;  // needed incase clamp is used from typing
    character_list[active_character].level = level;
    save_characters();

    // set new spell slot values
    get_spell_slots();
    add_spell_slots();
}