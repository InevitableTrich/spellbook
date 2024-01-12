// converts storage version 1 to 2
function convert_1_to_2() {
    // if spell haven't loaded yet, indicate a re-run
    // will be re-ran by perform_spell_operations() on spell-list load
    if (spell_list.length == 0) {
        load_characters_needed = true;

        return false;
    }

    // start with a blank object
    const new_storage = {};

    // discard what is deprecated
    delete localStorage.collapsed;

// load used data
    // create lists of the data, split into each character
    const names = localStorage.characters.split("+");
    const levels = localStorage.levels.split("+");
    const class_indexes = localStorage.classes.split("+");
    const spell_list_strings = localStorage.books.split("+");
    const prepped_list_strings = localStorage.prepped.split("+");
    const special_prepared_list_strings = localStorage.sub_prepped.split("+");
    const slots_strings = localStorage.slots.split("+");
    const counter_names_strings = localStorage.spec_names.split("+");
    const counter_values_strings = localStorage.spec_values.split("+");

// turn list strings into lists
    // initialize the lists
    var spell_lists = [];
    var prepped_lists = [];
    var special_prepared_lists = [];
    var slots = [];
    var counter_names = [];
    var counter_values = [];

    // iterate over list strings and populate
    for (var i = 0; i < 3; i++) {
        spell_lists.push(spell_list_strings[i].split(","));
        prepped_lists.push(prepped_list_strings[i].split(","));
        special_prepared_lists.push(special_prepared_list_strings[i].split(","));
        slots.push(slots_strings[i].split(","));
        counter_names.push(counter_names_strings[i].split(","));
        counter_values.push(counter_values_strings[i].split(","));
    }

    // class list for loading indexes
    const class_list = [
        "Artificer", "Bard", "Cleric", "Druid", "Paladin", "Ranger", "Sorcerer", "Warlock", "Wizard", "Fighter", "Monk"
    ];

// turn data into characters
    new_characters = [];

    // for each of the 3 characters
    var character;
    for (var i = 0; i < 3; i++) {
        // get a new character
        character = Character.new_character();

        // set name and level
        character.name = names[i];
        character.level = parseInt(levels[i]);

        // set the class
        character.class = class_list[class_indexes[i]];

        // set the counters
        var name;
        var value;
        for (var j = 0; j < 4; j++) {
            // get the values
            name = counter_names[i][j];
            value = parseInt(counter_values[i][j]);

            // check for valid values
            name = name == "" ? "Counter" : name;
            value = isNaN(value) ? 0 : value;

            character.counters.push({
                "name": name,
                "max": 99,
                "value": value
            });
        }

        // set the spell slots
        var slot_val;
        for (var j = 0; j < 9; j++) {
            slot_val = parseInt(slots[i][j]);
            if (slot_val > 0) {
                character.slots_used[j + 1] = slot_val;
            }
        }

        // get the spell list
        character.spell_list = list_v1_ids_to_v2(spell_lists[i]).slice();

        // get the prep list
        character.prepared_list = list_v1_ids_to_v2(prepped_lists[i]).slice();

        // get the special prep list
        character.specialized_list = list_v1_ids_to_v2(special_prepared_lists[i]).slice();

        var id;
        // make sure the prep list has spells only in the spellbook, not the special prep list, no cantrips
        for (var j = 0, count = character.prepared_list.length; j < count; j++) {
            id = character.prepared_list[j]
            if (character.spell_list.indexOf(id) == -1 || character.specialized_list.indexOf(id) != -1
                || spell_list[id].level == "0") {

                character.prepared_list.splice(j, 1);
                j--;
                count--;
            }
        }

        // make sure the special prep list has spells only in the spellbook, no cantrips
        for (var j = 0, count = character.specialized_list.length; j < count; j++) {
            id = character.specialized_list[j];
            if (character.spell_list.indexOf(id) == -1 || spell_list[id].level == "0") {
                character.specialized_list.splice(j, 1);
                j--;
                count--;
            }
        }

        // add the character
        new_characters.push(character);
    }

    // set the characters
    new_storage.characters = JSON.stringify(new_characters);

// add non-character data
    // set the page, active character, and version
    new_storage.active_page = "list";
    page = "list";
    new_storage.active_character = parseInt(localStorage.main) - 1;
    new_storage.version = "2";

// set localStorage
    // delete old data
    for (var key of Object.getOwnPropertyNames(localStorage)) {
        delete localStorage[key];
    }

    // set new data
    for (var key of Object.getOwnPropertyNames(new_storage)) {
        localStorage[key] = new_storage[key];
    }

    // indicate successful data conversion
    return true;
}

// converts a list of v1 ids to v2 ids
function list_v1_ids_to_v2(list) {
    // holding variable
    var new_ids = [];

    // for each id in the list
    var new_id;
    for (var spell_id of list) {
        new_id = get_spell_from_v1_id(spell_id);

        if (new_id != -1 && new_ids.indexOf(new_id) == -1) {
            new_ids.push(new_id);
        }
    }

    return new_ids;
}

// gets a spell's index based on its lowercase-hyphenated name
function get_spell_from_v1_id(id) {
    return spell_list.findIndex((spell) => {
        return id == spell.name.toLowerCase().replaceAll(" ", "-");
    });
}