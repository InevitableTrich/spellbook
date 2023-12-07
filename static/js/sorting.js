var sort_reversed = false;

function sort_spells() {
    const sort_method_options = {
        "cast_time": get_time,
        "duration": get_time,
        "level": get_number,
        "name": get_number,
        "range": get_distance
    };

    const sorts = document.getElementById("sort_list").children;
    const sort_methods = [
        sorts[0].id.slice(0, sorts[0].id.indexOf("_sort")),
        sorts[1].id.slice(0, sorts[1].id.indexOf("_sort")),
        sorts[2].id.slice(0, sorts[2].id.indexOf("_sort"))
    ];

    const sort_options = [
        sort_method_options[sort_methods[0]],
        sort_method_options[sort_methods[1]],
        sort_method_options[sort_methods[2]]
    ]

    if (!sort_reversed) {
        filtered_spells.sort((spellX, spellY) => {
            // for each sort option,
            for (var i = 0; i < 3; i++) {
                // check if left sort option is greater than right sort option
                if (sort_options[i](spellX[sort_methods[i]]) > sort_options[i](spellY[sort_methods[i]])) {
                    return 1;
                } else if (sort_options[i](spellX[sort_methods[i]]) < sort_options[i](spellY[sort_methods[i]])) {
                    return -1;
                }
            }

            // if the same after all 3 sorts, sort by name
            if (spellX.name > spellY.name) {
                return 1;
            }
            return -1;
        });
    } else {
        filtered_spells.sort((spellX, spellY) => {
            // for each sort option,
            for (var i = 0; i < 3; i++) {
                // check if left sort option is greater than right sort option
                if (sort_options[i](spellX[sort_methods[i]]) > sort_options[i](spellY[sort_methods[i]])) {
                    return -1;
                } else if (sort_options[i](spellX[sort_methods[i]]) < sort_options[i](spellY[sort_methods[i]])) {
                    return 1;
                }
            }

            // if the same after all 3 sorts, sort by name
            if (spellX.name > spellY.name) {
                return -1;
            }
            return 1;
        });
    }
}

function get_number(str) {
    return str;
}

function get_time(str) {
    return number_in_string(str) * dur_multiplier(str);
}

function get_distance(str) {
    return number_in_string(str) * dist_multiplier(str);
}

function number_in_string(str) {
    var datas, data;
    var numberRegex = new RegExp("^(\\d+|\\d{1,3}(,\\d{3})*)(\\.\\d+)?$");

    datas = str.split(" ");
    data = datas[0].match(numberRegex);
    if (data != null) { // if a number is found in str:
        return parseInt(data[0].replace(",", ""));
    }

    return 9999;
}

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
    return 260;
}

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

function toggle_reverse_sort() {
    sort_reversed = !sort_reversed;
    document.getElementById("reverse_sort_box").classList.toggle("filter_selected");

    sort_spells();
    filter_spells();
}

// dragging will not work on mobile, deal with at some point
const sort_list = document.getElementById("sort_list");
function allow_sort_drop(event) {
    event.preventDefault();
}

function sort_drop(event) {
    event.preventDefault();

    const id = event.dataTransfer.getData("id");
    var changed;
    if (document.getElementById(id).getAttribute("sorting") == "active") {
        changed = internal_drop(event);
    } else {
        external_drop(event);
        changed = true; // always changes on external
    }

    if (changed) {
        sort_spells(filtered_spells);
        filter_spells();
    }
}

function internal_drop(event) {
    const id = event.dataTransfer.getData("id");
    const container = document.getElementById("sort_list");
    const sorts = container.children;

    const count = container.childElementCount;
    const height_division = container.clientHeight / count;
    const placed_index = Math.floor((event.clientY - container.getBoundingClientRect().y) / height_division);
    const dragged_index = [...sorts].indexOf(document.getElementById(id));

    if (placed_index == dragged_index) {
        return false;
    }

    var prev_text = sorts[dragged_index].children[0].innerHTML.slice(3);
    var prev_id = sorts[dragged_index].id;
    var temp_text;
    var temp_id;
    if (placed_index < dragged_index) {
        for (var i = placed_index; i <= dragged_index; i++) {
            temp_text = sorts[i].children[0].innerHTML.slice(3);
            temp_id = sorts[i].id;

            sorts[i].children[0].innerHTML = (i + 1) + ") " + prev_text;
            sorts[i].id = prev_id;

            prev_text = temp_text;
            prev_id = temp_id;
        }
    } else {
        for (var i = placed_index; i >= dragged_index; i--) {
            temp_text = sorts[i].children[0].innerHTML.slice(3);
            temp_id = sorts[i].id;

            sorts[i].children[0].innerHTML = (i + 1) + ") " + prev_text;
            sorts[i].id = prev_id;

            prev_text = temp_text;
            prev_id = temp_id;
        }
    }

    return true;
}

function external_drop(event) {
    const id = event.dataTransfer.getData("id");
    const container = document.getElementById("sort_list");
    const dragged = document.getElementById(id);

    // save the final sorts info
    const final_index = container.childElementCount - 1;
    const final_text = "   " + container.children[final_index].children[0].innerHTML.slice(3);
    const final_id = container.children[final_index].id;

    // set the final sorts info to dragged info
    container.children[final_index].children[0].innerHTML = dragged.children[0].innerHTML;
    container.children[final_index].id = dragged.id;

    // set the dragged's info
    dragged.children[0].innerHTML = final_text;
    dragged.id = final_id;

    // place where dragged
    internal_drop(event);
}

function sort_drag(event) {
  event.dataTransfer.setData("id", event.target.id);
}