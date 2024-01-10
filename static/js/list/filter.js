var filtered_spells = [];
var active_filters = {};
var active_filter_count = 0;

// all filter options. used mostly for construction of filters
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

// populate the filter_options dict
function gather_filter_options() {
    // place all data into sets
    spell_list.forEach(spell => {
        // add all single fields
        filter_options.level.add(spell.level);
        filter_options.school.add(spell.school);
        filter_options.cast_time.add(spell.cast_time);
        filter_options.range.add(spell.range);

        // exempt specificly this duration
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
    to_sort = [
        "cast_time",
        "duration"
    ]
    for (var key of to_sort) {
        sorted = Array.from(filter_options[key]);
        sorted.sort((durX, durY) => {
            if (get_time(durX) > get_time(durY)) return 1;
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
            if (get_distance(distX) > get_distance(distY)) return 1;
            return -1;
        });

        filter_options[key].clear();
        filter_options[key] = new Set(sorted);
    }
}

// filter item template
const filter_base = `
    <div class="filter_item">
        <div class="fit_row_container button" onclick="toggle_filter('{0}')">
            <div id="{0} box" class="filter_selection"></div>
            <p id="{0} text" class="filter_selection">{1}</p>
        </div>
    </div>`
;
function create_filters() {
    // filter header template
    const filter_header = `
        <div id="{1}_container" class="row_container button" style="width: 100%;" onclick="toggle_filter_view('{1}');">
            <p class="filter_title" style="width: 94%;">{0}</p>
            <p class="filter_title arrow"><</p>
        </div>
        <div id="{1}_filters" class="filter_section" style="height: 0;"></div>`
    ;

    const filter_box = document.getElementById("filters");
    var filter_sections = "";

    // gets all filter properties
    const properties = Object.getOwnPropertyNames(filter_options);
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
                // append populated template
                filters += format_string(filter_base, property+","+option, option.replace("*","'"));
            }
        }

        document.getElementById(property + "_filters").innerHTML = filters;
    }
}

// take lowercase underscored string and capitalize first
// letter of each word, replace underscores with spaces
function format_property(property) {
    var formatted = [];
    // split the property into words (at '_'s)
    const sections = property.split("_");

    // take each word and capitalize it
    for (var section of sections) {
        formatted.push(section.charAt(0).toUpperCase() + section.slice(1));
    }

    // join it back together and return
    return formatted.join(" ");
}

// toggle open/close of filter sections
function toggle_filter_view(id) {
    const arrow = document.getElementById(id + "_container").children[1];

    // if filter section is closed
    var timeout_id;
    if (arrow.style.transform == "") {
        // rotate arrow
        arrow.style = "transform: rotate(-90deg);";

        // expand section
        open_collapsable(id + "_filters", 0);
    } else {
        // unrotate arrow
        arrow.removeAttribute("style");

        // close section
        close_collapsable(id + "_filters", 0);
    }
}

// toggle individual filters
function toggle_filter(id) {
    const box = document.getElementById(id + " box");
    const text = document.getElementById(id + " text");

    box.classList.toggle("filter_selected");
    text.classList.toggle("filter_selected");

    // if selected
    if (box.classList.contains("filter_selected")) {
        active_filter_count++;
        add_filter(id);
    } else { // if deselected
        active_filter_count--;
        remove_filter(id);
    }

    // set filter count in clear button
    document.getElementById("filter_title").innerHTML = format_string("Clear Active Filters ({0})",
                                                                      active_filter_count);

    // if toggled a class, check subclass visibility
    if (id.startsWith("classes")) {
        show_subclasses();
    }
}

// enable all correct subclasses' visibilities
function show_subclasses() {
    const class_container = document.getElementById("classes_filters");
    const subclass_container = document.getElementById("subclasses_filters");
    const toggled_filters = document.getElementsByClassName("filter_selected");

    var classes = new Set();

    // collect all active classes
    for (var element of toggled_filters) {
        if (element.id.startsWith("classes")) {
            classes.add(element.parentElement.children[1].innerHTML);
        }
    }

    var subclasses = [];
    // for each class, get the associated subclasses
    for (var _class of classes) {
        for (var option of filter_options["subclasses"]) {
            if (option.startsWith(_class)) {
                subclasses.push(option);
            }
        }
    }

    // sort the subclasses by name
    subclasses.sort();

    var filters = `<div style="height: fit-content;">`;
    // if there are no subclasses, add empty indicator
    if (subclasses.length == 0) {
        filters += `
            <div class="filter_item">
                <p class="filter_selection">Select a Class for Subclass options</p>
            </div>`
    } else {
    // otherwise, add each subclass
        for (var subclass of subclasses) {
            filters += format_string(filter_base, "subclasses,"+subclass, subclass);
        }
    }

    subclass_container.innerHTML = filters + "</div>";

    // if subclasses are open, adjust height
    if (subclass_container.style.height != "0px") {
        const subclass_subcontainer = subclass_container.children[0];
        const section_height = subclass_subcontainer.scrollHeight;
        subclass_container.style.height = section_height + "px";
    }
}

var bool_fields = ["concentration", "ritual"];
// when filters are added, create a set containing the spells it follows
function add_filter(id) {
    const comma_index = id.indexOf(",");

    const category = id.slice(0, comma_index);
    const filter = id.slice(comma_index + 1);

    // if the filter category has no active filters, declare it
    if (!active_filters.hasOwnProperty(category)) {
        active_filters[category] = {};
    }
    // add a filter (to populate) to active_filters
    active_filters[category][filter] = new Set();

    var spell;
    // if category is a boolean field,
    if (bool_fields.indexOf(category) != -1) {
        // get the boolean
        var bool_value = filter == "No" ? false : true;

        // for each spell
        for (var spell of spell_list) {
            // if it is the correct boolean, add to the filter
            if (spell[category] == bool_value) {
                active_filters[category][filter].add(spell);
            }
        }
    } else if (category == "higher_level") {  // otherwise if it is higher_level
        // get the boolean value
        //     -> true if yes to higher_level, else false
        var bool_value = filter == "No" ? false : true;

        // for each spell, if higher level is matched, add it
        for (var spell of spell_list) {
            if ((bool_value && spell[category].length > 0) || (!bool_value && spell[category].length == 0)) {
                active_filters[category][filter].add(spell);
            }
        }
    } else if (category == "components") {  // otherwise if components
        // true for inclusion, false for exclusion
        var included = filter.indexOf("No") == -1;

        var component_index;
        // for each spell, look for the component. if it matches the in/exclusion, add it
        for (var spell of spell_list) {
            // get index of the component
            component_index = spell[category].indexOf(filter[filter.length-1]);

            // if included and the component was found, or if excluded and component wasn't found
            if ((included && (component_index != -1)) || (!included && (component_index == -1))) {
                active_filters[category][filter].add(spell);
            }
        }
    } else {  // otherwise for each spell, if it matches, add it
        // for each spell
        for (var spell of spell_list) {
            // if the filter is found, add it
            if (spell[category].indexOf(filter) != -1) {
                active_filters[category][filter].add(spell);
            }
        }
    }

    // perform 'or'-ing within each category, and 'and'-ing across them
    perform_filter_operations();
}

// when filters are removed, delete the set
function remove_filter(id) {
    const comma_index = id.indexOf(",");

    const category = id.slice(0, comma_index);
    const filter = id.slice(comma_index + 1);

    // if there are multiple filters in a category, remove just the one
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

    // perform 'or'-ing within each category, and 'and'-ing across them
    perform_filter_operations();
}

// get all active filter sets, 'or' within each category, then 'and' each category
function perform_filter_operations() {
    // filter categories / category
    var categories = Object.getOwnPropertyNames(active_filters);
    var category;
    // filters
    var filters;
    // to be unioned/intersected
    var to_union = [];
    var intersection;

    // check for classes and subclasses both present
    const combine_subs = (categories.indexOf("classes") != -1) && (categories.indexOf("subclasses") != -1);
    if (combine_subs) {
        // remove the classes and subclasses category, place them at end next to each other
        categories.splice(categories.indexOf("classes"), 1);
        categories.splice(categories.indexOf("subclasses"), 1);
        categories = categories.concat(["classes", "subclasses"]);
    }

    // for each category
    for (var i = 0, count = categories.length; i < count; i++) {
        // get the filters
        category = categories[i];
        filters = Object.getOwnPropertyNames(active_filters[category]);

        // if not a subclass
        if (!(combine_subs && category == "subclasses")) {
            // add a new set to unions
            to_union.push(new Set());
        } else {
            // use the classes section
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
                    intersection = set_intersection(intersection, active_filters[category][filter]);
                }
            }

            continue;
        }

        for (var filter of filters) {
            // union operation, not a built-in
            to_union[i] = set_union(to_union[i], active_filters[category][filter]);
        }

        // if not class where subclasses
        if (!(combine_subs && category == "classes")) {
            // do set intersections
            if (intersection == null) {
                intersection = to_union[i];
            } else {
                intersection = set_intersection(intersection, to_union[i]);
            }
        }
    }

    // check for no active filters
    if (intersection != null) {
        filtered_spells = [...intersection];
    } else {
        filtered_spells = spell_list.slice();
    }

    // sort spells, then populate spell list
    sort_spells();
    filter_spells();
}

// performs a set intersection
function set_intersection(setA, setB) {
    return new Set([...setA].filter(x => setB.has(x)));
}

// performs a set union
function set_union(setA, setB) {
    return new Set([...setA, ...setB]);
}

// clear all active filters
function clear_filters() {
    // clear search bar
    const search_bar = document.getElementById("search_bar");
    search_bar.value = "";

    // deactivate visuals of filters
    const active = [...document.getElementsByClassName("filter_selected")];
    for (var element of active) {
        element.classList.toggle("filter_selected");
    }

    // set filters to zero state
    active_filter_count = 0;
    active_filters = {};

    // reset the clear filters button
    document.getElementById("filter_title").innerHTML = "Clear Active Filters (0)";

    // reset subclasses and close it if it wasn't already
    show_subclasses();
    document.getElementById("subclasses_container").children[1].style = null;

    // copy all spells to filtered_spells, sort, then populate
    filtered_spells = spell_list.slice();
    sort_spells();
    filter_spells();
}

// populate visual spell list, following active filters
function filter_spells() {
    const search_value = document.getElementById("search_bar").value.toLowerCase();

    var spell_count = 0;
    var spells = "";
    // for each spell in the filtered list
    for (var spell of filtered_spells) {
        // if the search value is within the name or body, add to visual spell list
        if ((spell.name.toLowerCase().indexOf(search_value) != -1) ||
            (spell.descriptions.join(" ").toLowerCase().indexOf(search_value) != -1)) {

            spells += spell.create_head();
            spell_count++;
        }
    }

    // if there are no spells, add an indicator
    if (spell_count == 0) {
        spells = `<p class="no_spells">There are no spells that fit the active filters.</p>`;
    }

    // place spells
    document.getElementById("spell_list").innerHTML = spells;

    // update quick add/remove buttons to reflect active spellbook character
    update_spell_buttons();

    // set spell count in the sort menu
    document.getElementById("spell_count").innerHTML = format_string("Sorting {0} spells by:", spell_count);
}

// change spell buttons to reflect spell active spellbook presence
function update_spell_buttons() {
    // for each spell, if it's in the active spellbook, set the add button to remove instead
    for (var spell_id of character_list[active_character].spell_list) {
        // must be in a try block incase the spell is not present due to filters
        try {
            document.getElementById(spell_id + "_quick_add").children[0].innerHTML = "Quick Remove";
            document.getElementById(spell_id + "_add").children[0].innerHTML = "Remove From Spellbook";
        } catch(e) {}  // ignore errors
    }
}