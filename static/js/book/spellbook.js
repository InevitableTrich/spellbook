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

    // update the spells quick add and add button
    document.getElementById(num + "_quick_add").children[0].innerHTML = "Quick Remove";
    document.getElementById(num + "_add").children[0].innerHTML = "Remove From Spellbook";
}

// remove a spell from the active spellbook
function remove_from_spellbook(num) {
    // get the spell_list and index of the id
    var list = character_list[active_character].spell_list;
    const id_index = list.indexOf(num);

    // remove it from the list
    list.splice(id_index, 1);

    // find the nubmer in the prepare list
    const prep_ndx = character_list[active_character].prepared_list.indexOf(num);
    // if it is found, remove it
    if (prep_ndx != -1) {
        character_list[active_character].prepared_list.splice(prep_ndx, 1);
    }

    // remove from specialized prep list if it was in it
    const index = character_list[active_character].specialized_list.indexOf(num);
    if (index != -1) {
        character_list[active_character].specialized_list.splice(index, 1);
    }

    // update the spells quick add and add button
    document.getElementById(num + "_quick_add").children[0].innerHTML = "Quick Add";
    document.getElementById(num + "_add").children[0].innerHTML = "Add To Spellbook";
}

// removes a spell from the active spellbook and deletes it from the screen
function delete_from_spellbook(num) {
    // remove from the list
    remove_from_spellbook(num);

    // delete the visual element. cantrips have no prep, so just delete self, leveled spells need container removed
    const spell_level = spell_list[num].level
    if (spell_level == 0) {
        document.getElementById(num).remove();
    } else {
        document.getElementById(num).parentElement.remove();
    }

    // get the header
    const spell_holder = document.getElementById("level_" + spell_level + "_spells");

    // check for empty, and if empty, delete holder and header
    if (spell_holder.children.length == 0) {
        spell_holder.remove();
        document.getElementById("level_" + spell_level + "_header").remove();
    }

    // if there is nothing left, add the empty spellbook text
    const spell_container = document.getElementById("book_list");
    if (spell_container.childElementCount == 0) {
        spell_container.innerHTML = `<p class="no_spells" style="display: flex">There are no spells in your spellbook.
                                        To add some, click theQuick Add or Add button on spells in the spell list.</p>`;
    }

    // save character
    save_characters();
}

// adds spells and level headers to characters spellbook
function create_spellbook() {
    // if the spells are not done collecting, dont make the spellbook
    if (!spell_collector['done']) {
        return;
    }

    // collect spells and place into list
    var spellbook_list = character_list[active_character].spell_list.slice();

    // collect subclass spells
    const subclass = document.getElementById("class_selector").value + " ("
                     + document.getElementById("subclass_selector").value + ")";
    var subclass_spells = []
    // there won't be any spells of subclass none
    if (subclass.indexOf("None") == -1) {
        for (var spell of spell_list) {
            if (spell.subclasses.indexOf(subclass) != -1) {
                // if it is not in the spellbook list, add it
                if (spellbook_list.indexOf(spell.index) == -1) {
                    spellbook_list.push(spell.index);
                }
                // add to subclass spells regardless
                subclass_spells.push(spell.index);
            }
        }
    }

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
            spell_sections[level] += format_string(prep_template, spell.index)
                                     + spell.create_book_head(true) + "</div>";
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

    // check for no spells, add text
    if (body == "") {
        body = `<p class="no_spells" style="display: flex">There are no spells in your spellbook. To add some, click the
                                     Quick Add or Add button on spells in the spell list.</p>`
    }

    // set the spellbook list to the content
    document.getElementById("book_list").innerHTML = body;
    // add the correct spell slot buttons
    add_spell_slots();
    prep_saved_spells();

    // special prepare all subclass spells
    for (var id of subclass_spells) {
        if (spell_list[id].level != 0) {
            special_prepare(id);
        }
    }
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
        <div id="level_{0}_slots" class="row_container"></div>
    `;

    var text;
    var container;
    // format changing checks
    // if cantrip, set to Cantrips and no slot
    if (level == 0) {
        text = "Cantrips";
        container = "";
    } else if (parseInt(document.getElementById("slot_" + level).innerHTML) > 0) {
    // else if there are spell slots wanted, add them
        text = `Level ${level}: &nbsp;`; // Level X:
        container = format_string(level_row_container, level);
    } else {
    // else, there are no spells wanted
        text = `Level ${level}`; // Level X
        container = format_string(level_row_container, level);
    }

    return format_string(header_template, text, container);
}