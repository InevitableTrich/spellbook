var spell_collector = {
    "calls_needed": 0,
    "calls_completed": 0,
    "done": false
}

// db query
function gather_spells(index) {
    var url;

    if (window.location.href.startsWith("http://127.0.0.1:8000/")) {
        url = "http://127.0.0.1:8000/spells";
    } else {
        url = "https://qkb8erhv2e.execute-api.us-east-1.amazonaws.com/main/get-spells";
    }

    if (index == -1) {
        make_HTTP_post_request(url + "?init=1", handle_spells_response);
    } else {
        make_HTTP_post_request(url + "?index=" + index, handle_spells_response);
    }
}

// make an http req
function make_HTTP_post_request(url, callback) {
    objXMLHttp = new XMLHttpRequest();
    objXMLHttp.onreadystatechange = callback;
    objXMLHttp.open("POST", url);
    objXMLHttp.setRequestHeader("Content-Type", "application/json");
    objXMLHttp.send();
}

// on http response, collect spells
function handle_spells_response(data) {
    if (this.readyState == 4 && this.status == 200){
        collect_spells(data);
    }
}

// process spells from db query
function collect_spells(response) {
    // response data
    const data = JSON.parse(response.srcElement.response);

    // db spell data
    const spells = data["spells"] || [];
    const total_spells = data["spell_count"] || -1;

    // if total_spells is not -1, send calls for remaining spells
    if (total_spells != -1) {
        // calculate the number of calls needed
        const num_calls = Math.ceil(total_spells / 30);
        spell_collector['calls_needed'] = num_calls;

        for (var i = 0; i < num_calls; i++) {
            gather_spells(i);
        }

        // dont proceed on spells, as they are not gathered here
        return;
    }

    // track a completed spell collection call
    spell_collector['calls_completed']++
    if (spell_collector['calls_completed'] == spell_collector['calls_needed']) {
        spell_collector['done'] = true;
    }

    // for each spell, create spell object and add to spell list
    for (var spell of spells){
        spell_list.push(new Spell(spell));
    }

    // sort the spells into index form
    spell_list = spell_list.sort((a, b) => {
        if (a.index > b.index) {
            return 1;
        } else {
            return -1;
        }
    })

    // copy the spells to filtered_spells
    filtered_spells = spell_list.slice();

    // do anything spell related
    perform_spell_operations();
}

// do anything spell related
function perform_spell_operations() {
    // create filters from data
    gather_filter_options();

    // check character loading. if data needed converting, characters may not be loaded
    try {
        if (load_characters_needed) {
            load_characters();
        }
    } catch (e) {
        handle_data_error();
    }

    // if on list page, sort then filter spells and populate the filter menu
    if (page == "list") {
        sort_spells();
        filter_spells();
        create_filters();
    } else {
    // if on book page, create class options and set character
        create_class_list();
        set_character(active_character);
    }
}