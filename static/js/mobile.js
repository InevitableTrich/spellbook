function toggle_spell(id) {
    var container = document.getElementById(id)
    var body = container.parentElement.children[2].children[0]
    var bottom = container.parentElement.children[3]

    if (body.getAttribute("collapsed") == "true") {
        setTimeout(function(){
            document.getElementById("book_btn_" + id).classList.toggle("invis")
            setTimeout(function(){
                document.getElementById("book_btn_" + id).classList.toggle("add_book_hidden")
            }, 20);
        }, 300);
        toggle_head(id)
        collapse(body)
        bottom.classList.toggle("spell_bottom_exp")
    } else {
        document.getElementById("book_btn_" + id).classList.toggle("add_book_hidden")
        setTimeout(function(){
            document.getElementById("book_btn_" + id).classList.toggle("invis")
            toggle_head(id)
            collapse(body)
            bottom.classList.toggle("spell_bottom_exp")
        }, 200);
    }
}

function toggle_head(id) {
    var container = document.getElementById(id)
    var name = container.children[0]
    var level = container.children[1]
    var classes = container.children[2]

    name.classList.toggle("vis")
    level.classList.toggle("invis")
    classes.classList.toggle("invis")
}

function clrESO(){
    divs = document.querySelectorAll("div.sortSelected")
    divs.forEach(element => {
        element.classList.remove('sortSelected')
    });

    ps = document.querySelectorAll("p.sortSelectedTxt")
    ps.forEach(element => {
        element.classList.remove('sortSelectedTxt')
    });

    document.querySelector("#subs_con").innerHTML = `<p id="subs" class="ciTxt" style="margin-bottom: 12px;">Select a Class for available Subclasses to appear.</p>`
    for([key] of Object.entries(subs)){
        subs[key][0] = false
    }
    subs_list = []

    filters = ["class", "level", "school", "source", "subclass", "action", "concentration", "ritual"]
    filters.forEach(id => {
        if (document.querySelector("#" + id + "_ops").getAttribute('collapsed') === 'false') {
            CycleList(id)
        }
    });

    currentFilter = JSON.stringify({"filter": {}})
    filterState = {}

    searchBar = document.getElementById('search')
    searchBar.value = ""
    searchQuery = ''
    resetPage()
    makeFilterRequest('nameSort', 0, currentFilter)
}

function populateSpells(jsonResponse) {
    var data = JSON.parse(jsonResponse.srcElement.response)
    spells = document.getElementById("spellList")
    spells.innerHTML = ''
    spellCount = data.spellscount
    maxPages = Math.ceil(spellCount/spellsPerPage)
    data.spells.forEach(spell => {
        var spellBody = spellFormatBody(spell)
        var spellHigher = spellFormatHigher(spell.higher_level)

        spells.innerHTML +=`
<div id="${spell.spellid}">
    <div class="h20"></div>
    <div class="spell_head_container" id="${spell.spellid}_cr" onclick="toggle_spell(id)" collapsed="false">
        <p class="spell_head_text head_name overflow">${spell.name}</p>
        <p class="spell_head_text head_level">${spell.level}</p>
        <p class="spell_head_text head_class overflow">${spell.classes[0] ? spell.subclasses ? spell.classes.sort().join(", ") + ", " + spell.subclasses.sort().join(", ") : spell.classes.sort().join(", ") : spell.subclasses.sort().join(", ")}</p>
        <p id="${spell.spellid}_head3" class="spell_head_text" style="margin: auto;" onclick="checkBookStatus('${spell.spellid}'); event.stopPropagation()">${spellbook.indexOf(spell.spellid) != -1 ? "Quick Remove" : "Quick Add"}</p>
    </div>

    <div class="rowContainer">
        <div class="spell_body" style="height: 0px" id="${spell.spellid+'_body'}" collapsed="true">
            <br>
            <p class="spellDispDescExp" style="margin-top: -4px;"><b>Level:</b> ${spell.level}</p>
            <p class="spellDispDescExp"><b>School:</b> ${spell.school}</p>
            <p class="spellDispDescExp"><b>Casting Time:</b> ${spell.cast_time}</p>
            <p class="spellDispDescExp"><b>Range:</b> ${spell.range}</p>
            <p class="spellDispDescExp"><b>Components:</b> ${spell.components.join(", ")} ${spell.material != "" ? '('+ spell.material + ')' : ''}</p>
            <p class="spellDispDescExp"><b>Duration:</b> ${spell.concentration == true ? "Concentration, " : ""} ${spell.duration}</p>
            <p class="spellDispDescExp">${spell.ritual == true ? "<b>Ritual:</b> Yes" : ""}</p>
            <p class="spellDispDescExp">${spell.classes[0] ? "<b>Classes:</b> " + spell.classes.sort().join(", ") : ""}</p>
            <p class="spellDispDescExp">${spell.subclasses ? "<b>Subclasses:</b> " + spell.subclasses.sort().join(", ") : ""}</p>
            ${spellBody}
            <p class="spellDispDescExp">${spellHigher}</p>
            <p class="spellDispDescExp">${spell.source.length > 2 ? "<b>Source:</b> " + spell.source : "<b>Sources:</b> " + spell.source.join(", ")}</p>
        </div>

        <div class="spellToBook clickable invis add_book_hidden" id="book_btn_${spell.spellid}_cr" onClick="checkBookStatus('${spell.spellid}_cr')">
            <p class="textToBook">${spellbook.indexOf(spell.spellid) != -1 ? "Remove from Spellbook" : "Add to Spellbook"}</p>
        </div>
    </div>

    <div class="spell_bottom" onclick="toggle_spell(\'${spell.spellid + '_cr'}\')">
        <p class="spell_head_text">${spell.name}</p>
    </div>
</div>`
    })
}

function addToBook(id) {
    // check for settings and abort
    if (spellChar == 4) return

    if (id.endsWith("_cr")) {
        id = id.slice(0,id.indexOf("_cr"))
    }

    var btn = document.getElementById("book_btn_" + id + "_cr")
    var btn_char = btn.children[0]

    if (spellbook.indexOf(id) == -1) {
        spellbook.push(id)
        btn_char.innerHTML = "Remove from Spellbook"
        document.getElementById(id+"_head3").innerHTML = "Quick Remove"
    } else {
        spellbook.splice(spellbook.indexOf(id), 1)
        btn_char.innerHTML = "Add to Spellbook"
        document.getElementById(id+"_head3").innerHTML = "Quick Add"
    }

    updateBook()

    if (spellbook.length == 0) {
        popEmptySpellbook()
    } else {
        makeBookRequest(spellbook)
    }
}

function remove_from_book(id) {
    // check for settings and abort
    if (spellChar == 4) return

    if (id.indexOf("_") != -1) {
        id = id.slice(0, id.indexOf("_"))
    }

    try {
        var btn_char = document.getElementById("book_btn_" + id + "_cr").children[0]
        btn_char.innerHTML = "Add to Spellbook"
        document.getElementById(id+"_head3").innerHTML = "Quick Add"
    } catch(e) {}

    spellbook.splice(spellbook.indexOf(id), 1)
    if (preplist.indexOf(id) != -1){
        preplist.splice(preplist.indexOf(id), 1)
    }

    updateBook()

    if (spellbook.length == 0) {
        popEmptySpellbook()
    } else {
        // remove spell
        var book_spell = document.getElementById(id + '_bk_' + spellChar)  // spell
        var prep_book_cntnr = book_spell.parentElement  // spell+prep
        var lvl_cntnr = prep_book_cntnr.parentElement  // level container
        var ndx = [...lvl_cntnr.children].indexOf(prep_book_cntnr) // index of spell
        lvl_cntnr.children[ndx+1].remove()  // remove spacer
        prep_book_cntnr.remove()  // remove spell

        // check for empty spell container
        if (lvl_cntnr.childElementCount == 0) {
            var book_container = lvl_cntnr.parentElement  // book container
            ndx = [...book_container.children].indexOf(lvl_cntnr)  // index of level container
            book_container.children[ndx-1].remove()  // remove header
            lvl_cntnr.remove()  // remove container
        }
    }
}

function updateButtons() {
    var buttons = [...document.getElementsByClassName("spellToBook")]
    buttons.forEach(button => {
        var target = button.children[0]
        var btn_id = button.id.slice(9,button.id.indexOf("_cr"))
        if (spellbook.indexOf(btn_id) == -1) {
            target.innerHTML = "Add to Spellbook"
        } else {
            target.innerHTML = "Remove from Spellbook"
        }
    })
}