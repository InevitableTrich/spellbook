var filtered_spells = [];
var active_filters = {};
var active_filter_count = 0;

var filter_options = {
    "classes": new Set(),
    "subclasses": new Set(),
    "level": new Set(),
    "concentration": new Set(["Yes", "No"]),
    "ritual": new Set(["Yes", "No"]),
    "school": new Set(),
    "cast_time": new Set(),
    "duration": new Set(),
    "range": new Set(),
    "components": new Set(["V", "S", "M", "R", "No V", "No S", "No M", "No R"]),
    "sources": new Set(),
    "higher_level": new Set(["Yes", "No"])
};

function gather_filter_options() {
    // place all data into sets
    spell_list.forEach(spell => {
        // add all single fields
        filter_options.level.add(spell.level);
        filter_options.school.add(spell.school);
        filter_options.cast_time.add(spell.cast_time);
        filter_options.range.add(spell.range);

        // exempt specific duration
        if (spell.duration != "Instantaneous or 1 hour (see below)") {
            filter_options.duration.add(spell.duration);
        }

        // add all list fields
        spell.classes.forEach(_class => { // _class as class is reserved
            filter_options.classes.add(_class);
        });

        spell.subclasses.forEach(subclass => {
            filter_options.subclasses.add(subclass);
        });

        spell.sources.forEach(source => {
            filter_options.sources.add(source);
        });
    });

    // sort the wanted sets alphabetically
    var to_sort = ["classes", "subclasses", "level", "school", "sources"];
    var sorted = [];
    for (var key of to_sort) {
        sorted = Array.from(filter_options[key]);
        sorted.sort();
        filter_options[key].clear();
        filter_options[key] = new Set(sorted);
    }

    // sort durations
    var dX, dY, mX, mY;
    to_sort = [
        "cast_time",
        "duration"
    ]
    for (var key of to_sort) {
        sorted = Array.from(filter_options[key]);
        sorted.sort((durX, durY) => {
            // get X and Y numbers
            dX = number_in_string(durX);
            dY = number_in_string(durY);
            // get time multipliers
            mX = dur_multiplier(durX);
            mY = dur_multiplier(durY);

            if ((dX*mX) > (dY*mY)) return 1;
            return -1;
        });

        filter_options[key].clear();
        filter_options[key] = new Set(sorted);
    }

    // sort distances
    to_sort = ["range"];
    for (var key of to_sort) {
        sorted = Array.from(filter_options[key]);
        sorted.sort((distX, distY) => {
            // get X and Y numbers
            dX = number_in_string(distX);
            dY = number_in_string(distY);
            // get distance multipliers
            mX = dist_multiplier(distX);
            mY = dist_multiplier(distY);

            if ((dX*mX) > (dY*mY)) return 1;
            return -1;
        });

        filter_options[key].clear();
        filter_options[key] = new Set(sorted);
    }

    // create the filters
    create_filters();
}

var filter_base = `
    <div class="filter_item">
        <div class="fit_row_container button" onclick="toggle_filter('{0}')">
            <div id="{0} box" class="filter_selection"></div>
            <p id="{0} text" class="filter_selection">{1}</p>
        </div>
    </div>`
;
function create_filters() {
    var filter_header = `
        <div id="{1}_container" class="row_container button" style="width: 100%;" onclick="toggle_filter_view('{1}');">
            <p class="filter_title" style="width: 94%;">{0}</p>
            <p class="filter_title arrow"><</p>
        </div>
        <div id="{1}_filters" class="filter_section" style="height: 0;"></div>`
    ;

    var filter_box = document.getElementById("filters");
    var filter_sections = "";

    // gets all filter properties
    var properties = Object.getOwnPropertyNames(filter_options);
    for (var property of properties) {
        filter_sections += format_string(filter_header, format_property(property), property);
    }

    filter_box.innerHTML = filter_sections;

    // set subclasses and sources to not be grids, always 1 element wide
    document.getElementById("subclasses_filters").style = "grid-template-columns: unset; height: 0;";
    document.getElementById("sources_filters").style = "grid-template-columns: unset; height: 0;";

    var filters;
    var options;
    // for each filter property
    for (var property of properties) {
        filters = "";

        if (property == "subclasses") { // do subclasses own thing
            filters = `
                <div style="height: fit-content;">
                    <div class="filter_item">
                        <p class="filter_selection">Select a Class for Subclass options</p>
                    </div>
                </div>`;
        } else {
            options = Array.from(filter_options[property]);
            // for each filter value
            for (var option of options) {
                filters += format_string(filter_base, property+","+option, option.replace("*","'"));
            }
        }

        document.getElementById(property + "_filters").innerHTML = filters;
    }
}

function format_property(property) {
    var formatted = [];
    var sections = property.split("_");
    for (var section of sections) {
        formatted.push(section.charAt(0).toUpperCase() + section.slice(1));
    }
    return formatted.join(" ");
}

function toggle_filter_view(id) {
    var container = document.getElementById(id + "_container");
    var filters = document.getElementById(id + "_filters");
    var arrow = container.children[1];

    // if filter section is closed
    var timeout_id;
    if (arrow.style.transform == "") {
        // rotate arrow
        arrow.style = "transform: rotate(-90deg);";

        // expand section
        var sectionHeight = filters.scrollHeight;
        filters.style.height = sectionHeight + "px";

        // leave it unset to allow for screen changing width
        timeout_id = setTimeout(() => {
            filters.style.height = "unset";
            delete active_transitions[id];
        }, 300);

        active_transitions[id] = timeout_id;
    } else {
        // remove current expanding animation if present
        if (Object.getOwnPropertyNames(active_transitions).indexOf(id) != -1) {
            clearTimeout(active_transitions[id]);
        }

        // get and save transition for later
        var transition = filters.style.transition;
        filters.style.transition = "";
        // set to current height for animation
        var sectionHeight = filters.scrollHeight;
        filters.style.height = sectionHeight + "px";
        // put transition back
        filters.style.transition = transition;

        // close, timeout 0 lets animation play
        setTimeout(() => {
            filters.style.height = "0";
        }, 0);

        arrow.removeAttribute("style");
    }
}

function toggle_filter(id) {
    var box = document.getElementById(id + " box");
    var text = document.getElementById(id + " text");

    box.classList.toggle("filter_selected");
    text.classList.toggle("filter_selected");

    // if just selected
    if (box.classList.contains("filter_selected")) {
        active_filter_count++;
        add_filter(id);
    } else { // if deselected
        active_filter_count--;
        remove_filter(id);
    }

    document.getElementById("filter_title").innerHTML = format_string("Clear Active Filters ({0})", active_filter_count);

    if (id.startsWith("classes")) {
        show_subclasses();
    }
}

function show_subclasses() {
    var class_container = document.getElementById("classes_filters");
    var subclass_container = document.getElementById("subclasses_filters");
    var toggled_filters = document.getElementsByClassName("filter_selected");

    var classes = new Set();

    var element;
    // collect all active classes
    for (var element of toggled_filters) {
        if (element.id.startsWith("classes")) {
            classes.add(element.parentElement.children[1].innerHTML);
        }
    }

    var subclasses = [];
    for (var _class of classes) {
        for (var option of filter_options["subclasses"]) {
            if (option.startsWith(_class)) {
                subclasses.push(option);
            }
        }
    }

    subclasses.sort();

    var filters = `<div style="height: fit-content;">`;
    if (subclasses.length == 0) {
        filters += `
            <div class="filter_item">
                <p class="filter_selection">Select a Class for Subclass options</p>
            </div>`
    } else {
        for (var subclass of subclasses) {
            filters += format_string(filter_base, "subclasses,"+subclass, subclass);
        }
    }

    subclass_container.innerHTML = filters + "</div>";

    // if subclasses are open, adjust height
    if (subclass_container.style.height != "0px") {
        var subclass_subcontainer = subclass_container.children[0];
        var section_height = subclass_subcontainer.scrollHeight;
        subclass_container.style.height = section_height + "px";
    }
}

var bool_fields = ["concentration", "ritual"];
function add_filter(id) {
    var comma_index = id.indexOf(",");

    var category = id.slice(0, comma_index);
    var filter = id.slice(comma_index + 1);

    // create empty set at own location
    if (!active_filters.hasOwnProperty(category)) {
        active_filters[category] = {};
    }
    active_filters[category][filter] = new Set();

    var spell;
    // check for boolean fields
    if (bool_fields.indexOf(category) != -1) {
        var bool_value = filter == "No" ? false : true;
        // for each spell
        for (var spell of spell_list) {
            // check if it is the filter value
            if (spell[category] == bool_value) {
                active_filters[category][filter].add(spell);
            }
        }
    } else if (category == "higher_level") {
        var bool_value = filter == "No" ? false : true;

        for (var spell of spell_list) {
            if ((bool_value && spell[category].length > 0) || (!bool_value && spell[category].length == 0)) {
                active_filters[category][filter].add(spell);
            }
        }
    } else if (category == "components") {
        var included = filter.indexOf("No") == -1;
        var component_index;

        for (var spell of spell_list) {
            component_index = spell[category].indexOf(filter[filter.length-1]);

            if ((included && (component_index != -1)) || (!included && (component_index == -1))) {
                active_filters[category][filter].add(spell);
            }
        }
    } else {
        // for each spell
        for (var spell of spell_list) {
            if (spell[category].indexOf(filter) != -1) {
                active_filters[category][filter].add(spell);
            }
        }
    }

    perform_filter_operations();
}

function remove_filter(id) { // if the class a subclass corresponds to, remove that filter too
    var comma_index = id.indexOf(",");

    var category = id.slice(0, comma_index);
    var filter = id.slice(comma_index + 1);

    // if there are multiple filters, remove just the one
    // otherwise remove the category
    if (Object.getOwnPropertyNames(active_filters[category]).length > 1) {
        delete active_filters[category][filter];
    } else {
        delete active_filters[category];
    }

    // remove subclasses corresponding to the class if it is one
    if (category == "classes" && active_filters["subclasses"] != null) {
        // remove corresponding subs
        for (var subclass of Object.getOwnPropertyNames(active_filters["subclasses"])) {
            if (subclass.indexOf(filter) != -1) {
                delete active_filters["subclasses"][subclass];
            }
        }

        // if there are none left, remove filter
        if (Object.getOwnPropertyNames(active_filters["subclasses"]).length == 0) {
            delete active_filters["subclasses"];
            active_filter_count--;
        }
    }

    perform_filter_operations();
}

function perform_filter_operations() {
    // filter categories / category
    var categories = Object.getOwnPropertyNames(active_filters);
    var category;
    // filters
    var filters;
    // to be unioned/intersected
    var to_union = [];
    var intersection;
    // check for classes and subclasses
    var combine_subs = (categories.indexOf("classes") != -1) && (categories.indexOf("subclasses") != -1);
    if (combine_subs) {
        // remove the classes and subclasses category, place them at end next to eachother
        categories.splice(categories.indexOf("classes"), 1);
        categories.splice(categories.indexOf("subclasses"), 1);
        categories = categories.concat(["classes", "subclasses"]);
    }

    // standard for loop for subclass trickery and later element access
    for (var i = 0, count = categories.length; i < count; i++) {
        category = categories[i];
        filters = Object.getOwnPropertyNames(active_filters[category]);

        // if not a subclass
        if (!(combine_subs && category == "subclasses")) {
            to_union.push(new Set());
        } else {
            // remove subclasses from categories
            categories.splice(i, 1);
            i--;
            count--;
        }

        // components should 'and'
        if (category == "components") {
            for (var filter of filters) {
                if (intersection == null) {
                    intersection = active_filters[category][filter];
                } else {
                    // intersection operation, not a built-in
                    intersection = new Set([...intersection].filter(x => active_filters[category][filter].has(x)));
                }
            }

            continue;
        }

        for (var filter of filters) {
            // union operation, not a built-in
            to_union[i] = new Set([...to_union[i], ...active_filters[category][filter]]);
        }

        // if not class where subclasses
        if (!(combine_subs && category == "classes")) {
            // do set intersections
            if (intersection == null) {
                intersection = to_union[i];
            } else {
                // intersection operation, not a built-in
                intersection = new Set([...intersection].filter(x => to_union[i].has(x)));
            }
        }
    }

    // check for no active filters
    if (intersection != null) {
        filtered_spells = [...intersection];
    } else {
        filtered_spells = spell_list.slice();
    }
    sort_spells();
    filter_spells();
}

function clear_filters() {
    var search_bar = document.getElementById("search_bar");
    search_bar.value = "";

    var active = [...document.getElementsByClassName("filter_selected")];
    for (var element of active) {
        element.classList.toggle("filter_selected");
    }

    active_filter_count = 0;
    active_filters = {};

    document.getElementById("filter_title").innerHTML = "Clear Active Filters (0)";
    show_subclasses();
    document.getElementById("subclasses_container").children[1].style = null;

    filtered_spells = spell_list.slice();
    sort_spells();

    filter_spells();
}

function filter_spells() {
    var search_value = document.getElementById("search_bar").value.toLowerCase();
    var spell_count = 0;
    var spells = "";

    for (var spell of filtered_spells) {
        if ((spell.name.toLowerCase().indexOf(search_value) != -1) ||
            (spell.descriptions.join(" ").toLowerCase().indexOf(search_value) != -1)) {

            spells += spell.create_head();
            spell_count++;
        }
    }

    var spell_section = document.getElementById("spell_list");
    spell_section.innerHTML = spells;
    document.getElementById("spell_count").innerHTML = format_string("Sorting {0} spells by:", spell_count);

    if (spell_section.children.length == 0) {
        spell_section.innerHTML = `
            <p class="no_spells">There are no spells that fit the active filters.</p>
        `
    }
}