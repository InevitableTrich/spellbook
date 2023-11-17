var filtered_spells = [];

var filter_options = {
    "level": new Set(),
    "school": new Set(),
    "cast_time": new Set(),
    "range": new Set(),
    "components": new Set(),
    "ritual": new Set([false, true]),
    "concentration": new Set([false, true]),
    "duration": new Set(),
    "classes": new Set(),
    "subclasses": new Set(),
    "sources": new Set(),
    "higher_level": new Set([false, true])
}

var active_filter_count = 0;

function gather_filter_options() {
    // place all data into sets
    spell_list.forEach(spell => {
        // add all single fields
        filter_options.level.add(spell.level);
        filter_options.school.add(spell.school);
        filter_options.cast_time.add(spell.cast_time);
        filter_options.range.add(spell.range);
        filter_options.duration.add(spell.duration);

        // add all list fields
        spell.classes.forEach(_class => { // _class as class is reserved
            filter_options.classes.add(_class);
        });

        spell.subclasses.forEach(subclass => {
            filter_options.subclasses.add(subclass);
        });

        spell.components.forEach(component => {
            filter_options.components.add(component);
        });

        spell.sources.forEach(source => {
            filter_options.sources.add(source);
        });
    });

    // sort the sets
    var sorted = [];
    Object.keys(filter_options).forEach(key => { // for each key
        sorted = Array.from(filter_options[key]);
        sorted.sort();
        filter_options[key].clear();
        filter_options[key] = new Set(sorted);
    });

    // create the filters
    create_filters();
}

function create_filters() {
    var filter_base = `
        <div class="filter_item">
            <div class="fit_row_container button" onclick="toggle_filter('{0}')">
                <div id="{0} box" class="filter_selection"></div>
                <p id="{0} text" class="filter_selection">{0}</p>
            </div>
        </div>
    `;

    var class_filters = [];
    Array.from(filter_options["classes"]).sort().forEach(_class => {
        class_filters.push(format_string(filter_base, _class));
    });
    document.getElementById("class_filters").innerHTML = class_filters.join("\n")
}

function toggle_filter(id) {
    var box = document.getElementById(id + " box");
    var text = document.getElementById(id + " text");

    box.classList.toggle("filter_selected");
    text.classList.toggle("filter_selected");

    if (box.classList.contains("filter_selected")) {
        active_filter_count++;
    } else {
        active_filter_count--;
    }

    document.getElementById("filter_title").innerHTML = format_string("Clear Active Filters ({0})", active_filter_count);
}

function filter_spells() {
    var search_value = document.getElementById("search_bar").value.toLowerCase();
    var spells = "";
    var spell;
    for (var i = 0, size = filtered_spells.length; i < size; i++) {
        spell = filtered_spells[i];

        if ((spell.name.toLowerCase().indexOf(search_value) != -1) ||
            (spell.descriptions.join(" ").toLowerCase().indexOf(search_value) != -1)) {

            spells += spell.create_head();
        }
    }

    document.getElementById("spell_list").innerHTML = spells;
}