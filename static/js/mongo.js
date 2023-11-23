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

function make_HTTP_post_request(url, callback) {
    objXMLHttp = new XMLHttpRequest();
    objXMLHttp.onreadystatechange = callback;
    objXMLHttp.open("POST", url);
    objXMLHttp.setRequestHeader("Content-Type", "application/json");
    objXMLHttp.send();
}

function handle_spells_response(data) {
    if (this.readyState == 4 && this.status == 200){
        collect_spells(data);
    }
}

function collect_spells(response) {
    const spells = JSON.parse(response.srcElement.response)["spells"];

    spells.forEach(spell => {
        spell_list.push(new Spell(spell));
    });

    filtered_spells = spell_list.slice();
    sort_spells(filtered_spells);

    perform_spell_operations();
}

function perform_spell_operations() {
    gather_filter_options();
    filter_spells();
}