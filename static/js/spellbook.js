// spellbook data
const STORAGE_VERSION = 2;
var character_list = [];  // list of characters
var active_character = 0;  // index of active character

// character class, stores relavent class info
class Character {
    static new_character() {
        return new Character({
            "name": "Unnamed",
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
        document.getElementById(spell_id + "_add").children[0].innerHTML = "Quick Remove";
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

    // update the spells quick add button
    document.getElementById(num + "_add").children[0].innerHTML = "Quick Add";
}