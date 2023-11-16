function populate_spells() {


    var spells = "";
    var classes_and_subs;

    // sort by name
    var sorted_spells = spell_list.slice();
    sorted_spells.sort((spellX, spellY) => {
        if (spellX.name > spellY.name) return 1;
        return -1;
    });

    sorted_spells.forEach(spell => {
        spells += spell.create_block();
    });

    document.getElementById("spell_list").innerHTML = spells;
}

function toggle_spell(id) {
    var spell_item = document.getElementById(id);
    var spell_elements = spell_item.children;

    // if the 'extended' header is visible, open. else close
    if (!spell_elements[0].classList.contains("hidden")) {
        open_spell(id);
    } else {
        close_spell(id);
    }

    // swap active headers
    spell_elements[0].classList.toggle("hidden");
    spell_elements[1].classList.toggle("hidden");
}

function open_spell(id) {
    var spell_item = document.getElementById(id);

    var sectionHeight = spell_item.scrollHeight - 14;
    spell_item.style.height = sectionHeight + 'px';

    spell_item.addEventListener('transitionend', function(e) {
        spell_item.removeEventListener('transitionend', arguments.callee);
        spell_item.style.height = "unset";
    });
}

function close_spell(id) {
    var spell_item = document.getElementById(id);

    var sectionHeight = spell_item.scrollHeight;
    var elementTransition = spell_item.style.transition;
    spell_item.style.transition = '';
    requestAnimationFrame(function() {
        spell_item.style.height = sectionHeight + 'px';
        spell_item.style.transition = elementTransition;
        requestAnimationFrame(function() {
            spell_item.style.height = null;
        });
    });
}
