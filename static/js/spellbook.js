// spellbook data
const STORAGE_VERSION = 2;
var character_list = [];  // list of characters
var active_character = 0;  // index of active character
var spellbook_list = [];  // spells for the active spellbook

// character class, stores relavent class info
class Character {
    static new_character() {
        return new Character({
            "name": "Unnamed",
            "class": "Wizard",
            "level": "1",
            "spell_list": [],
            "slots_used": {},
            "prepared_list": [],
            "specialized_list": []
        })
    }
    // used for loading a character from LocalStorage
    constructor(data) {
            this.name = data.name;
            this.class = data.class;
            this.level = data.level;
            this.spell_list = data.spell_list;
            this.slots_used = data.slots_used;
            this.prepared_list = data.prepared_list;
            this.specialized_list = data.specialized_list;
    }
}

// loads characters from localStorage
function load_characters() {
    // check the current storage version [CREATE A TRANSLATION FUNCTION TO GO FROM V1 TO V2]
    if (localStorage.getItem("version") != STORAGE_VERSION) {
        return;
    }

    // load characters from localStorage as JSON
    var storage_characters = JSON.parse(localStorage.characters);

    // create the characters, place them in character_list
    for (var character of storage_characters) {
        character_list.push(new Character(character));
    }

    // get the active character
    active_character = parseInt(localStorage.active_character);
}

// change spells in current character's spellbook to reflect presence
function update_spell_buttons() {
    for (var spell_id of character_list[active_character].spell_list) {
        // must be in a try block incase the spell is not present due to filters
        try {
            document.getElementById(spell_id + "_add").children[0].innerHTML = "Quick Remove";
        } catch(e) {}  // no error case
    }
}

// stores all characters into localStorage
function save_characters() {
    // turn character_list into a string
    const character_string = JSON.stringify(character_list);
    // put it in localStorage
    localStorage.characters = character_string;
}

// toggles a spells presence in the active spellbook
function toggle_spell_in_book(num) {
    // if the spell cannot be found, add. else, remove
    if (character_list[active_character].spell_list.indexOf(num) == -1) {
        add_to_spellbook(num);
    } else {
        remove_from_spellbook(num);
    }

    // save to localStorage
    save_characters();
}

// add a spell to the active spellbook
function add_to_spellbook(num) {
    // add to current spellbook
    character_list[active_character].spell_list.push(num);

    // update the spells quick add button
    document.getElementById(num + "_add").children[0].innerHTML = "Quick Remove";
}

// remove a spell from the active spellbook
function remove_from_spellbook(num) {
    // get the spell_list and index of the id
    var list = character_list[active_character].spell_list;
    const id_index = list.indexOf(num);

    // remove it from the list
    list.splice(id_index, 1);

    // find the numer in the prepare list
    const prep_ndx = character_list[active_character].prepared_list.indexOf(num);
    // if it is found, remove it
    if (prep_ndx != -1) {
        character_list[active_character].prepared_list.splice(prep_ndx, 1);
    }

    // update the spells quick add button
    document.getElementById(num + "_add").children[0].innerHTML = "Quick Add";
}

// removes a spell from the active spellbook and deletes it from the screen
function delete_from_spellbook(num) {
    // remove from the list
    remove_from_spellbook(num);

    // delete the visual element
    document.getElementById(num).parentElement.remove();

    // get the header
    const spell_level = spell_list[num].level;
    const spell_holder = document.getElementById("level_" + spell_level + "_spells");

    // check for empty, and if empty, delete holder and header
    if (spell_holder.children.length == 0) {
        spell_holder.remove();
        document.getElementById("level_" + spell_level + "_header").remove();
    }

    // save character
    save_characters();
}

// set the spell slot display's slot counts
function get_spell_slots() {
    // class caster classification
    const class_caster_type = {
        "Artificer": "sub",
        "Bard": "main",
        "Cleric": "main",
        "Druid": "main",
        "Fighter": "subclass",
        "Monk": "none",
        "Paladin": "sub",
        "Ranger": "sub",
        "Rogue": "subclass",
        "Sorcerer": "main",
        "Warlock": "warlock",
        "Wizard": "main"
    }

    // slot table for caster types
    const caster_slot_table = {
        "main": [[2], [3], [4, 2], [4, 3], [4, 3, 2], [4, 3, 3], [4, 3, 3, 1], [4, 3, 3, 2], [4, 3, 3, 3, 1],
                 [4, 3, 3, 3, 2], [4, 3, 3, 3, 2, 1], [4, 3, 3, 3, 2, 1], [4, 3, 3, 3, 2, 1, 1], [4, 3, 3, 3, 2, 1, 1],
                 [4, 3, 3, 3, 2, 1, 1, 1], [4, 3, 3, 3, 2, 1, 1, 1], [4, 3, 3, 3, 2, 1, 1, 1, 1],
                 [4, 3, 3, 3, 3, 1, 1, 1, 1], [4, 3, 3, 3, 3, 2, 1, 1, 1], [4, 3, 3, 3, 3, 2, 2, 1, 1]],

        "sub": [[2], [2],  [3], [3], [4, 2], [4, 2], [4, 3], [4, 3], [4, 3, 2], [4, 3, 2], [4, 3, 3], [4, 3, 3],
                [4, 3, 3, 1], [4, 3, 3, 1], [4, 3, 3, 2], [4, 3, 3, 2], [4, 3, 3, 3, 1], [4, 3, 3, 3, 1],
                [4, 3, 3, 3, 2], [4, 3, 3, 3, 2]],

        "warlock": [[1], [2], [0, 2], [0, 2], [0, 0, 2], [0, 0, 2], [0, 0, 0, 2], [0, 0, 0, 2], [0, 0, 0, 0, 2],
                    [0, 0, 0, 0, 2], [0, 0, 0, 0, 3], [0, 0, 0, 0, 3], [0, 0, 0, 0, 3], [0, 0, 0, 0, 3],
                    [0, 0, 0, 0, 3], [0, 0, 0, 0, 3], [0, 0, 0, 0, 4], [0, 0, 0, 0, 4], [0, 0, 0, 0, 4],
                    [0, 0, 0, 0, 4]],

        "subclass": [[], [], [2], [3], [3], [3], [4, 2], [4, 2], [4, 2], [4, 3], [4, 3], [4, 3], [4, 3, 2], [4, 3, 2],
                    [4, 3, 2], [4, 3, 3], [4, 3, 3], [4, 3, 3], [4, 3, 3, 1], [4, 3, 3, 1]],

        "none": [[], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], []]
    }

    // get the class and level
    const character_class = document.getElementById("class_selector").value;
    const character_level = document.getElementById("level").value;

    // get the corresponding list
    var slot_list = caster_slot_table[class_caster_type[character_class]][character_level-1];
    const slot_level_count = slot_list.length;

    // set the slots given
    for (var i = 0, count = slot_level_count; i < count; i++) {
        document.getElementById("slot_" + (i+1)).innerHTML = slot_list[i];
    }

    // fill the rest with 0s
    for (var i = slot_level_count, count = 9; i < count; i++) {
        document.getElementById("slot_" + (i+1)).innerHTML = 0;
    }
}
// check for resizing of window, recalculate sizes
addEventListener("resize", (event) => {
    if (page == "book") {
        resize_character_selector();
    }
});

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

// adds spells and headers to characters spellbook
function create_spellbook() {
    // collect spells and place into list
    spellbook_list = character_list[active_character].spell_list.slice();

    // holds each body section for spells based on level
    var spell_sections = {
        0: "", 1: "", 2: "", 3: "", 4: "", 5: "", 6: "", 7: "", 8: "", 9: ""
    };

    const prep_template = `<div class="book_spell_container">
                               <div id="prep_{0}" class="prepare button" onclick="prep_spell(event, {0})"></div>`;
    var spell;
    var level;
    // for each spell in the spell list,
    for (var spell_id of spellbook_list) {
        // get the spell and its level
        spell = spell_list[spell_id];
        level = parseInt(spell.level);

        // if that level's header doesn't exist, add it
        if (spell_sections[level] == "") {
            spell_sections[level] = create_level_header(level);
        }

        // add the spell to the sections
        if (spell.level == 0) {
            spell_sections[level] += spell.create_book_head(false);
        } else {
            spell_sections[level] += format_string(prep_template, spell.index) + spell.create_book_head(true) + "</div>";
        }
    }

    var body = "";
    var section;
    // for each level of spell
    for (var i = 0; i <= 9; i++) {
        section = spell_sections[i];
        // if the section has content, add it and close it's container
        if (section != "") {
            body += section + "</div>";
        }
    }

    // set the spellbook list to the content
    document.getElementById("book_list").innerHTML = body;
    // add the correct spell slot buttons
    add_spell_slots();
    prep_saved_spells();
}

// return html for level headers
function create_level_header(level) {
    // header template
    const header_template = `
        <div id="level_${level}_header" class="level_header row_container">
            <p class="level_header">{0}</p>
            {1}
        </div>
        <div id="level_${level}_spells">
    `;
    // container for holding interactable slots
    const level_row_container = `
        <div id="level_{0}_slots"  class="row_container"></div>
    `;

    var text;
    var container;
    // format changing checks
    if (level == 0) {
        text = "Cantrips";
        container = "";
    } else if (parseInt(document.getElementById("slot_" + level).innerHTML) > 0) {
        text = `Level ${level}: &nbsp;`; // Level X:
        container = format_string(level_row_container, level);
    } else {
        text = `Level ${level}`; // Level X
        container = format_string(level_row_container, level);
    }

    return format_string(header_template, text, container);
}

// add spell slots to spell headers
function add_spell_slots() {
    // spell slot template
    const spell_slot = `
        <div class="spell_slot button" onclick="toggle_slot({0}, {1})"></div>
    `;

    var slot_container;
    var slot_count;
    var slot_hold;
    // for all levels 1-9,
    for (var i = 1; i <= 9; i ++) {
        // get the slot count
        slot_count = parseInt(document.getElementById("slot_" + i).innerHTML);

        // if it's zero, don't worry about this and following levels
        if (slot_count == 0) {
            break;
        }

        // find the container
        slot_container = document.getElementById("level_" + i + "_slots");
        // if it exists,
        if (slot_container != null) {
            // clear the slot variable
            slot_hold = "";

            // then for each slot needed, add a spell slot
            for (var j = 0; j < slot_count; j++) {
                slot_hold += format_string(spell_slot, i, j);
            }
            // then set the HTML
            slot_container.innerHTML = slot_hold;
        }
    }

    // levels that have any amount of used slots
    const used_slot_levels = Object.getOwnPropertyNames(character_list[active_character].slots_used);

    var slot_container;
    var slots;
    // for each of the used slot levels
    for (var level of used_slot_levels) {
        // get the corresponding slot container
        slot_container = document.getElementById("level_" + level + "_slots");

        // if the slot container exists,
        if (slot_container != null) {
            // get the slots
            slots = slot_container.children;

            // toggle the amount used to be used
            for (var i = 0, count = character_list[active_character].slots_used[level]; i < count; i++) {
                slots[i].classList.toggle("toggled");
            }
        }
    }
}

// toggles a spell slot, given spell level and slot number
function toggle_slot(level, number) {
    // grab slots, and whether or not to clear the slot (will fill the slot otherwise)
    const slots = document.getElementById("level_" + level + "_slots").children;
    const clearing = slots[number].classList.contains("toggled");

    var active_slot;
    var new_used_count;
    // if clearing a spell slot's consumed status,
    if (clearing) {
        // starting at the back, check for a consumed slot
        for (var i = parseInt(document.getElementById("slot_" + level).innerHTML)-1; i >= 0; i--) {
            active_slot = slots[i];
            // if the slot is consumed, unconsume it and leave
            if (active_slot.classList.contains("toggled")) {
                active_slot.classList.toggle("toggled");
                new_used_count = i;
                break;
            }
            // else go to next
        }
    } else {
    // if consuming a spell slot, check for non-consumed at the front (limit of `number` as that is what was clicked)
        for (var i = 0; i <= number; i++) {
            active_slot = slots[i];
            // if the slot is not consumed, consume it and leave
            if (!active_slot.classList.contains("toggled")) {
                active_slot.classList.toggle("toggled");
                new_used_count = i + 1;
                break;
            }
            // else go to next
        }
    }

    // save slots used to character, save character
    character_list[active_character].slots_used[level] = new_used_count;
    save_characters();
}

// marks a spell as prepared
function prep_spell(event, id) {
    if (event.shiftKey) {
        special_prepare(id);
        return;
    }

    // get the prep part
    const prep = document.getElementById("prep_" + id);

    // if the prep is special prep, dont fill it
    if (prep.nodeName == "svg") {
        return;
    }

    // set the visual preparation
    prep.classList.toggle("prepared");
    // true if prepping, false if unprepping
    const prepping = prep.classList.contains("prepared");

    // save in character
    var prep_list = character_list[active_character].prepared_list;
    if (prepping) {
        // add to prep list
        prep_list.push(id);
    } else {
        // remove from prep list
        const ndx = prep_list.indexOf(id);
        prep_list.splice(ndx, 1);
    }

    // save characters
    save_characters();
}

// change between special prepare and normal prepare (i.e. for non-counting spells)
function special_prepare(id) {
    // get the list of special prepared ids
    var special_list = character_list[active_character].specialized_list;

    // get the old icon and the container
    var prep_icon = document.getElementById("prep_" + id);
    const spell_container = prep_icon.parentElement;

    // remove old element
    prep_icon.remove();

    const ndx = special_list.indexOf(id)
    // if it is turned into special
    if (ndx == -1) {
        // add to list
        special_list.push(id);

        // if was prepared, remove from list
        const ndx = character_list[active_character].prepared_list.indexOf(id);
        if (ndx != -1) {
            character_list[active_character].prepared_list.splice(ndx, 1);
        }

        // add the star icon
        spell_container.innerHTML = `
            <svg id="prep_${id}" class="prepare button" onclick="prep_spell(event, ${id})" viewbox="-1 -1 12 12">
                <path class="prepare_star" d="M 5 0 L 6.122 3.455 L 9.755 3.455 L 6.817 5.591 L 7.939 9.045 L 5 6.912 L 2.061 9.045 L 3.183 5.591 L 0.245 3.455 L 3.878 3.455 Z"></path>
            </svg>` + spell_container.innerHTML;
    } else {
    // if it is turned away from special
        // remove from list
        special_list.splice(ndx, 1);

        // add the circle icon
        spell_container.innerHTML = `
            <div id="prep_${id}" class="prepare button" onclick="prep_spell(event, ${id})"></div>
        ` + spell_container.innerHTML;
    }

    save_characters();
}

// prepares all spells saved in the active character
function prep_saved_spells() {
    // load normal preps
    for (var id of character_list[active_character].prepared_list) {
        document.getElementById("prep_" + id).classList.toggle("prepared");
    }

    // load special preps
    var spell_container;
    for (var id of character_list[active_character].specialized_list) {
        // get the spell container, remove the old prep icon
        spell_container = document.getElementById("prep_" + id).parentElement;
        spell_container.children[0].remove();

        // add the star icon
        spell_container.innerHTML = `
            <svg id="prep_${id}" class="prepare button" onclick="prep_spell(event, ${id})" viewbox="-1 -1 12 12">
                <path class="prepare_star" d="M 5 0 L 6.122 3.455 L 9.755 3.455 L 6.817 5.591 L 7.939 9.045 L 5 6.912 L 2.061 9.045 L 3.183 5.591 L 0.245 3.455 L 3.878 3.455 Z"></path>
            </svg>` + spell_container.innerHTML;
    }
}