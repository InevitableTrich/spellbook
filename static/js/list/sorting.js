// whether or not to reverse sort
var sort_reversed = false;

// perform sort on filter_spells
function sort_spells() {
    // methods used for each sort method
    const sort_option_methods = {
        "cast_time": get_time,
        "duration": get_time,
        "level": get_number,
        "name": get_number,
        "range": get_distance
    };

    // get the names for the 3 used sorts
    const sort_list = document.getElementById("sort_list").children;
    const sort_options = [
        sort_list[0].id.slice(0, sort_list[0].id.indexOf("_sort")),
        sort_list[1].id.slice(0, sort_list[1].id.indexOf("_sort")),
        sort_list[2].id.slice(0, sort_list[2].id.indexOf("_sort"))
    ];

    // get the functions used for sorting, based on the options chosen
    const sort_methods = [
        sort_option_methods[sort_options[0]],
        sort_option_methods[sort_options[1]],
        sort_option_methods[sort_options[2]]
    ]

    // if sorting backwards:
    if (sort_reversed) {
        filtered_spells.sort((spellX, spellY) => {
            // for each sort option,
            for (var i = 0; i < 3; i++) {  // uses i for indexing through both lists
                // if left sort option is less than right sort option, it goes first
                if (sort_methods[i](spellX[sort_options[i]]) < sort_methods[i](spellY[sort_options[i]])) {
                    return 1;
                } else if (sort_methods[i](spellX[sort_options[i]]) > sort_methods[i](spellY[sort_options[i]])) {
                // else, if the left sort option is greater than right sort option, it goes second
                    return -1;
                }
                // if they are equivalent, move to the next sort option
            }

            // if the options are the same after all 3 sorts, sort by name
            if (spellX.name > spellY.name) {
                return 1;
            }
            return -1;
        });
    } else {
        filtered_spells.sort((spellX, spellY) => {
            // for each sort option,
            for (var i = 0; i < 3; i++) {
                // if the left sort option is greater than right sort option, it goes first
                if (sort_methods[i](spellX[sort_options[i]]) > sort_methods[i](spellY[sort_options[i]])) {
                    return 1;
                } else if (sort_methods[i](spellX[sort_options[i]]) < sort_methods[i](spellY[sort_options[i]])) {
                // else, if left sort option is less than right sort option, it goes second
                    return -1;
                }
                // if they are equivalent, move to the next sort option
            }

            // if the options are the same after all 3 sorts, sort by name
            if (spellX.name > spellY.name) {
                return 1;
            }
            return -1;
        });
    }
}

// returns the string, used for level and name sort
function get_number(str) {
    return str;
}

// gets the time (in seconds) of a given duration string
function get_time(str) {
    return number_in_string(str) * dur_multiplier(str);
}

// gets the distance (in feet) of a given distance string
function get_distance(str) {
    return number_in_string(str) * dist_multiplier(str);
}

// gets a number in a string
function number_in_string(str) {
    // var inits
    var datas, data;
    // gets numbers. complex regex I googled and don't recall the source
    var numberRegex = new RegExp("^(\\d+|\\d{1,3}(,\\d{3})*)(\\.\\d+)?$");

    // split the string into sections separated by spaces
    datas = str.split(" ");
    // take the first item, and check the regex
    data = datas[0].match(numberRegex);
    // if a number is found in str, replace commas with nothing and return
    if (data != null) {
        return parseInt(data[0].replace(",", ""));
    }

    // if no number is found, return 9999
    return 9999;
}

// returns multiplier based on word given
function dur_multiplier(str) {
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
    return 260; // 'random' number given for proper order
}

// returns multiplier based on word given
function dist_multiplier(str) {
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

// toggles reverse sorting
function toggle_reverse_sort() {
    sort_reversed = !sort_reversed;
    document.getElementById("reverse_sort_box").classList.toggle("sort_toggled");

    sort_spells();
    filter_spells();
}

// dragging will not work on mobile, deal with at some point
// used in HTML to allow sort drops
function allow_sort_drop(event) {
    event.preventDefault();
}

// changes sort order based on drag and drop sort elements
function sort_drop(event) {
    // allow the drop
    event.preventDefault();

    // get the id of the sort object
    const id = event.dataTransfer.getData("id");
    var changed;
    // if dragging from and to active filters
    if (document.getElementById(id).getAttribute("sorting") == "active") {
        // see if the order changed
        changed = internal_drop(event);
    } else {
    // else dragging to active from inactive
        external_drop(event);
        changed = true; // always changes on external drag
    }

    if (changed) {
        sort_spells();
        filter_spells();
    }
}

// drag and drop to and from active sorts, new sort inserted at drag position, the rest moved down
function internal_drop(event) {
    // get the id and sort elements
    const id = event.dataTransfer.getData("id");
    const sort_list = document.getElementById("sort_list");
    const sorts = sort_list.children;

    // find the index the new sort was placed, and where it was dragged from
    const count = sort_list.childElementCount;
    const height_division = sort_list.clientHeight / count;
    const placed_index = Math.floor((event.clientY - sort_list.getBoundingClientRect().y) / height_division);
    const dragged_index = [...sorts].indexOf(document.getElementById(id));

    // if they are the same, nothing changed, return false.
    if (placed_index == dragged_index) {
        return false;
    }

    // get the dragged text and id
    var prev_text = sorts[dragged_index].children[0].innerHTML.slice(3);
    var prev_id = sorts[dragged_index].id;
    // holders for swapping values
    var temp_text;
    var temp_id;
    // if moving downwards
    if (placed_index < dragged_index) {
        // from the placed index to where it was dragged from, move everything downwards
        for (var i = placed_index; i <= dragged_index; i++) {
            // store the current text and id
            temp_text = sorts[i].children[0].innerHTML.slice(3);
            temp_id = sorts[i].id;

            // set the current text and id to the previous sort
            sorts[i].children[0].innerHTML = (i + 1) + ") " + prev_text;
            sorts[i].id = prev_id;

            // set the previous sort to the one just changed,
            prev_text = temp_text;
            prev_id = temp_id;
            // go next
        }
    } else {
    // if moving upwards
        // from where it was placed to where it came from,
        for (var i = placed_index; i >= dragged_index; i--) {
            // store current text and id
            temp_text = sorts[i].children[0].innerHTML.slice(3);
            temp_id = sorts[i].id;

            // set the current text and id to the previous sort
            sorts[i].children[0].innerHTML = (i + 1) + ") " + prev_text;
            sorts[i].id = prev_id;

            // set the previous sort to the one just changed,
            prev_text = temp_text;
            prev_id = temp_id;
            // go next
        }
    }

    // the sort changed, return true
    return true;
}

// drag and drop to active sorts from inactive sorts. swap bottom with inactive sort, then swap as if it was internal
function external_drop(event) {
    const id = event.dataTransfer.getData("id");
    const sort_list = document.getElementById("sort_list");
    const dragged = document.getElementById(id);

    // save the final sorts info
    const final_index = sort_list.childElementCount - 1;
    const final_text = "   " + sort_list.children[final_index].children[0].innerHTML.slice(3);
    const final_id = sort_list.children[final_index].id;

    // set the final sorts info to dragged info
    sort_list.children[final_index].children[0].innerHTML = "3) " + dragged.children[0].innerHTML.slice(3);
    sort_list.children[final_index].id = dragged.id;

    // set the dragged's info
    dragged.children[0].innerHTML = final_text;
    dragged.id = final_id;

    // place where dragged
    internal_drop(event);
}

// used by HTML to drag elements, stores id for use on swapping
function sort_drag(event) {
  event.dataTransfer.setData("id", event.target.id);
}