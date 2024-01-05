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

// adds spells and level headers to characters spellbook
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