// set the document's body to constant elements that wont change
function add_page_constants() {
    // spellbook, scroll to top
    document.body.innerHTML = `
    <div class="square_button spellbook hover_transparency button" onclick="change_page();">
        <svg class="book_back" viewBox="0 0 10 10">
            <path d="M 0.1 1 Q 0 1 0 1.1 L 0 8.9 Q 0 9 0.1 9 L 2.5 9 L 2.5 8.7 L 2.6 9 L 9.9 9 Q 10 9 10 8.9 L 10 3 L 9.8 2.95 L 10 2.85 L 10 1.1 Q 10 1 9.9 1 L 1.4 1 L 1.4 1.25 L 1.3 1 Z"/>
        </svg>
        <svg class="book_pages" viewBox="0 0 10 10">
            <path d="M 0 1 L 0 9 L 3.45 9 Q 4.95 9 4.95 8 L 4.95 2 Q 4.95 1 3.45 1 Z M 10 1 L 10 9 L 6.55 9 Q 5.05 9 5.05 8 L 5.05 2 Q 5.05 1 6.55 1 Z"/>
        </svg>
    </div>

    <div class="square_button scroll_to_top hover_transparency button" onclick="scroll_to_top();">
        <svg class="scroll_to_top" viewBox="0 0 10 10">
            <path d="M 5 2 L 8 5 L 5 5 L 8 8 L 2 8 L 5 5 L 2 5 Z"/>
        </svg>
    </div>`
    ;
}

// build the spell list page
function build_main_page() {
    // get scroll to top and page change buttons
    add_page_constants();

    // title
    const title = `
        <div class="title">
            <p class="title">uaq's Spellbook</p>
        </div>`
    ;

    // discord button
    const discord = `
        <a class="square_button discord hover_transparency button" rel="noreferrer noopener" target="_blank"
           href="https://discord.gg/U9tGMhKgq8">
            <svg class="discord" viewBox="0 0 71 54">
                <path d="M60.1045 4.8978C55.5792 2.8214 50.7265 1.2916 45.6527 0.41542C45.5603 0.39851 45.468 0.440769 45.4204 0.525289C44.7963 1.6353 44.105 3.0834 43.6209 4.2216C38.1637 3.4046 32.7345 3.4046 27.3892 4.2216C26.905 3.0581 26.1886 1.6353 25.5617 0.525289C25.5141 0.443589 25.4218 0.40133 25.3294 0.41542C20.2584 1.2888 15.4057 2.8186 10.8776 4.8978C10.8384 4.9147 10.8048 4.9429 10.7825 4.9795C1.57795 18.7309 -0.943561 32.1443 0.293408 45.3914C0.299005 45.4562 0.335386 45.5182 0.385761 45.5576C6.45866 50.0174 12.3413 52.7249 18.1147 54.5195C18.2071 54.5477 18.305 54.5139 18.3638 54.4378C19.7295 52.5728 20.9469 50.6063 21.9907 48.5383C22.0523 48.4172 21.9935 48.2735 21.8676 48.2256C19.9366 47.4931 18.0979 46.6 16.3292 45.5858C16.1893 45.5041 16.1781 45.304 16.3068 45.2082C16.679 44.9293 17.0513 44.6391 17.4067 44.3461C17.471 44.2926 17.5606 44.2813 17.6362 44.3151C29.2558 49.6202 41.8354 49.6202 53.3179 44.3151C53.3935 44.2785 53.4831 44.2898 53.5502 44.3433C53.9057 44.6363 54.2779 44.9293 54.6529 45.2082C54.7816 45.304 54.7732 45.5041 54.6333 45.5858C52.8646 46.6197 51.0259 47.4931 49.0921 48.2228C48.9662 48.2707 48.9102 48.4172 48.9718 48.5383C50.038 50.6034 51.2554 52.5699 52.5959 54.435C52.6519 54.5139 52.7526 54.5477 52.845 54.5195C58.6464 52.7249 64.529 50.0174 70.6019 45.5576C70.6551 45.5182 70.6887 45.459 70.6943 45.3942C72.1747 30.0791 68.2147 16.7757 60.1968 4.9823C60.1772 4.9429 60.1437 4.9147 60.1045 4.8978ZM23.7259 37.3253C20.2276 37.3253 17.3451 34.1136 17.3451 30.1693C17.3451 26.225 20.1717 23.0133 23.7259 23.0133C27.308 23.0133 30.1626 26.2532 30.1066 30.1693C30.1066 34.1136 27.28 37.3253 23.7259 37.3253ZM47.3178 37.3253C43.8196 37.3253 40.9371 34.1136 40.9371 30.1693C40.9371 26.225 43.7636 23.0133 47.3178 23.0133C50.9 23.0133 53.7545 26.2532 53.6986 30.1693C53.6986 34.1136 50.9 37.3253 47.3178 37.3253Z"/>
            </svg>
        </a>`
    ;

    // search bar
    const search_bar = `
        <input id="search_bar" class="search_bar" autocomplete="off" placeholder="Search:" oninput="filter_spells();">`
    ;

    // filter button
    const filter_button = `
        <div class="filter_button button" onclick="open_filters();">
            <p class="filter_button_text filter_title">Open Filter Options</p>
        </div>`
    ;

    // clear filters button
    const clear_filters = `
        <div class="filter_button clear_filters_button button" onclick="clear_filters();">
            <p id="filter_title" class="filter_button_text filter_title">Clear Active Filters (0)</p>
        </div>`
    ;

    // filter menu
    const filter_menu = `
        <div id="filter_menu" class="screen_back hidden" onclick="close_filters();">
            <div class="open_screen row_container" onclick="event.stopPropagation()">
                <!-- Filter -->
                <div id="filters" class="half_box" style="border-right: var(--ol) 1.5px solid"></div>
                <!-- Sorting -->
                <div class="half_box" style="border-left: var(--ol) 1.5px solid">
                    <p id="spell_count" class="filter_title">Sorting N Spells by: </p>
                    <div id="sort_list" ondrop="sort_drop(event);" ondragover="allow_sort_drop(event);">
                        <div id="level_sort" class="spell draggable" draggable="true" ondragstart="sort_drag(event);" sorting="active">
                            <p class="spell_title">1) Level</p>
                        </div>
                        <div id="name_sort" class="spell draggable" draggable="true" ondragstart="sort_drag(event);" sorting="active">
                            <p class="spell_title">2) Name</p>
                        </div>
                        <div id="range_sort" class="spell draggable" draggable="true" ondragstart="sort_drag(event);" sorting="active">
                            <p class="spell_title">3) Range</p>
                        </div>
                    </div>
                    <br>
                    <p class="filter_title">Inactive Sort Options:</p>
                    <div id="inactive_sort_list">
                        <div id="cast_time_sort" class="spell draggable" draggable="true" ondragstart="sort_drag(event);" sorting="inactive">
                            <p class="spell_title">   Cast Time</p>
                        </div>
                        <div id="duration_sort" class="spell draggable" draggable="true" ondragstart="sort_drag(event);" sorting="inactive">
                            <p class="spell_title">   Duration</p>
                        </div>
                    </div>
                    <br>
                    <div class="row_container button" onclick="toggle_reverse_sort();">
                        <div id="reverse_sort_box" class="filter_selection"></div>
                        <p  id="reverse_sort_text" class="filter_selection">Reverse Sort Direction</p>
                    </div>
                </div>
            </div>
        </div>`
    ;

    // spell container
    const spell_container = `
        <div id="spell_list"></div>`
    ;

    // bottom spacer
    const spacer = `
        <div class="bottom_spacer"></div>`
    ;

    // combine elements together
    const spell_body = title + discord + search_bar + filter_button + clear_filters + filter_menu + spell_container
                       + spacer;

    // set the HTML body
    document.body.innerHTML += spell_body;
}

// build the spellbook page
function build_book_page() {
//    add_page_constants();
//
//    const header = `
//        <div class="header">
//            <p class="spellbook_name">Unnamed's spellbook</p>
//        </div>`
//    ;
//
//    const big_thing = `
//        <div style="height: 100rem;"></div>`
//    ;
//
//    // combine elements together
//    const spell_body = header + big_thing;
//
//    // set the HTML body
//    document.body.innerHTML += spell_body;

// grab all character options
    // get the character selector
    const character_selector = document.getElementById("spellbook_selector");
    // template for character options
    const option_template = `<option value="{0}">{1}</option>`;

    // temp variable for string to HTML
    var options = "";
    var character;
    // for all stored characters, create an option to select it
    for (var i = 0, count = character_list.length; i < count; i++) {
        character = character_list[i].name;
        options += format_string(option_template, i, character);
    }

    // set the HTML
    character_selector.innerHTML = options;

    // set the active character
    character_selector.value = active_character;
    set_character(active_character);
}

// check for resizing of window, recalculate sizes
addEventListener("resize", (event) => {
    if (page == "book") {
        resize_character_selector();
    }
});

// set the displayed and stored character to the chosen index
function set_character(index) {
// set active character
    active_character = index;

// character selector
    // set the new character in storage
    localStorage.active_character = index;
    character = character_list[index];

    // resize the character selector
    resize_character_selector();

// class and level
    // set level
    document.getElementById("level").value = character.level;

    // if data hasn't loaded, don't set class or spell slots
    if (spell_list.length == 0) {
        return;
    }

    // set class
    set_class(character.class, false);
    // set level width
    const level_input = document.getElementById("level");
    if (character.level > 9) {
        level_input.style.width = "1.6rem";
    } else {
        level_input.style.width = ".8rem";
    }

    // get spell slot amounts
    get_spell_slots();
}

function resize_character_selector() {
    const character_selector = document.getElementById("spellbook_selector");

    // create a temp element to get the width wanted to change the selector to
    var x = document.createElement("p"); // create new p element
    x.classList.add("spellbook_name"); // with same class for sizing
    x.classList.add("overflow"); // with overflow for width clipping
    character_selector.parentElement.style.width = "60%"; // set to occupy as large as it can for measurement
    // set a max-width for overflow clipping, set width to fit for correct size
    x.style = `max-width: calc(${character_selector.parentElement.clientWidth}px - 13rem); width: fit-content;`;
    character_selector.parentElement.style.width = ""; // remove fixed size
    x.innerHTML = character_selector.children[active_character].innerHTML; // set its text to the option
    document.body.appendChild(x); // add to the body (otherwise width == 0)
    const width = x.clientWidth; // get the width
    document.body.removeChild(x); // remove the new element

    // set the width to measured size, plus constant offset for down arrow and spacing
    character_selector.style.width = `calc(${width}px + 1.35rem)`;
}

// takes filter_options classes and forms the class selector
function create_class_list() {
    const class_selector = document.getElementById("class_selector");
    // get classes from filter_options
    const class_list = [...filter_options["classes"]];
    // template for class options
    const class_template = `<option value="{0}">{0}</option>`

    var classes = "";
    // for all classes, create an option to select it
    for (var _class of class_list) {
        classes += format_string(class_template, _class);
    }

    // set the HTML
    class_selector.innerHTML = classes;
    // set the active class
    class_selector.value = character_list[active_character].class;
}

// set class to given class name. saves by default
function set_class(class_name, save=true) {
    // get class_selector and set the class to the new class
    const class_selector = document.getElementById("class_selector");
    class_selector.value = class_name;

    // create a temp element to get the width wanted to change the selector to
    var x = document.createElement("p"); // create new p element
    x.classList.add("class_level"); // with same class for sizing
    x.innerHTML = class_name; // set its text to the option
    document.body.appendChild(x); // add to the body (otherwise width == 0)
    const width = x.clientWidth; // get the width
    document.body.removeChild(x); // remove the new element

    // set the width to measured size, plus constant offset for down arrow and spacing
    class_selector.style.width = `calc(${width}px + 1.25rem)`;

    // change class in character, save character
    if (save) {
        character_list[active_character].class = class_name;
        save_characters();

        // set new spell slot values
        get_spell_slots();
    }
}

// sets stores level to storage, and changes width of input based on number
function set_level(level) {
    // on blank level, ignore
    if (level == "") {
        return;
    }

    // ensure integer
    level = parseInt(level);

    // adjust width for numbers > 9
    const level_input = document.getElementById("level");
    if (level > 9) {
        level_input.style.width = "1.6rem";
    } else {
        level_input.style.width = ".8rem";
    }

    // clamp the level to valid levels
    level = clamp(level, 1, 20);

    // set and save level
    document.getElementById("level").value = level;  // needed incase clamp is used from typing
    character_list[active_character].level = level;
    save_characters();

    // set new spell slot values
    get_spell_slots();
}