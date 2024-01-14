const counter_template = `
    <div id="counter_{0}" class="counter">
        <div class="counter_delete_button hidden">
            <svg class="delete_x button" viewbox="0 0 5 5" onclick="delete_counter({0});">
                <path d="M 0 1 L 1.5 2.5 L 0 4 L 1 5 L 2.5 3.5 L 4 5 L 5 4 L 3.5 2.5 L 5 1 L 4 0 L 2.5 1.5 L 1 0 Z"/>
            </svg>
        </div>
        <div class="row_container" style="height: fit-content;">
            <svg class="counter_arrow" viewBox="0 0 7 7">
                <path d="M 3.5 0 L 7 3 L 0 3 Z" class="button" onclick="set_counter({0}, 1, true)"
                    style="fill: var(--text);"/>
                <path d="M 3.5 7 L 7 4 L 0 4 Z" class="button" onclick="set_counter({0}, -1, true)"
                    style="fill: var(--text);"/>
            </svg>
            <input id="counter_{0}_value" class="counter_input" placeholder="0" type="number" min="0" max="{1}"
                oninput="set_counter({0}, value, false);">
            <p class="counter_text">/</p>
            <input id="counter_{0}_max" class="counter_input" placeholder="0" type="number" min="1" max="99" value="{1}"
                oninput="set_counter_max({0}, value);" onblur="set_counter({0}, 0, true);">
        </div>
        <input class="counter_name" placeholder="Counter" value="{2}" onblur="set_counter_name({0}, value)"/>
    </div>`
;
const no_counters = `
    <p class="no_spells" style="margin: 2rem 0;">You have no counters. Click the
        <svg class="counter_sign counter_sign_text" viewbox="0 0 6 6">
            <path d="M 2.33 2.33 L 2.33 0 L 3.66 0 L 3.66 2.33 L 6 2.33 L 6 3.66 L 3.66 3.66 L 3.66 6 L 2.33 6 L 2.33 3.66 L 0 3.66 L 0 2.33 Z"/>
        </svg>
    icon to the right to add one.</p>`
;


// loads all counters
function load_counters() {
    // get counter container
    const counter_container = document.getElementById("counter_list");

    // get the list of counters and counter selects
    const counter_list = character_list[active_character].counters;

    // if there are no counters, add some indicator text
    if (counter_list.length == 0) {
        counter_container.innerHTML = no_counters;
    } else {
        var counters = "";
        var counter_options = "";
        var counter;
        // for each stored counter, place it in a template
        for (var i = 0, count = counter_list.length; i < count; i++) {
            counter = counter_list[i];
            counters += format_string(counter_template, i, counter.max, counter.name);
        }

        // set the html
        counter_container.innerHTML = counters;

        // set the counters values
        for (var i = 0, count = counter_list.length; i < count; i++) {
            set_counter(i, counter_list[i].value, false);
        }
    }
}

// adds a new counter
function add_counter() {
    // get the counter container
    const counter_container = document.getElementById("counter_list");

    // if 'no counter text' is present, remove it
    if (counter_container.children[0].tagName == "P") {
        counter_container.innerHTML = "";
    }

    // get the index and add the counter
    const index = counter_container.childElementCount;
    counter_container.insertAdjacentHTML("beforeend", format_string(counter_template, index, 5,"Counter"));
    character_list[active_character].counters.push({"name": "Counter", "value": 5, "max": 5})

    // set the value to its max
    set_counter(index, 5, false);

    // save character
    save_characters();
}

// toggles the counter deletion buttons
function toggle_counter_delete() {
    // get the delete minus sign
    const delete_sign = document.getElementById("delete_sign");

    // get all counter delete buttons
    const counter_deletes = document.getElementsByClassName("counter_delete_button");

    // toggle hidden them
    for (var counter of counter_deletes) {
        counter.classList.toggle("hidden");
    }

    // toggle red minus sign
    delete_sign.classList.toggle("deleting");
}

// deletes the counter
function delete_counter(num) {
    // remove the element
    document.getElementById("counter_" + num).remove();

    // if there are no counters, set the no counter text, toggle counter delete
    const counter_container = document.getElementById("counter_list");
    if (counter_container.childElementCount == 0) {
        counter_container.innerHTML = no_counters;
        toggle_counter_delete();
    }

    // remove from character and save
    character_list[active_character].counters.splice(num, 1);
    save_characters();
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
    if (value === "") {
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
    const top_arrow = counter.previousElementSibling.children[0];
    const bottom_arrow = counter.previousElementSibling.children[1];
    if (new_value == parseInt(counter.max)) {  // if max, gray out arrow, unbutton
        top_arrow.style = "fill: var(--tog);";
        top_arrow.classList.remove("button");
    } else {  // else is white button
        top_arrow.style = "fill: var(--text);";
        top_arrow.classList.add("button");
    }
    // change bottom arrow color according to bounds
    if (new_value == 0) {  // if 0, gray out arrow, unbutton
        bottom_arrow.style = "fill: var(--tog);";
        bottom_arrow.classList.remove("button");
    } else {  // else is white button
        bottom_arrow.style = "fill: var(--text);";
        bottom_arrow.classList.add("button");
    }

    // save characters
    save_characters();
}

// sets a counters max value
function set_counter_max(num, value) {
    // ignore if it's blank
    if (value == "") {
        return;
    }

    // get the counters
    const value_counter = document.getElementById("counter_" + num + "_value");
    const max_counter = document.getElementById("counter_" + num + "_max");

    // clamp the new value
    const new_max = clamp(value, 1, 99);

    // set the new value
    max_counter.value = new_max;
    value_counter.max = new_max;
    character_list[active_character].counters[num].max = new_max;

    // save characters
    save_characters();
}

// stores a counters name
function set_counter_name(num, value) {
    // if left blank, set value to Counter
    if (value == "") {
        value = "Counter";
    }

    // set the name and save
    character_list[active_character].counters[num].name = value;
    save_characters();
}