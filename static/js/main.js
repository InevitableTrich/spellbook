var localhost = 'http://127.0.0.1:8000/filter'
var currenturl = 'https://qf5278sx80.execute-api.us-east-1.amazonaws.com/default/filter-spells'
var settings = false
var accountView = false
var curPage = 1
var maxPages = 0
var spellsPerPage = 30
var spellHeight = 52
var spellCount = 0
var filterState = {}
var currentFilter = JSON.stringify({"filter": {}})
var searchQuery = ''
var sortState = {
  0: '-',
  1: '▼',
  2: '▲',
  "nameSort": "Spell Name: ",
  "levelSort": "Spell Level: ",
  "classSort": "Classes: ",
  "schoolSort": "School: ",
}
var varCycle = {
  "nameSort": 0,
  "levelSort": 0,
  "classSort": 0,
  "schoolSort": 0,
}
var spellbook = []

function toggleSpellView(cName) {
    var current = document.querySelector("#" + cName + "_body")

    if (current.getAttribute("collapsed") === 'true') {
        setTimeout(function(){
            document.getElementById("book_btn_" + cName).classList.toggle("invis")
            setTimeout(function(){
                document.getElementById("book_btn_" + cName).classList.toggle("add_book_hidden")
            }, 20);
        }, 300);
        toggleViewMain(cName, current)
    } else {
        document.getElementById("book_btn_" + cName).classList.toggle("add_book_hidden")
        setTimeout(function(){
            document.getElementById("book_btn_" + cName).classList.toggle("invis")
            toggleViewMain(cName, current)
        }, 200);
    }
}
function toggleViewMain(cName, current) {
    collapse(current)
    suffix = ["head0", "head1", "head2", "head3", "bottom", "tarrow", "barrow"]
    rclass = ["widen", "invis", "invis", "invis", "bottom_exp", "rot-right", "rot-left"]
    for (var i = 0; i < suffix.length; i++) {
        current = document.querySelector('#' + cName + "_" + suffix[i]);
        current.classList.toggle(rclass[i])
    }
}

function toggleBookSpellView(cName) {
    var current = document.querySelector("#" + cName + "_body")

    if (current.getAttribute("collapsed") === 'true') {
        setTimeout(function(){
            document.getElementById("book_btn_" + cName + "_bk").classList.toggle("invis")
            setTimeout(function(){
                document.getElementById("book_btn_" + cName + "_bk").classList.toggle("add_book_hidden_book")
            }, 20);
        }, 300);
        toggleViewBook(current, cName)
    } else {
        document.getElementById("book_btn_" + cName + "_bk").classList.toggle("add_book_hidden_book")
        setTimeout(function(){
            document.getElementById("book_btn_" + cName + "_bk").classList.toggle("invis")
            toggleViewBook(current, cName)
        }, 200);
    }
}
function toggleViewBook(current, cName){
    collapse(current)
    suffix = ["bottom", "tarrow", "barrow", "action", "conc", "ritual", "name"]
    rclass = ["book_bottom_exp", "rot-right", "rot-left", "invis", "invis", "invis", "book_widen"]
    for (var i = 0; i < suffix.length; i++) {
        current = document.querySelector("#" + cName + "_" + suffix[i])
        current.classList.toggle(rclass[i])
    }
}

function collapse(element) {
    var isCollapsed = element.getAttribute('collapsed') === 'true';
    if(isCollapsed) {
        expandSection(element)
        element.setAttribute('collapsed', 'false')
    } else {
        collapseSection(element)
    }
}

function collapseSection(element) {
    var sectionHeight = element.scrollHeight;
    var elementTransition = element.style.transition;
    element.style.transition = '';
    requestAnimationFrame(function() {
        element.style.height = sectionHeight + 'px';
        element.style.transition = elementTransition;
        requestAnimationFrame(function() {
            element.style.height = 0 + 'px';
        });
    });
    element.setAttribute('collapsed', 'true');
}

function expandSection(element) {
    var sectionHeight = element.scrollHeight;
    element.style.height = sectionHeight + 'px';

    element.addEventListener('transitionend', function(e) {
        element.removeEventListener('transitionend', arguments.callee);
        element.style.height = null;
    });

    element.setAttribute('collapsed', 'false');
}

function cycleSort(id){
    varCycle[id] += 1
    if (varCycle[id] > 2) varCycle[id] = 0
    document.getElementById(id).innerHTML = sortState[id] +
    sortState[varCycle[id]]

    if (varCycle[id] == 0) {
        makeFilterRequest('nameSort', 0, currentFilter)
    } else {
        makeFilterRequest(id, varCycle[id], currentFilter)
    }

    for([key] of Object.entries(varCycle)){
        if (key != id){
            varCycle[key] = 0
            document.getElementById(key).innerHTML = sortState[key] +
            sortState[varCycle[key]]
        }
    }
}

function pageChange(inc) {
    curPage += inc
    if (curPage < 1) curPage = maxPages
    if (maxPages == 0) curPage = 1
    if (curPage > maxPages) curPage = 1
    document.getElementById("pageTxt").innerHTML = "Page " + curPage
    document.getElementById("spellList").innerHTML = '<img src="/static/images/loading.gif" alt="Loading" width="3%" height="3%" style="display: block; margin: 20px auto 0 auto;" rel="import">'
    sort = findSort()
    makeFilterRequest(sort, varCycle[sort], currentFilter)
}

function resetPage() {
    pageOne()
    sort = findSort()
    makeFilterRequest(sort, varCycle[sort], currentFilter)
}

function pageOne() {
    curPage = 1
    document.getElementById("pageTxt").innerHTML = "Page " + curPage
    scrollToTop()
}

function scrollToTop() {
    window.scrollBy({top: -(window.scrollY), left: 0, behavior: 'smooth'})
}

function toggleSettings(close=false){
    if (close) {
        document.getElementById("setCon").classList.add('blank')
        settings = false
        loadSettings()
        return
    }
    if (settings) {
        document.getElementById("setCon").classList.add('blank')
        settings = false
    }
    else if (settings == false){
        document.getElementById("setCon").classList.remove('blank')
        settings = true
    }
    loadSettings()
}
function loadSettings(){
    document.getElementById("perPageNum").innerHTML = "Spells Per Page: " + spellsPerPage
    document.getElementById("perPage").value = spellsPerPage
    document.getElementById("spellHeightNum").innerHTML = "Spell Height: " + spellHeight + "px"
    document.getElementById("spellHeight").value = spellHeight
}
function updateSettings(id){
    idNum = id + "Num"
    slider = document.getElementById(id)
    num = document.getElementById(idNum)
    preText = ""
    postText = ""

    if (id == "perPage") {
        preText = "Spells Per Page: "
        postText = ""
    } else if (id == "spellHeight") {
        preText = "Spell Height: "
        postText = "px"
    }
    num.innerHTML = preText + slider.value + postText
}
function updatePreview() {
    document.getElementById('previewSpell').style.height = parseInt(document.getElementById("spellHeight").value) + "px"
}
function saveSettings(){
    if (spellsPerPage == parseInt(document.getElementById("perPage").value)) {
        changed = false
    } else {
        changed = true
    }
    spellsPerPage = parseInt(document.getElementById("perPage").value)
    spellHeight = parseInt(document.getElementById("spellHeight").value)
    sheet = document.styleSheets[0]
    sheet.deleteRule(0)
    sheet.insertRule(".spellHeight {height: " + spellHeight + "px;}", 0)
    sheet.deleteRule(1)
    sheet.insertRule(".bottom_margin {margin-top: -" + (spellHeight+3) + "px;}", 1)
    if (changed) resetPage()
    toggleSettings()
}

document.addEventListener('keydown', function(event) {
    if(event.key == 'Escape') {
        toggleSettings(close=true)
        toggleBook(close=true)
    }
});

function toggleBook(close=false) {
    if (close) {
        document.getElementById("bookCon").classList.add('invis')
        return
    }
    document.getElementById("bookCon").classList.toggle('invis')
}

function search(query){
    if (query != "") searchQuery = "\"" + query + "\""
    else searchQuery = ""
    sort = findSort()
    resetPage()
    makeFilterRequest(sort, varCycle[sort], currentFilter)
}

function sortToggle(id, field){
    filterKey = getFilterIDs(id, field)

    if (filterState[field]) {
        if (filterState[field].includes(filterKey)) {
            var index = filterState[field].indexOf(filterKey)
            if (index !== -1) {
              filterState[field].splice(index, 1);
            }
            if (filterState[field].length == 0) {
              delete filterState[field]
            }
        } else {
            filterState[field].push(filterKey)
        }
    } else {
        filterState[field] = [filterKey]
    }
    currentFilter = "{\"filter\": " + JSON.stringify(filterState) + "}"

    toggle = document.getElementById(id)
    toggle.classList.toggle("sortSelected")
    toggle = document.getElementById("_" + id)
    toggle.classList.toggle("sortSelectedTxt")

    if (field == "classes") {
        getSubs(id)
    }

    pageOne()
    sort = findSort()
    makeFilterRequest(sort, varCycle[sort], currentFilter)
}

function getFilterIDs(id, field) {
    var tID = null

    if (field == "classes" || field == "school") {
        tID = id.charAt(0).toUpperCase() + id.slice(1)
    } else if (field == "level") {
        tID = id.slice(1)
    } else if (field == "subs") {
        tID = id.charAt(0).toUpperCase() + id.slice(1)
        while (tID.indexOf("_") != -1) {
            var ndx = tID.indexOf("_")
            tID = tID.slice(0,ndx+1) + tID.charAt(ndx+1).toUpperCase() + tID.slice(ndx+2)
            tID = tID.replace("_", " ")
        }
        tID = tID.replace(" ", " (") + ")"
    } else if (field == "concentration" || field == "ritual") {
        if (id.startsWith("not")) {
            tID = false
        } else {
            tID = true
        }
    } else if (field == "cast_time") {
        if (id == "ten_minute") {
            tID = "10 minutes"
        } else {
            tID = "1 " + id.replace("_", " ")
            tID = tID.replace("  ", " ")
        }
    } else if (field == "source") {
        var sources = {
            "phb": "Players Handbook",
            "xgte": "Xanathar's Guide to Everything",
            "eepc": "Elemental Evil Player's Companion",
            "acqinc": "Acquisitions Incorporated",
            "tcoe": "Tasha's Cauldron of Everything",
            "scag": "Sword Coast Adventurer's Guide",
            "egtw": "Explorer's Guide to Wildemount"
        }
        tID = sources[id]
    } else {
        console.log("Key Error in Filters")
    }

    return tID
}

function findSort(){
    for([key] of Object.entries(varCycle)){
        if (varCycle[key] != 0) return key
    }
    return 'nameSort'
}

var subs = {
    "artificer": [false, ["alchemist", "armorer", "artillerist", "battle smith"]],

    "bard": [false, ["glamour"]],

    "cleric": [false, ["arcana", "death", "forge", "grave", "knowledge", "life", "light", "nature", "order", "peace",
        "trickery", "twilight", "war"]],

    "druid": [false, ["arctic", "coast", "desert", "forest", "mountain", "spores", "stars", "swamp", "underdark",
        "wildfire"]],

    "monk": [false, ["four elements", "shadow", "sun soul"]],

    "paladin": [false, ["ancients", "conquest", "crown", "devotion", "glory", "oathbreaker", "redemption", "vengeance",
        "watchers"]],

    "ranger": [false, ["fey wanderer", "gloom stalker", "horizon walker", "monster slayer", "swarmkeeper"]],

    "sorcerer": [false, ["aberrant mind", "clockwork soul", "divine soul"]],

    "warlock": [false, ["archfey", "celestial", "fathomless", "fiend", "genie - djinni", "genie - efreeti", "genie - marid",
        "great old one", "hexblade", "undying"]],

    "wizard": [false, ["chronurgy", "graviturgy"]]
}
var subs_list = []

function getSubs(class_name) {
    clearSubs(class_name)
    var up_class = class_name.charAt(0).toUpperCase() + class_name.slice(1)
    if (subs[class_name][0] === false) {
        subs[class_name][1].forEach(sub => {
            var ssub = sub.replaceAll(" ", "_")
            var id = `${class_name}_${ssub}`
            var up_sub = sub.split(" ").map(function(word){return word[0].toUpperCase() + word.substr(1)}).join(" ")
            subs_list.push(
                `<div class="rowContainer"><div class="classItem" id=${id} onclick="sortToggle(id, 'subs')"><p class="ciTxt" id=${`_${id}`}>${up_class} (${up_sub})</p></div>`
            )
        });
        subs[class_name][0] = true
    } else {
        subs[class_name][1].forEach(sub => {
            var ssub = sub.replaceAll(" ", "_")
            var id = `${class_name}_${ssub}`
            var up_sub = sub.split(" ").map(function(word){return word[0].toUpperCase() + word.substr(1)}).join(" ")
            ndx = subs_list.indexOf(
                `<div class="rowContainer"><div class="classItem" id=${id} onclick="sortToggle(id, 'subs')"><p class="ciTxt" id=${`_${id}`}>${up_class} (${up_sub})</p></div>`
            )
            subs_list = subs_list.slice(0,ndx).concat(subs_list.slice(ndx+1))
        });
        subs[class_name][0] = false
    }

    subs_list.sort()
    var subs_string = ""
    subs_string = subs_list.join('<p class="ciComma">,</p></div>') + "</div>"
    if (subs_list.length > 0) {
        document.querySelector("#subs_con").innerHTML = subs_string
    } else {
        document.querySelector("#subs_con").innerHTML = `<p id="subs" class="ciTxt" style="margin-bottom: 12px;">Select a Class for available Subclasses to appear.</p>`
    }
}

function clearSubs(class_name){
    delete filterState["subs"]
    currentFilter = "{\"filter\": " + JSON.stringify(filterState) + "}"
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

    for([key] of Object.entries(varCycle)){
        varCycle[key] = 0
        document.getElementById(key).innerHTML = sortState[key] +
        sortState[varCycle[key]]
    }

    searchBar = document.getElementById('search')
    searchBar.value = ""
    searchQuery = ''
    resetPage()
    makeFilterRequest('nameSort', 0, currentFilter)
}

function updateSpellSlots() {
    var classDef = {
        "artificer": "sub",
        "paladin": "sub",
        "ranger": "sub",
        "bard": "main",
        "cleric": "main",
        "druid": "main",
        "sorcerer": "main",
        "wizard": "main",
        "warlock": "warlock"
    }

    var spellSlots = {
        "sub": [[2], [2],  [3], [3], [4, 2], [4, 2], [4, 3], [4, 3], [4, 3, 2], [4, 3, 2], [4, 3, 3], [4, 3, 3], [4, 3, 3, 1], [4, 3, 3, 1], [4, 3, 3, 2], [4, 3, 3, 2], [4, 3, 3, 3, 1], [4, 3, 3, 3, 1], [4, 3, 3, 3, 2], [4, 3, 3, 3, 2]],
        "main": [[2], [3], [4, 2], [4, 3], [4, 3, 2], [4, 3, 3], [4, 3, 3, 1], [4, 3, 3, 2], [4, 3, 3, 3, 1], [4, 3, 3, 3, 2], [4, 3, 3, 3, 2, 1], [4, 3, 3, 3, 2, 1], [4, 3, 3, 3, 2, 1, 1], [4, 3, 3, 3, 2, 1, 1], [4, 3, 3, 3, 2, 1, 1, 1], [4, 3, 3, 3, 2, 1, 1, 1], [4, 3, 3, 3, 2, 1, 1, 1, 1], [4, 3, 3, 3, 3, 1, 1, 1, 1], [4, 3, 3, 3, 3, 2, 1, 1, 1], [4, 3, 3, 3, 3, 2, 2, 1, 1] ],
        "warlock": [[1], [2], [0, 2], [0, 2], [0, 0, 2], [0, 0, 2], [0, 0, 0, 2], [0, 0, 0, 2], [0, 0, 0, 0, 2], [0, 0, 0, 0, 2], [0, 0, 0, 0, 3], [0, 0, 0, 0, 3], [0, 0, 0, 0, 3], [0, 0, 0, 0, 3], [0, 0, 0, 0, 3], [0, 0, 0, 0, 3], [0, 0, 0, 0, 4], [0, 0, 0, 0, 4], [0, 0, 0, 0, 4], [0, 0, 0, 0, 4]]}


    var class_name = document.getElementById("classes").selectedOptions[0].value
    var lv = parseInt(document.getElementById("lvInput").value)

    if (!Number.isInteger(lv) || lv < 1) {
        document.getElementById("lvInput").value = 1
        lv = 1
    } else if (lv > 20) {
        document.getElementById("lvInput").value = 20
        lv = 20
    }

    var slot_list = spellSlots[classDef[class_name]][lv-1]

    while (slot_list.length < 9) {
        slot_list.push(0)
    }

    slot_list.forEach((amount, index) => {
        var level = index+1
        var lmnt = document.getElementById("slot_amt_" + level.toString())
        lmnt.innerHTML = amount
    })
}


function addToBook(id) {
    var container = document.getElementById("bookContainer")
    var spell = document.getElementById(id)
    var btn_char = document.getElementById("book_btn_" + id).children[0]

    if (spellbook.indexOf(id) == -1) {
        spellbook.push(id)
        btn_char.innerHTML = "Remove from Spellbook"
    } else {
        spellbook.splice(spellbook.indexOf(id), 1)
        btn_char.innerHTML = "Add to Spellbook"
    }

    updateCookie()

    if (spellbook.length == 0) {
        popEmptySpellbook()
    } else {
        makeBookRequest(spellbook)
    }
}

function remove_from_book(id) {
    id = id.slice(0, id.indexOf("_"))
    var container = document.getElementById("bookContainer")
    var spell = document.getElementById(id)
    var btn_char = document.getElementById("book_btn_" + id).children[0]

    spellbook.splice(spellbook.indexOf(id), 1)
    btn_char.innerHTML = "Add to Spellbook"

    updateCookie()

    if (spellbook.length == 0) {
        popEmptySpellbook()
    } else {
        makeBookRequest(spellbook)
    }
}

function makeBookRequest(book) {
    if (window.location.href == 'http://127.0.0.1:8000/') {
        url = 'http://127.0.0.1:8000/book-spells'
        loc = 'l'
    } else {
        url = 'https://oyioi0suah.execute-api.us-east-1.amazonaws.com/default/book-spells'
        loc = 's'
    }

    makeHTTPPostRequest(url, handleSpellbookResponse, JSON.stringify({"book": book,"loc": loc}))
}

function makeFilterRequest(fieldid, direction, filter){
    if (window.location.href == 'http://127.0.0.1:8000/') {
        url = localhost
        loc = 'l'
    } else {
        url = currenturl
        loc = 's'
    }

    makeHTTPPostRequest(url+'?pagenum='+curPage+'&spellsperpage='+spellsPerPage+'&field='+fieldid+'&direction='+direction+'&searchquery='+searchQuery+'&loc='+loc, handleSpellsResponse, filter);

}

function toggleFilter(){
    var top = document.querySelector('#ef_top')
    var text = document.querySelector('#ef_top p')
    var body = document.querySelector('#ef_body')
    isCollapsed = body.getAttribute('collapsed') === 'true';
    if (isCollapsed) {
        top.className = top.className.replace(' shrink', '')
        text.innerHTML = 'Shrink Filter Options'
        body.setAttribute('collapsed', 'false')
        expandSection(body)
    } else {
        top.className += ' shrink'
        text.innerHTML = 'Expand Filter Options'
        body.setAttribute('collapsed', 'true')
        collapseSection(body)
    }
    filters = ["class", "level", "school", "source", "subclass", "action", "concentration", "ritual"]
    filters.forEach(id => {
        if (document.querySelector("#" + id + "_ops").getAttribute('collapsed') === 'false') {
            CycleList(id)
        }
    });
}

function CycleList(dID){
    ops = dID + "_ops"
    var current = document.querySelector("#" + ops)
    collapse(current)
    var arrow = document.querySelector("#" + dID + "_arr")
    isCollapsed = arrow.getAttribute('collapsed') === 'true'
    if (!isCollapsed) {
        arrow.classList += " rot-right"
        arrow.setAttribute('collapsed', 'true')
    } else {
        arrow.classList.remove("rot-right")
        arrow.setAttribute('collapsed', 'false')
    }
}

function populateSpells(jsonResponse) { // ADD A PLUS BUTTON ON CLOSED SPELL
    var data = JSON.parse(jsonResponse.srcElement.response)
    spells = document.getElementById("spellList")
    spells.innerHTML = ''
    spellCount = data.spellscount
    maxPages = Math.ceil(spellCount/spellsPerPage)
    data.spells.forEach(spell => {
        spells.innerHTML +=`
<div id="${spell.spellid}">
    <div class="h20"></div>
    <div class="spellContainer" onClick="toggleSpellView('${spell.spellid}')" id="${spell.spellid+'_top'}">
        <div class="name spellHeight" id="${spell.spellid+'_head0'}">
            <p class="spellName overflow"> ${spell.name} - </p>
        </div>
        <div class="level spellHeight" id="${spell.spellid+'_head1'}">
            <p class="spellDispDesc overflow hCentered">${spell.level}</p>
        </div>
        <div class="classes spellHeight" id="${spell.spellid+'_head2'}">
            <p class="spellDispDesc overflow">${spell.classes[0] ? spell.subclasses ? spell.classes.sort().join(", ") + ", " + spell.subclasses.sort().join(", ") : spell.classes.sort().join(", ") : spell.subclasses.sort().join(", ")}</p>
        </div>
        <div class="school spellHeight" id="${spell.spellid+'_head3'}">
            <p class="spellDispDesc overflow">${spell.school}</p>
        </div>
        <div class="closeBtn spellHeight">
            <div id="${spell.spellid+'_tarrow'}" class="arrow">
                <svg class="arrow" style="margin: 0px;">
                    <polygon points="6,0 6,20 23.324,10" style="fill:white;stroke-width:3" />
                </svg>
            </div>
        </div>
    </div>
    <div class="rowContainer">
        <div class="body" style="height: 0px" id="${spell.spellid+'_body'}" collapsed="true">
            <br>
            <p class="spellDispDescExp" style="margin-top: -4px;">Level: ${spell.level}</p>
            <p class="spellDispDescExp">School: ${spell.school}</p>
            <p class="spellDispDescExp">Casting Time: ${spell.cast_time}</p>
            <p class="spellDispDescExp">Range: ${spell.range}</p>
            <p class="spellDispDescExp">Components: ${spell.components.join(", ")} ${spell.material != "" ? '('+ spell.material + ')' : ''}</p>
            <p class="spellDispDescExp">Duration: ${spell.concentration == true ? "Concentration, " : ""} ${spell.duration}</p>
            <p class="spellDispDescExp">${spell.ritual == true ? "Ritual: Yes" : ""}</p>
            <p class="spellDispDescExp">${spell.classes[0] ? "Classes: " + spell.classes.sort().join(", ") : ""}</p>
            <p class="spellDispDescExp">${spell.subclasses ? "Subclasses: " + spell.subclasses.sort().join(", ") : ""}</p>
            <p class="spellDispDescExp">${spell.desc.join("<BR/> &emsp;&emsp;")}</p>
            <p class="spellDispDescExp">${spell.higher_level != "" ? typeof(spell.higher_level) == "string" ? "At Higher Levels: " + spell.higher_level : "At Higher Levels: " + spell.higher_level.join("<BR/> &emsp;&emsp;") : ""}</p>
            <p class="spellDispDescExp">${spell.source.length > 2 ? "Source: " + spell.source : "Sources: " + spell.source.join(", ")}</p>
            <br>
        </div>

        <div class="spellToBook clickable invis add_book_hidden" id="book_btn_${spell.spellid}" onClick="addToBook('${spell.spellid}')">
            <p class="textToBook">${spellbook.indexOf(spell.spellid) != -1 ? "Remove from Spellbook" : "Add to Spellbook"}</p>
        </div>
    </div>
    <div class="rowContainer bottom bottom_margin" onClick="toggleSpellView('${spell.spellid}')" id="${spell.spellid+'_bottom'}">
        <div class="expLeft spellHeight">
            <p class="spellName" style="white-space: nowrap;">${spell.name} - </p>
        </div>
        <div class="expBot spellHeight"></div>
        <div class="closeBtn spellHeight">
            <div id="${spell.spellid+'_barrow'}" class="arrow">
                <svg class="arrow" style="margin: 0px;">
                    <polygon points="6,0 6,20 23.324,10" style="fill:white;stroke-width:3" />
                </svg>
            </div>
        </div>
    </div>
</div>`
    })
}

function popEmptySpellbook() {
    var spells = document.getElementById("bookContainer")
    spells.innerHTML = `
<p class="book_head_text" style="margin: 20px auto 0px; width: fit-content;">Open a spell and click "Add to Spellbook" to start your list of spells</p>
    `
}

function populateSpellbook(jsonResponse) {
    var data = JSON.parse(jsonResponse.srcElement.response)
    var spells = document.getElementById("bookContainer")
    spells.innerHTML = ''
    var heads = []

    data.spells.forEach(spell => {
        spell.spellid = spell.spellid + '_bk'
        if (heads.indexOf(spell.level) == -1) {
            heads.push(spell.level)
            spells.innerHTML += `
<div class="book_head">
    <p class="book_head_text">${spell.level == 0 ? "Cantrips" : "Level " + spell.level}</p>
</div>
            `
        }
        spells.innerHTML +=`
<div class="book_spell" id="${spell.spellid}">
    <div class="book_spell_container clickable" onClick="toggleBookSpellView('${spell.spellid}')">
        <div class="book_name" id="${spell.spellid + '_name'}">
            <p class="book_spell_text overflow">${spell.name}</p>
        </div>
        <div class="book_action" id="${spell.spellid + '_action'}">
            <p class="book_spell_text overflow">${spell.cast_time}</p>
        </div>
        <div class="book_conc" id="${spell.spellid + '_conc'}">
            <p class="book_spell_text overflow">${spell.concentration ? "Concentration" : ""}</p>
        </div>
        <div class="book_conc"  id="${spell.spellid + '_ritual'}">
            <p class="book_spell_text overflow">${spell.ritual ? "Ritual" : ""}</p>
        </div>
        <div class="book_close">
            <svg id="${spell.spellid+'_tarrow'}" class="arrow" style="margin: 0px;margin-left: 10px;">
                <polygon points="6,0 6,20 23.324,10" style="fill:white;stroke-width:3" />
            </svg>
        </div>
    </div>
    <div class="rowContainer">
        <div class="book_body" style="height: 0px" id="${spell.spellid+'_body'}" collapsed="true">
            <br>
            <p class="book_spellDispDescExp" style="margin-top: -4px;">Level: ${spell.level}</p>
            <p class="book_spellDispDescExp">School: ${spell.school}</p>
            <p class="book_spellDispDescExp">Casting Time: ${spell.cast_time}</p>
            <p class="book_spellDispDescExp">Range: ${spell.range}</p>
            <p class="book_spellDispDescExp">Components: ${spell.components.join(", ")} ${spell.material != "" ? '('+ spell.material + ')' : ''}</p>
            <p class="book_spellDispDescExp">Duration: ${spell.concentration == true ? "Concentration, " : ""} ${spell.duration}</p>
            <p class="book_spellDispDescExp">${spell.ritual == true ? "Ritual: Yes" : ""}</p>
            <p class="book_spellDispDescExp">${spell.classes[0] ? "Classes: " + spell.classes.sort().join(", ") : ""}</p>
            <p class="book_spellDispDescExp">${spell.subclasses ? "Subclasses: " + spell.subclasses.sort().join(", ") : ""}</p>
            <p class="book_spellDispDescExp">${spell.desc.join("<BR/> &emsp;&emsp;")}</p>
            <p class="book_spellDispDescExp">${spell.higher_level != "" ? typeof(spell.higher_level) == "string" ? "At Higher Levels: " + spell.higher_level : "At Higher Levels: " + spell.higher_level.join("<BR/> &emsp;&emsp;") : ""}</p>
            <p class="book_spellDispDescExp">${spell.source.length > 2 ? "Source: " + spell.source : "Sources: " + spell.source.join(", ")}</p>
            <br>
        </div>

        <div class="spellToBook_book clickable invis add_book_hidden_book" id="book_btn_${spell.spellid}_bk" onClick="remove_from_book('${spell.spellid}')">
            <p class="textToBook">Remove from Spellbook</p>
        </div>
    </div>

    <div class="book_spell_container_bottom book_bottom book_bottom_margin clickable" onClick="toggleBookSpellView('${spell.spellid}')" id="${spell.spellid+'_bottom'}">
        <div class="book_bottom_name">
            <p class="book_spell_text" style="white-space: nowrap;">${spell.name} - </p>
        </div>
        <div class="book_bottom_mid"></div>
        <div class="book_close book_close_bottom">
            <svg id="${spell.spellid+'_barrow'}" class="arrow" style="margin: 0px; margin-left: 10px;">
                <polygon points="6,0 6,20 23.324,10" style="fill:white;stroke-width:3" />
            </svg>
        </div>
    </div>
</div>
<div class="h15"></div>
    `
    })
}

function makeHTTPPostRequest(url, callback, data) {
    objXMLHttp=new XMLHttpRequest()
    objXMLHttp.onreadystatechange = callback
    objXMLHttp.open("POST", url)
    objXMLHttp.setRequestHeader("Content-Type", "application/json");
    objXMLHttp.send(data)
}

function handleSpellsResponse(data) {
    if (this.readyState == 4 && this.status == 200){
        populateSpells(data)
    }
}

function handleSpellbookResponse(data) {
    if (this.readyState == 4 && this.status == 200){
        populateSpellbook(data)
    }
}

function updateCookie() {
    var cList = []
    cList.push(document.getElementById("classes").selectedIndex)
    cList.push(document.getElementById("lvInput").value)
    cList.push(spellbook)

    document.cookie = `${cList}; expires=${new Date(9999, 0, 1).toUTCString()}`
}

function readCookie() {
    var cookie = document.cookie
    cookie = cookie.slice(cookie.indexOf(";")+2)
    var name = parseInt(cookie.split(",", 2)[0])
    var level = cookie.split(",", 2)[1].toString()
    var spells = cookie.split(",").splice(2)

    document.getElementById("classes").selectedIndex = name
    document.getElementById("lvInput").value = level
    updateSpellSlots()

    spellbook = spells
    if (spellbook.indexOf("") != -1) spellbook.pop(0)
    if (spellbook.length > 0) {
        makeBookRequest(spellbook)
    }
}