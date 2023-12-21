// db query
function gather_spells() {
    if (window.location.href.startsWith('http://127.0.0.1:8000/')) {
        url = 'http://127.0.0.1:8000/spells';
        loc = 'l';
    } else {
        url = 'https://qf5278sx80.execute-api.us-east-1.amazonaws.com/default/filter-spells';
        loc = 's';
    }

    make_HTTP_post_request(url, handle_spells_response);
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
    // db spell data
    const spells = JSON.parse(response.srcElement.response)["spells"];

    // for each spell, create spell object and add to spell list
    for (var spell of spells){
        spell_list.push(new Spell(spell));
    }

    // copy the spells to filtered_spells
    filtered_spells = spell_list.slice();

    // do anything spell related
    perform_spell_operations();
}

// do anything spell related
function perform_spell_operations() {
    // create filters from data
    gather_filter_options();

    // if on list page, sort then filter spells and populate the filter menu
    if (page == "list") {
        sort_spells();
        filter_spells();
        create_filters();
    } else {
        create_class_list();
    }
}