// marks a spell as prepared
function prep_spell(event, id) {
    // if user was holding shift, toggle special prepare status and leave
    if (event.shiftKey) {
        special_prepare(id);
        return;
    }

    // get the prep circle
    const prep = document.getElementById("prep_" + id);

    // if the prep is special prep, dont do anything
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
    const prep_icon = document.getElementById("prep_" + id);
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