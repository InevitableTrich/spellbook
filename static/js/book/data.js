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
            "specialized_list": [],
            "counters": []
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
            this.counters = data.counters;
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

// stores all characters into localStorage
function save_characters() {
    // turn character_list into a string
    const character_string = JSON.stringify(character_list);
    // put it in localStorage
    localStorage.characters = character_string;
}