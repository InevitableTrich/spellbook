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
    const slot_list = caster_slot_table[class_caster_type[character_class]][character_level-1];
    const slot_level_count = slot_list.length;

    // set the slots given
    for (var i = 0, count = slot_level_count; i < count; i++) {
        document.getElementById("slot_" + (i+1)).innerHTML = slot_list[i];
    }

    // fill the rest with 0s
    for (var i = slot_level_count + 1, count = 9; i <= count; i++) {
        document.getElementById("slot_" + i).innerHTML = 0;
    }
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
    var header;
    var level_header;
    // for all levels 1-9,
    for (var i = 1; i <= 9; i ++) {
        // get the slot count
        slot_count = parseInt(document.getElementById("slot_" + i).innerHTML);
        // find the container
        slot_container = document.getElementById("level_" + i + "_slots");

        // if it exists,
        if (slot_container != null) {
            // get the level header
            level_header = document.getElementById("level_" + i + "_header");

            // if there are zero slots, remove slots and text-colon
            if (slot_count == 0) {
                slot_container.innerHTML = "";
                level_header.children[0].innerHTML = "Level " + i;
            } else {
            // there are some slots,
                // clear the slot variable
                slot_hold = "";

                // then for each slot needed, add a spell slot
                for (var j = 0; j < slot_count; j++) {
                    slot_hold += format_string(spell_slot, i, j);
                }

                // then set the HTML
                level_header.children[0].innerHTML = "Level " + i + ":&nbsp;";
                slot_container.innerHTML = slot_hold;
            }
        }
    }

    // levels that have any amount of used slots
    const used_slot_levels = Object.getOwnPropertyNames(character_list[active_character].slots_used);

    var slots;
    // for each of the used slot levels
    for (var level of used_slot_levels) {
        // get the corresponding slot container
        slot_container = document.getElementById("level_" + level + "_slots");

        // if the slot container exists,
        if (slot_container != null) {
            // if there are no slots, go next
            if (slot_container.childElementCount == 0) {
                continue;
            }

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
    // if consuming a spell slot, check for non-consumed from the front (limit of `number` as that is what was clicked)
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