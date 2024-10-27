// spellbook data
const STORAGE_VERSION = 2;
var character_list = [];  // list of characters
var active_character = 0;  // index of active character

// character class, stores relavent class info
class Character {
    static new_character() {
        return new Character({
            "name": "Unnamed",
            "class": "Wizard",
            "subclass": "None",
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
            this.subclass = data.subclass;
            this.level = data.level;
            this.spell_list = data.spell_list;
            this.prepared_list = data.prepared_list;
            this.specialized_list = data.specialized_list;
            this.slots_used = data.slots_used;
            this.counters = data.counters;
    }

    // returns true if the character is a valid character
    is_valid() {
        try {
            // assert some types
            assert(typeof(this.name) === "string");
            assert(typeof(this.class) === "string");
            assert(typeof(this.subclass) === "string");
            assert(typeof(this.level) === "number");
            assert(Array.isArray(this.spell_list));
            assert(Array.isArray(this.prepared_list));
            assert(Array.isArray(this.specialized_list));
            assert(Array.isArray(this.counters));
            assert(typeof(this.slots_used) === "object" && !Array.isArray(this.slots_used) && this.slots_used != null);

            // assert the data in the arrays
            const joined_arrays = this.spell_list.concat(this.prepared_list).concat(this.specialized_list);
            // assert all stored ids are numbers
            for (var id of joined_arrays) {
                assert(typeof(id) == "number");
            }

            // assert the data in counters are counters
            for (var counter of this.counters) {
                assert(typeof(counter.name) === "string");
                assert(typeof(counter.value) === "number");
                assert(typeof(counter.max) === "number");
            }
        } catch(e) {
            return false;
        }
        return true;
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
                    create_base_data();
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

// if no storage is found, create base data
function create_base_data() {
    localStorage.characters = JSON.stringify([Character.new_character()]);
    localStorage.active_character = "0";
    localStorage.active_page = "list";
    localStorage.version = "2";
}

// resets saved data. usually in the case of very old or incorrectly saved localStorage
function reset_data() {
    localStorage.clear();
    create_base_data();
    load_characters();
}

// alerts about data loss, potentially saves lost data to clipboard, then resets data
function handle_data_error() {
    if (!is_mobile()) {
        prompt("Error loading or processing saved data, so it will be erased. To recover, copy the old data below and" +
               " send to a developer (found on the discord) for manual recovery and bug fixing.",
               JSON.stringify(localStorage));
   }

    reset_data();
}

// exports the active character to a file or the clipboard
async function export_character(method) {
    // get the active character and get its name
    const character = character_list[active_character];
    const to_export = JSON.stringify(character);
    const name = character.name;

    // if method is clipboard
    if (method == "clip") {
        // write data to clipboard
        await navigator.clipboard.writeText(to_export);

        // confirm written alert
        alert("Character '" + name + "' copied to clipboard.");
    } else if (method == "file") {
    // if method is file
        // create the data from the json string
        const data = "data:text/json;charset=utf-8," + encodeURIComponent(to_export);

        // set the download data to an <a> element
        const link = document.createElement("a");
        link.setAttribute("href", data);
        link.setAttribute("download", name + ".json");

        // add the element, click it, and remove it
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
    // ignore any other methods

    // toggle the button closed
    toggle_character_button("export");
}

// imports a character from a file or the clipboard
async function import_character(method) {
    // if method is clipboard
    if (method == "clip") {
        // read data from clipboard
        const clipboard = await navigator.clipboard.read();

        // try to read the data and turn it into a character
        var new_character;
        var type_data;
        var data;
        try {
            // for each clipboard item and its type
            for (const item of clipboard) {
                for (const type of item.types) {
                    // if it's text, take it
                    if (type === "text/plain") {
                        type_data = await item.getType("text/plain");
                        data = await type_data.text();
                        break;
                    }
                }
            }

            // turn the text into a character and add it
            new_character = new Character(JSON.parse(data));
            import_add_character(new_character);
        } catch (e) {
            // if an error occurs, the character was not made. alert and exit
            if (e.message.indexOf("JSON") != -1) {
                alert("The file uploaded contains invalid JSON. "
                      + "Try exporting the character again before importing.");
            } else {
                alert("Your clipboard contents could not be turned into a character.");
            }
            return;
        }
    } else if (method == "file") {
        // get the file from the input and create a filereader
        const upload_button = document.getElementById("upload_character");
        const file = upload_button.files[0];
        upload_button.value = "";
        const reader = new FileReader();

        // code for when the reader loads a file
        var data;
        var new_character;
        reader.addEventListener("load", () => {
            // get the data
            data = reader.result;

            // try to make it into a character
            try {
                new_character = new Character(JSON.parse(data));
            } catch (e) {
                // if an error occurs, the character was not made. alert and exit
                if (e.message.indexOf("JSON") != -1) {
                    alert("The file uploaded contains invalid JSON. "
                          + "Try exporting the character again before importing.");
                } else {
                    alert("The file uploaded could not be turned into a character.");
                }
                return;
            }

            // if it was successful, add the character
            import_add_character(new_character);
        }, false);

        // read the file as text if the file exists
        if (file) {
            reader.readAsText(file);
        }
    }
    // ignore any other methods

    // toggle the button closed
    toggle_character_button("import");
}

// adds an imported character to the character list and switches to it
function import_add_character(character) {
    // ensure the character is a valid character
    if (!character.is_valid()) {
        alert("The character you provided has invalid data. Try exporting the character again before importing.");
        return;
    }

    // add it to the character list
    character_list.push(character);
    save_characters();

    // add the character to the selector
    const character_selector = document.getElementById("spellbook_selector");
    const character_index = character_list.length - 1;
    character_selector.innerHTML += `<option value="${character_index}">${character.name}</option>`;
    document.getElementById("spellbook_selector").value = character_index;

    // set the active character
    set_character(character_index);
}