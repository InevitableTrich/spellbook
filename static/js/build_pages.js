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
        <div class="filter_button button" onclick="open_screen('filter_menu');">
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
        <div id="filter_menu" class="screen_back hidden" onclick="close_screen('filter_menu');">
            <div class="open_screen row_container" onclick="event.stopPropagation();">
                <!-- Filter -->
                <div id="filters" class="half_box" style="border-right: var(--ol) 1.5px solid"></div>
                <!-- Sorting -->
                <div class="half_box" style="border-left: var(--ol) 1.5px solid">
                    <p id="spell_count" class="filter_title">Sorting N Spells by: </p>
                    <div id="sort_list" ondrop="sort_drop(event);" ondragover="allow_sort_drop(event);">
                        <div id="level_sort" class="row_container spell draggable" draggable="true"
                                ondragstart="sort_drag(event);" sorting="active">
                            <p class="spell_title">1) Level</p>
                            <svg class="filter_arrow" viewBox="0 0 7 7">
                                <path fill="var(--tog)" d="M 3.5 0 L 7 3 L 0 3 Z"/>
                                <path class="button" fill="var(--text)" d="M 3.5 7 L 7 4 L 0 4 Z"
                                    onclick="internal_sort_move(0, 1);"/>
                            </svg>
                        </div>
                        <div id="name_sort" class="row_container spell draggable" draggable="true"
                                ondragstart="sort_drag(event);" sorting="active">
                            <p class="spell_title">2) Name</p>
                            <svg class="filter_arrow" viewBox="0 0 7 7">
                                <path class="button" fill="var(--text)" d="M 3.5 0 L 7 3 L 0 3 Z"
                                    onclick="internal_sort_move(1, -1);"/>
                                <path class="button" fill="var(--text)" d="M 3.5 7 L 7 4 L 0 4 Z"
                                    onclick="internal_sort_move(1, 1);"/>
                            </svg>
                        </div>
                        <div id="range_sort" class="row_container spell draggable" draggable="true"
                                ondragstart="sort_drag(event);" sorting="active">
                            <p class="spell_title">3) Range</p>
                            <svg class="filter_arrow" viewBox="0 0 7 7">
                                <path class="button" fill="var(--text)" d="M 3.5 0 L 7 3 L 0 3 Z"
                                    onclick="internal_sort_move(2, -1);"/>
                                <path fill="var(--tog)" d="M 3.5 7 L 7 4 L 0 4 Z"/>
                            </svg>
                        </div>
                    </div>
                    <br>
                    <p class="filter_title">Inactive Sort Options:</p>
                    <div id="inactive_sort_list">
                        <div id="cast_time_sort" class="row_container spell draggable" draggable="true"
                                ondragstart="sort_drag(event);" sorting="inactive">
                            <p class="spell_title">   Cast Time</p>
                            <svg class="filter_arrow" viewBox="0 0 7 7">
                                <path class="button" fill="var(--text)" d="M 3.5 0 L 7 3 L 0 3 Z"
                                    onclick="external_sort_move(0);"/>
                                <path fill="var(--tog)" d="M 3.5 7 L 7 4 L 0 4 Z"/>
                            </svg>
                        </div>
                        <div id="duration_sort" class="row_container spell draggable" draggable="true"
                                ondragstart="sort_drag(event);" sorting="inactive">
                            <p class="spell_title">   Duration</p>
                            <svg class="filter_arrow" viewBox="0 0 7 7">
                                <path class="button" fill="var(--text)" d="M 3.5 0 L 7 3 L 0 3 Z"
                                    onclick="external_sort_move(1);"/>
                                <path fill="var(--tog)" d="M 3.5 7 L 7 4 L 0 4 Z"/>
                            </svg>
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
        <br>
        <div id="spell_list">
            <svg viewbox="0 0 10 10" class="loading_svg"><path fill="rgb(90,90,90)" d="M 4.5 1.5 Q 4.5 1 5 1 Q 5.5 1 5.5 1.5 L 5.5 2.5 Q 5.5 3 5 3 Q 4.5 3 4.5 2.5 Z"/><path fill="rgb(102,102,102)" d="M 7.183 2.2189 Q 7.433 1.7859 7 1.536 Q 6.567 1.2861 6.317 1.7171 L 5.817 2.5851 Q 5.567 3.0181 6 3.268 Q 6.433 3.518 6.683 3.0849 Z"/><path fill="rgb(114,114,114)" d="M 8.281 3.684 Q 8.714 3.434 8.464 3 Q 8.214 2.568 7.781 2.818 L 6.915 3.318 Q 6.482 3.568 6.732 4 Q 6.982 4.434 7.415 4.184 Z"/><path fill="rgb(126,126,126)" d="M 8.5 4.5 Q 9 4.5 9 5 Q 9 5.5 8.5 5.5 L 7.5 5.5 Q 7 5.5 7 5 Q 7 4.5 7.5 4.5 Z"/><path fill="rgb(138,138,138)" d="M 7.416 5.816 Q 6.983 5.567 6.733 6 Q 6.483 6.433 6.916 6.682 L 7.782 7.182 Q 8.215 7.432 8.464 7 Q 8.715 6.566 8.282 6.316 Z"/><path fill="rgb(150,150,150)" d="M 6.317 8.281 Q 6.567 8.714 7 8.464 Q 7.433 8.214 7.183 7.781 L 6.683 6.915 Q 6.433 6.482 6 6.732 Q 5.567 6.982 5.817 7.415 Z"/><path fill="rgb(162,162,162)" d="M 5.5 8.5 Q 5.5 9 5 9 Q 4.5 9 4.5 8.5 L 4.5 7.5 Q 4.5 7 5 7 Q 5.5 7 5.5 7.5 Z"/><path fill="rgb(174,174,174)" d="M 2.817 7.781 Q 2.567 8.214 3 8.464 Q 3.433 8.714 3.683 8.281 L 4.183 7.415 Q 4.433 6.982 4 6.732 Q 3.567 6.482 3.317 6.925 Z"/><path fill="rgb(186,186,186)" d="M 1.719 6.316 Q 1.286 6.566 1.536 7 Q 1.786 7.432 2.219 7.182 L 3.085 6.682 Q 3.518 6.432 3.268 6 Q 3.018 5.566 2.585 5.816 Z"/><path fill="rgb(198,198,198)" d="M 1.5 5.5 Q 1 5.5 1 5 Q 1 4.5 1.5 4.5 L 2.5 4.5 Q 3 4.5 3 5 Q 3 5.5 2.5 5.5 Z"/><path fill="rgb(210,210,210)" d="M 2.219 2.818 Q 1.786 2.568 1.536 3.0012 Q 1.286 3.434 1.719 3.684 L 2.585 4.184 Q 3.0183 4.434 3.286 4 Q 3.518 3.568 3.0845 3.318 Z"/><path fill="rgb(222,222,222)" d="M 3.683 1.719 Q 3.433 1.286 3 1.586 Q 2.567 1.786 2.817 2.219 L 3.317 3.085 Q 3.567 3.518 4 3.268 Q 4.433 3.0181 4.183 2.585 Z"/></svg>
        </div>`
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
    add_page_constants();

    const start_header = `<div class="header space_evenly">`;

    const spellbook_name = `
        <div class="row_container character_container">
            <svg class="selector_arrow" viewBox="0 0 4 2.25">
                <path d="M 0 0 L 2 1.5 L 4 0 L 4 0.75 L 2 2.25 L 0 0.75 Z"/>
            </svg>
            <select id="spellbook_selector" class="spellbook_selector spellbook_name overflow"
                    onchange="set_character(value);"></select>
            <p class="spellbook_name">'s Spellbook</p>
        </div>`
    ;

    const class_and_level = `
        <div class="mobile_level_slot_container">
            <div class="row_container class_level_container">
                <svg class="selector_arrow" viewBox="0 0 4 2.25" style="padding-top: 0.6rem; margin-left: 0.5rem;">
                    <path d="M 0 0 L 2 1.5 L 4 0 L 4 0.75 L 2 2.25 L 0 0.75 Z"/>
                </svg>
                <select id="class_selector" class="class_selector class_level" onchange="set_class(value);"></select>
                <p class="class_level">, Level</p>
                <input id="level" class="class_level level_input" type="number" placeholder="1" value="0"
                       min="1" max="20" oninput="set_level(value);">
            </div>`
    ;

    const spell_slot_table = `
            <div class="slot_table_container">
                <table class="slot_table">
                    <tbody>
                        <tr>
                            <td class="slot_info">Slot</td>
                            <td class="slot_info">1</td>
                            <td class="slot_info">2</td>
                            <td class="slot_info">3</td>
                            <td class="slot_info">4</td>
                            <td class="slot_info">5</td>
                            <td class="slot_info">6</td>
                            <td class="slot_info">7</td>
                            <td class="slot_info">8</td>
                            <td class="slot_info">9</td>
                        </tr><tr>
                            <td class="slot_info">Count</td>
                            <td class="slot_info" id="slot_1">0</td>
                            <td class="slot_info" id="slot_2">0</td>
                            <td class="slot_info" id="slot_3">0</td>
                            <td class="slot_info" id="slot_4">0</td>
                            <td class="slot_info" id="slot_5">0</td>
                            <td class="slot_info" id="slot_6">0</td>
                            <td class="slot_info" id="slot_7">0</td>
                            <td class="slot_info" id="slot_8">0</td>
                            <td class="slot_info" id="slot_9">0</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>`
    ;

    // counter section
    const counters = `<div id="counter_list" class="counter_list" open></div>`;

    // list of book spells
    const book_list = `<div id="book_list">
        <svg viewbox="0 0 10 10" class="loading_svg"><path fill="rgb(90,90,90)" d="M 4.5 1.5 Q 4.5 1 5 1 Q 5.5 1 5.5 1.5 L 5.5 2.5 Q 5.5 3 5 3 Q 4.5 3 4.5 2.5 Z"/><path fill="rgb(102,102,102)" d="M 7.183 2.2189 Q 7.433 1.7859 7 1.536 Q 6.567 1.2861 6.317 1.7171 L 5.817 2.5851 Q 5.567 3.0181 6 3.268 Q 6.433 3.518 6.683 3.0849 Z"/><path fill="rgb(114,114,114)" d="M 8.281 3.684 Q 8.714 3.434 8.464 3 Q 8.214 2.568 7.781 2.818 L 6.915 3.318 Q 6.482 3.568 6.732 4 Q 6.982 4.434 7.415 4.184 Z"/><path fill="rgb(126,126,126)" d="M 8.5 4.5 Q 9 4.5 9 5 Q 9 5.5 8.5 5.5 L 7.5 5.5 Q 7 5.5 7 5 Q 7 4.5 7.5 4.5 Z"/><path fill="rgb(138,138,138)" d="M 7.416 5.816 Q 6.983 5.567 6.733 6 Q 6.483 6.433 6.916 6.682 L 7.782 7.182 Q 8.215 7.432 8.464 7 Q 8.715 6.566 8.282 6.316 Z"/><path fill="rgb(150,150,150)" d="M 6.317 8.281 Q 6.567 8.714 7 8.464 Q 7.433 8.214 7.183 7.781 L 6.683 6.915 Q 6.433 6.482 6 6.732 Q 5.567 6.982 5.817 7.415 Z"/><path fill="rgb(162,162,162)" d="M 5.5 8.5 Q 5.5 9 5 9 Q 4.5 9 4.5 8.5 L 4.5 7.5 Q 4.5 7 5 7 Q 5.5 7 5.5 7.5 Z"/><path fill="rgb(174,174,174)" d="M 2.817 7.781 Q 2.567 8.214 3 8.464 Q 3.433 8.714 3.683 8.281 L 4.183 7.415 Q 4.433 6.982 4 6.732 Q 3.567 6.482 3.317 6.925 Z"/><path fill="rgb(186,186,186)" d="M 1.719 6.316 Q 1.286 6.566 1.536 7 Q 1.786 7.432 2.219 7.182 L 3.085 6.682 Q 3.518 6.432 3.268 6 Q 3.018 5.566 2.585 5.816 Z"/><path fill="rgb(198,198,198)" d="M 1.5 5.5 Q 1 5.5 1 5 Q 1 4.5 1.5 4.5 L 2.5 4.5 Q 3 4.5 3 5 Q 3 5.5 2.5 5.5 Z"/><path fill="rgb(210,210,210)" d="M 2.219 2.818 Q 1.786 2.568 1.536 3.0012 Q 1.286 3.434 1.719 3.684 L 2.585 4.184 Q 3.0183 4.434 3.286 4 Q 3.518 3.568 3.0845 3.318 Z"/><path fill="rgb(222,222,222)" d="M 3.683 1.719 Q 3.433 1.286 3 1.586 Q 2.567 1.786 2.817 2.219 L 3.317 3.085 Q 3.567 3.518 4 3.268 Q 4.433 3.0181 4.183 2.585 Z"/></svg>
    </div>`;

    // bottom spacer
    const spacer = `
        <div class="bottom_spacer"></div>`
    ;

    // edit button
    const edit_button = `
        <div class="square_button edit_characters hover_transparency button" onclick="toggle_screen('edit_menu');">
            <svg class="edit_icon" viewBox="0 0 6 6">
                <path class="edit_icon" d="M 0 6 L 0.5 5.167 L 0.66 5.22 L 0.78 5.34 L 0.833 5.5 Z M 0.8425 5.2875 L 0.7125 5.1575 L 0.54 5.1 L 1 4.334 L 1 4.556 L 1.222 4.556 L 1.222 4.778 L 1.444 4.778 L 1.444 5 L 1.666 5 L 0.9 5.46 Z M 1.728 4.942 L 1.51 4.942 L 1.51 4.778 L 4.522 1.755 A 0.75 1 270 0 1 4.45 2.222 Z M 1.4797 4.7203 L 1.2797 4.7203 L 1.2797 4.5203 L 4.295 1.499 A 0.4 0.4 270 0 1 4.495 1.699 Z M 1.222 4.49 L 1.0577 4.49 L 1.0577 4.2763 L 3.778 1.55 A 2 1 270 0 1 4.245 1.478 Z M 4.535 2.142 A 0.5 0.5 270 0 0 3.858 1.465 L 4.363 0.97 A 0.5 0.5 270 0 1 5.03 1.637 Z M 5.119 1.556 A 0.55 0.55 270 0 0 4.444 0.881 L 4.949 0.376 A 0.55 0.55 270 0 1 5.624 1.051 Z"/>
            </svg>
        </div>`
    ;

    // edit options screen
    const edit_screen = `
        <div id="edit_menu" class="screen_back mobile_menu_container hidden" onclick="close_screen('edit_menu');">
            <div class="menu_container" onclick="event.stopPropagation();">
                <div id="rename" class="menu_button" style="height: calc(var(--tlrg) + 1rem);">
                    <div class="character_button button" onclick="toggle_character_button('rename');"></div>
                    <p class="menu_button filter_title">Rename Character</p>
                    <div class="input_container">
                        <input id="rename_character" class="name_character" placeholder="New Name">
                        <svg class="checkbox button" viewBox="-1 -1 9 7.5" onclick="rename_character();">
                            <path class="checkbox" d="m 0 4 l 3 2 l 4 -6"/>
                        </svg>
                    </div>
                </div>

                <div id="add_new" class="menu_button" style="height: calc(var(--tlrg) + 1rem);">
                    <div class="character_button button" onclick="toggle_character_button('add_new');"></div>
                    <p class="menu_button filter_title">Add New Character</p>
                    <div class="input_container">
                        <input id="add_new_character" class="name_character" placeholder="New Name">
                        <svg class="checkbox button" viewBox="-1 -1 9 7.5" onclick="add_new_character();">
                            <path class="checkbox" d="m 0 4 l 3 2 l 4 -6"/>
                        </svg>
                    </div>
                </div>

                <div id="delete" class="menu_button" style="height: calc(var(--tlrg) + 1rem);">
                    <div class="character_button button" onclick="toggle_character_button('delete');"></div>
                    <p class="menu_button filter_title">Delete Active Character</p>
                    <p class="delete_text">Are you sure? This action cannot be undone.</p>
                    <div class="input_container">
                        <p class="delete_text" style="max-width: calc(100% - 4.3rem - 6px);">
                            Press the check twice to confirm.</p>
                        <svg class="checkbox button delete_button" viewBox="-1 -1 9 7.5" onclick="delete_active_character();">
                            <path class="checkbox" d="m 0 4 l 3 2 l 4 -6"/>
                        </svg>
                    </div>
                </div>
            </div>

            <div style="height: 3rem;"></div>

            <div class="menu_container" onclick="event.stopPropagation();">
                <div id="edit_counter" class="menu_button" style="height: calc(var(--tlrg) + 1rem);">
                    <div class="character_button button" onclick="toggle_character_button('edit_counter');"></div>
                    <p class="menu_button filter_title">Edit Counter</p>
                    <select id="edit_counter_select" class="counter_select"></select>
                    <input id="edit_counter_name" class="counter_name_input" placeholder="Counter Name">
                    <div class="row_container" style="margin: 0 auto 0.5rem;">
                        <p class="counter_num_text">Max Value: </p>
                        <input id="edit_counter_max" class="counter_num_input" placeholder="5" type="number" min="0"
                            max="99" oninput="clamp_counter_max('edit_counter_max');">
                        <svg class="checkbox button" viewBox="-1 -1 9 7.5" onkeypress=
                            "if (event.key == ' ' || event.key == 'Enter') edit_counter();" onclick="edit_counter();"
                            tabindex="0">
                            <path class="checkbox" d="m 0 4 l 3 2 l 4 -6"/>
                        </svg>
                    </div>
                </div>

                <div id="new_counter" class="menu_button" style="height: calc(var(--tlrg) + 1rem);">
                    <div class="character_button button" onclick="toggle_character_button('new_counter');"></div>
                    <p class="menu_button filter_title">Add New Counter</p>
                    <input id="add_counter_name" class="counter_name_input" placeholder="Counter Name">
                    <div class="row_container" style="margin: 0 auto 0.5rem;">
                        <p class="counter_num_text">Max Value: </p>
                        <input id="add_counter_max" class="counter_num_input" placeholder="5" type="number" min="0"
                            max="99" oninput="clamp_counter_max('add_counter_max');">
                        <svg class="checkbox button" viewBox="-1 -1 9 7.5" onkeypress=
                            "if (event.key == ' ' || event.key == 'Enter') add_counter();" onclick="add_counter();"
                            tabindex="0">
                            <path class="checkbox" d="m 0 4 l 3 2 l 4 -6"/>
                        </svg>
                    </div>
                </div>

                <div id="delete_counter" class="menu_button" style="height: calc(var(--tlrg) + 1rem);">
                    <div class="character_button button" onclick="toggle_character_button('delete_counter');"></div>
                    <p class="menu_button filter_title">Delete Counter</p>
                    <select id="delete_counter_select" class="counter_select"></select>
                    <p class="delete_text">Are you sure? This action cannot be undone.</p>
                    <div class="input_container">
                        <p class="delete_text" style="max-width: calc(100% - 4.3rem - 6px);">
                            Press the check twice to confirm.</p>
                        <svg class="checkbox button delete_button" viewBox="-1 -1 9 7.5" onclick="delete_counter();">
                            <path class="checkbox" d="m 0 4 l 3 2 l 4 -6"/>
                        </svg>
                    </div>
                </div>
            </div>
        </div>
    `
    ;

    const spell_body = start_header + spellbook_name + class_and_level + spell_slot_table + "</div>" + counters
                       + book_list + spacer + edit_button + edit_screen;

    // set the HTML body
    document.body.innerHTML += spell_body;

    // create list of classes
    create_class_list();

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

// character menu
    // add Enter key detection in rename character text box
    document.getElementById("rename_character").addEventListener("keyup", function(event) {
        if (event.key === "Enter") {
            rename_character();
        }
    });

    // add Enter key detection in add new character text box
    document.getElementById("add_new_character").addEventListener("keyup", function(event) {
        if (event.key === "Enter") {
            add_new_character();
        }
    });

    // add Enter key detection in add new counter text boxes
    document.getElementById("add_counter_name").addEventListener("keyup", function(event) {
        if (event.key === "Enter") {
            add_counter();
        }
    });
    document.getElementById("add_counter_max").addEventListener("keyup", function(event) {
        if (event.key === "Enter") {
            add_counter();
        }
    });

    // add Enter key detection in edit counter text boxes
    document.getElementById("edit_counter_name").addEventListener("keyup", function(event) {
        if (event.key === "Enter") {
            edit_counter();
        }
    });
    document.getElementById("edit_counter_max").addEventListener("keyup", function(event) {
        if (event.key === "Enter") {
            edit_counter();
        }
    });
}