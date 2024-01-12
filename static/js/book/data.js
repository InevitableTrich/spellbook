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
var load_characters_needed = false;
function load_characters() {
    // check the current storage version
    const storage_version = localStorage.getItem("version");
    if (storage_version != STORAGE_VERSION) {
        var success;

        switch (storage_version) {
            case null:
                // if they have no local storage, create a template
                if (localStorage.length == 0) {
                    // todo: impl
                } else {
                // if they have local storage, convert from v1 to v2
                    success = convert_1_to_2();
                    if (!success) {
                        return;
                    }
                }
                break;
            default:
                return;
        }
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