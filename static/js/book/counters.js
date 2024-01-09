// loads all counters
function load_counters() {
    // get counter container
    const counter_container = document.getElementById("counter_list");

    // counter templates
    const counter_template = `
        <div id="counter_{0}" class="counter">
            <div class="row_container" style="height: fit-content;">
                <svg class="counter_arrow" viewBox="0 0 7 7">
                    <path d="M 3.5 0 L 7 3 L 0 3 Z" class="button" onclick="set_counter({0}, 1, true)"
                        style="fill: var(--text);"/>
                    <path d="M 3.5 7 L 7 4 L 0 4 Z" class="button" onclick="set_counter({0}, -1, true)"
                        style="fill: var(--text);"/>
                </svg>
                <input id="counter_{0}_value" class="counter_input" placeholder="0" type="number" min="0" max="{1}"
                    oninput="set_counter({0}, value, false);">
                <p class="counter_text">/ {1}</p>
            </div>
            <p class="counter_name">{2}</p>
        </div>`
    ;
    const counter_option_template = `<option value="{0}">{1}</option>`;

    // get the list of counters and counter selects
    const counter_list = character_list[active_character].counters;
    const edit_counter_select = document.getElementById("edit_counter_select");
    const delete_counter_select = document.getElementById("delete_counter_select");

    var counters = "";
    var counter_options = "";
    var counter;
    // for each stored counter, place it in a template
    for (var i = 0, count = counter_list.length; i < count; i++) {
        counter = counter_list[i];
        counters += format_string(counter_template, i, counter.max, counter.name);
        counter_options += format_string(counter_option_template, i, counter.name);
    }

    // set the html
    counter_container.innerHTML = counters;
    edit_counter_select.innerHTML = counter_options;
    delete_counter_select.innerHTML = counter_options;

    // set the counters values
    for (var i = 0, count = counter_list.length; i < count; i++) {
        set_counter(i, counter_list[i].value, false);
    }
}

// edits the selected counter
function edit_counter() {
    // get inputs
    const edit_name = document.getElementById("edit_counter_name");
    const edit_max = document.getElementById("edit_counter_max");

    // if both new name and max is empty, ignore
    if (edit_name.value == "" && edit_max.value == "") {
        return;
    }

    // get the edit index, counter variable, counter html, and counter selector
    const edit_index = parseInt(document.getElementById("edit_counter_select").value);
    var counter_data = character_list[active_character].counters[edit_index];
    const counter = document.getElementById("counter_" + edit_index);
    const counter_selector = document.getElementById("edit_counter_select");

    // edit the name if changed
    var new_name = edit_name.value;
    if (new_name == "") {
        new_name = counter_data.name;
    }

    // edit the max if changed
    var new_max = edit_max.value;
    if (new_max == "") {
        new_max = counter_data.max;
    }

    // update the current value if it's larger than the new max
    if (counter_data.value > new_max) {
        counter_data.value = new_max;
        counter.children[0].children[1].value = new_max;
    }

    // set the counter's new data
    counter_data.name = new_name;
    counter_data.max = new_max;
    counter.children[0].children[2].innerHTML = "/ " + new_max;
    counter.children[1].innerHTML = new_name;
    counter_selector[edit_index].innerHTML = new_name;

    // clear the inputs, close the button
    edit_name.value = "";
    edit_max.value = "";
    toggle_character_button("edit_counter");

    // save the edit
    save_characters();
}

// add a new counter
function add_counter() {
    // get name and max inputs
    const name_input = document.getElementById("add_counter_name");
    const max_input = document.getElementById("add_counter_max");

    // ignore confirm if both name or max is empty
    if (name_input.value == "" && max_input.value == "") {
        return;
    }

    // get values if they exist, else keep current
    var name = name_input.value;
    if (name == "") {
        name = "Counter Name";
    }

    var max = max_input.value;
    if (max == "") {
        max = 5;
    }

    // create the new counter
    const new_counter = {"name": name, "max": max, "value": 0};

    // add it to the character
    character_list[active_character].counters.push(new_counter);

    // counter template
    const counter_template = `
        <div id="counter_{0}" class="counter">
            <div class="row_container" style="height: fit-content;">
                <svg class="counter_arrow" viewBox="0 0 7 7">
                    <path d="M 3.5 0 L 7 3 L 0 3 Z" class="button" onclick="set_counter({0}, 1, true)"
                        style="fill: var(--text);"/>
                    <path d="M 3.5 7 L 7 4 L 0 4 Z" class="button" onclick="set_counter({0}, -1, true)"
                        style="fill: var(--text);"/>
                </svg>
                <input id="counter_{0}_value" class="counter_input" placeholder="0" type="number" min="0" value = "{3}"
                    max="{1}" oninput="set_counter({0}, value, false);">
                <p class="counter_text">/ {1}</p>
            </div>
            <p class="counter_name">{2}</p>
        </div>`
    ;
    const counter_option_template = `<option value="{0}">{1}</option>`;

    // get the counter container
    const counter_container = document.getElementById("counter_list");
    // add the counter to the counter container and selections
    const index = counter_container.childElementCount;
    counter_container.insertAdjacentHTML("beforeend", format_string(counter_template, index, max, name));
    document.getElementById("edit_counter_select").insertAdjacentHTML("beforeend",
        format_string(counter_option_template, index, name));
    document.getElementById("delete_counter_select").insertAdjacentHTML("beforeend",
        format_string(counter_option_template, index, name));

    // clear the inputs and close the button
    name_input.value = "";
    max_input.value = "";
    toggle_character_button("new_counter");

    // save character
    save_characters();
}

// deletes a selected counter. uses same delete click tracker as character deletor
function delete_counter() {
    // if there are no previous clicks, add a new one that expires in 500ms
    if (delete_click_tracker < 1) {
        var click_id = setTimeout(() => {
            delete_click_tracker = 0;
        }, 500)

        // add the click to the tracker
        delete_click_tracker = 1;

        return;
    }

    // disallow further second clicks until the clear
    delete_click_tracker = -99;

    // get counter index, select elements, and counter container
    const index = document.getElementById("delete_counter_select").value;
    const delete_select = document.getElementById("delete_counter_select");
    const edit_select = document.getElementById("edit_counter_select");
    const counter_container = document.getElementById("counter_list");

    // remove from character list
    character_list[active_character].counters.splice(index, 1);

    // delete the counter html and select options
    document.getElementById("counter_" + index).remove();
    delete_select[index].remove();
    edit_select[index].remove();

    // re-number selects and counters
    for (var i = 0, count = delete_select.childElementCount; i < count; i++) {
        delete_select.children[i].value = i;
        edit_select.children[i].value = i;
        counter_list.children[i].id = "counter_" + i;
    }

    // close the button
    toggle_character_button("delete_counter");

    // save the character
    save_characters();
}

// clamps counter from 1 to 99
function clamp_counter_max(id) {
    // get the input
    const max_input = document.getElementById(id);

    // if the value is empty, ignore input, else clamp
    if (max_input.value == "") {
        return;
    }
    const new_value = clamp(parseInt(max_input.value), 1, 99);

    // set the new value
    max_input.value = new_value;
}

// set the counter to the given value
function set_counter(num, value, modify) {
    // if typing and is blank, ignore
    if (value === "" && !modify) {
        return;
    }

    // get the counter
    const counter = document.getElementById("counter_" + num + "_value");

    // if counter is empty when inc/decrementing, assume 0
    if (value == "") {
        counter.value = 0;
    }

    // clamp the new value
    var new_value;
    if (modify) {
        // old value changed by value
        new_value = clamp(parseInt(counter.value) + value, 0, counter.max);
    } else {
        // set old value to value
        new_value = clamp(value, 0, counter.max);
    }

    // set the new value
    counter.value = new_value;
    character_list[active_character].counters[num].value = new_value;

    // change top arrow color according to bounds
    if (new_value == parseInt(counter.max)) {  // if max, gray out arrow, unbutton
        counter.previousElementSibling.children[0].style = "fill: var(--tog);";
        counter.previousElementSibling.children[0].classList.remove("button");
    } else {  // else is white button
        counter.previousElementSibling.children[0].style = "fill: var(--text);";
        counter.previousElementSibling.children[0].classList.add("button");
    }
    // change bottom arrow color according to bounds
    if (new_value == 0) {  // if 0, gray out arrow, unbutton
        counter.previousElementSibling.children[1].style = "fill: var(--tog);";
        counter.previousElementSibling.children[1].classList.remove("button");
    } else {  // else is white button
        counter.previousElementSibling.children[1].style = "fill: var(--text);";
        counter.previousElementSibling.children[1].classList.add("button");
    }

    // save characters
    save_characters();
}