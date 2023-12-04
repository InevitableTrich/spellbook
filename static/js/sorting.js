function sort_spells(list) {
    list.sort((spellX, spellY) => {
        if (spellX.level > spellY.level) {
            return 1;
        } else if (spellY.level > spellX.level) {
            return -1;
        } else {
            if (spellX.name > spellY.name) {
                return 1;
            } else {
                return -1;
            }
        }
    })
}


// dragging will not work on mobile, deal with at some point
const sort_list = document.getElementById("sort_list");
function allow_sort_drop(event) {
    event.preventDefault();
}

function sort_drop(event) {
    event.preventDefault();

    const id = event.dataTransfer.getData("id");
    if (document.getElementById(id).getAttribute("sorting") == "active") {
        internal_drop(event);
    } else {
        external_drop(event);
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