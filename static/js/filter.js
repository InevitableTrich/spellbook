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
    "components": new Set(["V", "S", "M", "R"]),
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
    var key;
    for (var i = 0, count = to_sort.length; i < count; i++) {
        key = to_sort[i];

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
    for (var i = 0, count = to_sort.length; i < count; i++) {
        key = to_sort[i];

        sorted = Array.from(filter_options[key]);
        sorted.sort((durX, durY) => {
            // get X and Y numbers
            dX = numberInString(durX);
            dY = numberInString(durY);
            // get time multipliers
            mX = durMultiplier(durX);
            mY = durMultiplier(durY);

            if ((dX*mX) > (dY*mY)) return 1;
            return -1;
        });

        filter_options[key].clear();
        filter_options[key] = new Set(sorted);
    }

    // sort distances
    to_sort = ["range"];
    for (var i = 0, count = to_sort.length; i < count; i++) {
        key = to_sort[i];

        sorted = Array.from(filter_options[key]);
        sorted.sort((distX, distY) => {
            // get X and Y numbers
            dX = numberInString(distX);
            dY = numberInString(distY);
            // get distance multipliers
            mX = distMultiplier(distX);
            mY = distMultiplier(distY);

            if ((dX*mX) > (dY*mY)) return 1;
            return -1;
        });

        filter_options[key].clear();
        filter_options[key] = new Set(sorted);
    }

    // create the filters
    create_filters();
}

function numberInString(str) {
    var datas, data;
    var numberRegex = new RegExp("^(\\d+|\\d{1,3}(,\\d{3})*)(\\.\\d+)?$");

    datas = str.split(" ");
    data = datas[0].match(numberRegex);
    if (data != null) { // if a number is found in str:
        return parseInt(data[0].replace(",", ""));
    }

    return 9999;
}

function durMultiplier(str) {
    if (str.indexOf("day") != -1) {
        return 86400;
    } else if (str.indexOf("hour") != -1) {
        return 3600;
    } else if (str.indexOf("minute") != -1) {
        return 60;
    } else if (str.indexOf("round") != -1) {
        return 6;
    } else if (str.indexOf("reaction") != -1) {
        return 3;
    } else if (str.indexOf("bonus") != -1) {
        return 2;
    } else if (str.indexOf("action") != -1) {
        return 1;
    } else if (str.indexOf("Instant") != -1){
        return 0;
    }
    return 260;
}

function distMultiplier(str) {
    if (str.indexOf("Unlimited") != -1) {
        return 86400;
    } else if (str.indexOf("Sight") != -1) {
        return 23200;
    } else if (str.indexOf("mile") != -1) {
        return 5280;
    } else if (str.indexOf("Touch") != -1) {
        return 4/9999; // /9999 to counter return 9999 on number
    } else if (str.indexOf("feet") != -1) {
        return 1;
    } else if (str.indexOf("Self") != -1) {
        return 0;
    }
    return 999;
}

function create_filters() {
    var filter_header = `
        <div id="{1}_container" class="row_container button" style="width: 100%;" onclick="toggle_filter_view('{1}');">
            <p class="filter_title" style="width: 94%;">{0}</p>
            <p class="filter_title arrow"><</p>
        </div>
        <div id="{1}_filters" class="filter_section" style="height: 0;"></div>`
    ;

    var filter_base = `
        <div class="filter_item">
            <div class="fit_row_container button" onclick="toggle_filter('{0}')">
                <div id="{0} box" class="filter_selection"></div>
                <p id="{0} text" class="filter_selection">{1}</p>
            </div>
        </div>`
    ;

    var inclusive_filter_box = document.getElementById("inclusive_filters");
    var filter_sections = "";

    // gets all filter properties
    var properties = Object.getOwnPropertyNames(filter_options);
    var property;
    for (var i = 0, count = properties.length; i < count; i++) {
        property = properties[i];
        filter_sections += format_string(filter_header, format_property(property), property);
    }

    inclusive_filter_box.innerHTML = filter_sections;

    document.getElementById("sources_filters").style = "grid-template-columns: unset; height: 0;";

    var filters;
    var options;
    var option;
    // for each filter property
    for (var i = 0, count = properties.length; i < count; i++) {
        if (i == 1) { // skip subclasses
            continue;
        }

        property = properties[i];
        options = Array.from(filter_options[property]);
        filters = "";
        // for each filter value
        for (var j = 0, amount = options.length; j < amount; j++) {
            option = options[j];
            filters += format_string(filter_base, property+","+option, option.replace("*","'"));
        }

        document.getElementById(property + "_filters").innerHTML = filters;
    }
}

function format_property(property) {
    var formatted = [], section = "";
    var sections = property.split("_");
    for (var i = 0, count = sections.length; i < count; i++) {
        section = sections[i];
        formatted.push(section.charAt(0).toUpperCase() + section.slice(1));
    }
    return formatted.join(" ");
}

function toggle_filter_view(id) {
    var container = document.getElementById(id + "_container");
    var filters = document.getElementById(id + "_filters");
    var arrow = container.children[1];

    // if filter section is closed
    if (arrow.style.transform == "") {
        // rotate arrow
        arrow.style = "transform: rotate(-90deg);";

        // expand section
        var sectionHeight = filters.scrollHeight;
        filters.style.height = sectionHeight + "px";
    } else {
        arrow.removeAttribute("style");
        filters.style.height = "0";
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
    filter_spells();
}

var bool_fields = ["concentration", "ritual", "higher_level"];
function add_filter(id) { // add option for exluded components
    var comma_index = id.indexOf(",");

    var category = id.slice(0, comma_index);
    var filter = id.slice(comma_index + 1);

    // create empty set at own location
    if (!active_filters.hasOwnProperty(category)) {
        active_filters[category] = {};
    }
    active_filters[category][filter] = new Set();

    var spell;
    // check for boolean / prescence fields
    if (bool_fields.indexOf(category) != -1) {
        var bool_value = filter == "Yes" ? true : false;
        var bool_field = filter != "higher_level" ? true : false;
        // for each spell
        for (var i = 0, count = spell_list.length; i < count; i++) {
            spell = spell_list[i];

            // check if it is the filter value, or if looking for higher level, or if looking for no higher level
            if ((bool_field && (spell[category] == bool_value))
                    || (bool_value && spell[category].length > 0)
                    || (!bool_value && spell[category].length == 0)) {
                active_filters[category][filter].add(spell);
            }
        }
    } else {
        // for each spell
        for (var i = 0, count = spell_list.length; i < count; i++) {
            spell = spell_list[i];

            if (spell[category].indexOf(filter) != -1) {
                active_filters[category][filter].add(spell);
            }
        }
    }

    perform_filter_operations();
}

function remove_filter(id) {
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

    perform_filter_operations();
}

function perform_filter_operations() {
    // filter categories / category
    var categories = Object.getOwnPropertyNames(active_filters);
    var category;
    // filters and filter
    var filters;
    var filter;
    // to be unioned/intersected
    var to_union = [];
    var intersection;
    for (var i = 0, count = categories.length; i < count; i++) {
        category = categories[i];
        filters = Object.getOwnPropertyNames(active_filters[category]);
        to_union.push(new Set());

        for (var j = 0, countA = filters.length; j < countA; j++) {
            filter = filters[j];
            // union operation, not a built-in
            to_union[i] = new Set([...to_union[i], ...active_filters[category][filter]]);
        }

        // do set intersections
        if (i == 0) {
            intersection = to_union[i];
        } else {
            // intersection operation, not a built-in
            intersection = new Set([...intersection].filter(x => to_union[i].has(x)));
        }
    }

    // check for no active filters
    if (intersection != null) {
        filtered_spells = [...intersection];
    } else {
        filtered_spells = spell_list.slice();
    }
    sort_spells(filtered_spells);
    filter_spells();
}

function clear_filters() {
    var search_bar = document.getElementById("search_bar");
    search_bar.value = "";

    var active = document.getElementsByClassName("filter_selected");
    var element;
    for (var i = 0, count = active.length; i < count; i++) {
        element = active[0];
        element.classList.toggle("filter_selected");
    }

    active_filter_count = 0;
    active_filters = {};

    document.getElementById("filter_title").innerHTML = "Clear Active Filters (0)";

    filtered_spells = spell_list.slice();
    sort_spells(filtered_spells);

    filter_spells();
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