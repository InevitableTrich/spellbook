var localhost = 'http://127.0.0.1:8000/filter'
var currenturl = 'https://qf5278sx80.execute-api.us-east-1.amazonaws.com/default/filter-spells'
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

var spellChar = 1
var spellbook = []
var preplist = []
var slots_used = [0, 0, 0, 0, 0, 0, 0, 0, 0]
var col_heads = []

class Spellbook_Data {
    constructor() {
        this.main = 1
        this.characters = ["", "", ""]
        this.classes = ["", "", ""]
        this.levels = ["", "", ""]
        this.books = [[],[],[]]
        this.prepped = [[],[],[]]
        this.slots = [[],[],[]]
        this.collapsed = [[],[],[]]
    }
}
var settings = new Spellbook_Data()

function check_mobile() {
    var mobile = navigator.userAgent.toLowerCase().match(/mobile/i)
    if (mobile) {
        location.href.endsWith("/") ? location.href += "mobile" : location.href += "/mobile"
    }
}

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
            document.getElementById("book_btn_" + cName).classList.toggle("invis")
            setTimeout(function(){
                document.getElementById("book_btn_" + cName).classList.toggle("add_book_hidden_book")
            }, 20);
        }, 300);
        toggleViewBook(current, cName)
    } else {
        document.getElementById("book_btn_" + cName).classList.toggle("add_book_hidden_book")
        setTimeout(function(){
            document.getElementById("book_btn_" + cName).classList.toggle("invis")
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

function collapse(element, height = 0) {
    var isCollapsed = element.getAttribute('collapsed') === 'true';
    if(isCollapsed) {
        expandSection(element)
        element.setAttribute('collapsed', 'false')
    } else {
        collapseSection(element, height)
    }
}

function collapseSection(element, height = 0) {
    var sectionHeight = element.scrollHeight;
    var elementTransition = element.style.transition;
    element.style.transition = '';
    requestAnimationFrame(function() {
        element.style.height = sectionHeight + 'px';
        element.style.transition = elementTransition;
        requestAnimationFrame(function() {
            element.style.height = height + 'px';
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

//function toggleSettings(close=false){
//    if (close) {
//        document.getElementById("setCon").classList.add('blank')
//        settings = false
//        loadSettings()
//        return
//    }
//    if (settings) {
//        document.getElementById("setCon").classList.add('blank')
//        settings = false
//    }
//    else if (settings == false){
//        document.getElementById("setCon").classList.remove('blank')
//        settings = true
//    }
//    loadSettings()
//}
//function loadSettings(){
//    document.getElementById("perPageNum").innerHTML = "Spells Per Page: " + spellsPerPage
//    document.getElementById("perPage").value = spellsPerPage
//    document.getElementById("spellHeightNum").innerHTML = "Spell Height: " + spellHeight + "px"
//    document.getElementById("spellHeight").value = spellHeight
//}
//function updateSettings(id){
//    idNum = id + "Num"
//    slider = document.getElementById(id)
//    num = document.getElementById(idNum)
//    preText = ""
//    postText = ""
//
//    if (id == "perPage") {
//        preText = "Spells Per Page: "
//        postText = ""
//    } else if (id == "spellHeight") {
//        preText = "Spell Height: "
//        postText = "px"
//    }
//    num.innerHTML = preText + slider.value + postText
//}
//function updatePreview() {
//    document.getElementById('previewSpell').style.height = parseInt(document.getElementById("spellHeight").value) + "px"
//}
//function saveSettings(){
//    if (spellsPerPage == parseInt(document.getElementById("perPage").value)) {
//        changed = false
//    } else {
//        changed = true
//    }
//    spellsPerPage = parseInt(document.getElementById("perPage").value)
//    spellHeight = parseInt(document.getElementById("spellHeight").value)
//    sheet = document.styleSheets[0]
//    sheet.deleteRule(0)
//    sheet.insertRule(".spellHeight {height: " + spellHeight + "px;}", 0)
//    sheet.deleteRule(1)
//    sheet.insertRule(".bottom_margin {margin-top: -" + (spellHeight+3) + "px;}", 1)
//    if (changed) resetPage()
//    toggleSettings()
//}

document.addEventListener('keydown', function(event) {
    if(event.key == 'Escape') {
//        toggleSettings(close=true)
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
            "egtw": "Explorer's Guide to Wildemount",
            "frost": "Icewind Dale: Rime of the Frostmaiden",
            "ftod" :"Fizban's Treasury of Dragons",
            "kwalish":"Lost Laboratory of Kwalish",
            "strix":"Strixhaven: a Curriculum of Chaos"
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
    updateSlotCount()
}

function updateSlotCount() {
    var heads = []
    var children = [...document.getElementById("bookContainer").children]
    children.forEach(child =>{
        if (child.id.startsWith("book_head_")) {
            heads.push(child.id.slice(-1))
        }
    })

    for (var i = 1; i <= 9; i++) {
        var amount = parseInt(document.getElementById(`slot_amt_${i}`).innerHTML)
        if (heads.indexOf(i.toString()) != -1) {
            var cntr = document.getElementById(`slot_container_${i}`)
            cntr.innerHTML = ""
            for (var j = 0; j < amount; j++) {
                cntr.innerHTML +=`
    <div class="spell_slot clickable" onClick="use_slot(${i}, ${j})"></div>
                `
            }
        }
    }
    try {
        read_used_slots(heads)
    }
    catch {}
}

function use_slot(level, place) {
    var container = document.getElementById(`slot_container_${level}`)
    var children = container.children
    if (children[place].className.indexOf("used") != -1) { // if clicked on a used slot, remove use
        slots_used[level - 1] -= 1
        for(var i = children.length-1; i >= 0; i--) {
            if (children[i].className.indexOf("used") != -1) {
                children[i].classList.toggle("used")
                break
            }
        }
    } else { // if clicked on an unused slot, use it
        slots_used[level - 1] += 1
        for(var i = 0; i < children.length; i++) {
            if (children[i].className.indexOf("used") == -1) {
                children[i].classList.toggle("used")
                break
            }
        }
    }

    save_used_slots()
}

function save_used_slots() {
    settings.slots[settings.main - 1] = slots_used
    localStorage.setItem("slots", settings.slots.join("+"))
}

function read_used_slots(heads) {
    slots_used.forEach((used, index) => {
        var ndx = index + 1
        if (heads.indexOf(ndx.toString()) == -1) return
        var slot_list = document.getElementById(`slot_container_${ndx}`).children

        for(var i = 0; i < used; i++) {
            var slot = slot_list[i]
            slot.classList.toggle("used")
        }
    })
}

function prepSpell(id) {
    var current = document.getElementById(id)
    current.classList.toggle("prepped")
    name = id.slice(0,-8)
    if (preplist.indexOf(name) == -1) {
        preplist.push(name)
    } else {
        preplist.splice(preplist.indexOf(name), 1)
    }
    updateBook()
}

function updatePrepSpells() {
    preplist.forEach(spell => {
        var current = document.getElementById(spell+"_bk_prep")
        current.classList.toggle("prepped")
    })
}

function collapseHeads() {
    col_heads.forEach(head => {
        vis_collapse(head)
    })
}

function book_switch_view(id) {
    if (id.startsWith("char")) {
        spellChar = parseInt(id.slice(-1))
        settings.main = spellChar
        readBook()
        update_storage()
    } else {
        characterPageSettings()
    }

    book_switch_vis(id)
}

function book_switch_vis(id) {
    var current = document.getElementById(id)
    var container = document.getElementById("book_char_container")
    var children = [...container.children]

    children.forEach(child => {
        if (child === current) {
            if (child.className.indexOf("book_char_exp") == -1) {
                child.className += " book_char_exp"
            }
        } else {
            if (child.className.indexOf("book_char_exp") != -1) {
                child.className = child.className.replace(" book_char_exp","")
            }
        }
    })
}

//function cookieUpdateChar() {
//    var cookie = localStorage.getItem("book")
//    cookie = cookie.slice(1)
//    localStorage.setItem("book", `${spellChar+cookie}`)
//}

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

    updateBook()

    if (spellbook.length == 0) {
        popEmptySpellbook()
    } else {
        makeBookRequest(spellbook)
    }
}

function characterPageSettings() {
    var container = document.getElementById("bookContainer")

    var spellChar = settings.main
    book_switch_vis("char"+spellChar)
    var charSett = settings.characters
    container.innerHTML = `
<p class="char_text">Character Names:</p>
<input id="charName1" autocomplete="off" class="character_input" placeholder="Char 1" value="${charSett[0]}" onchange="updateCharName(id); updateBook()">
<input id="charName2" autocomplete="off" class="character_input" placeholder="Char 2" value="${charSett[1]}" onchange="updateCharName(id); updateBook()">
<input id="charName3" autocomplete="off" class="character_input" placeholder="Char 3" value="${charSett[2]}" onchange="updateCharName(id); updateBook()">
    `
}

function updateCharName(id) {
    var char = document.getElementById("char"+id.slice(-1))
    var name = document.getElementById(id).value
    if (name == "") {
        name = "Char " + id.slice(-1)
    }
    char.children[0].innerHTML = name

    settings.characters[id.slice(-1) - 1] = name
    update_storage()
}

function remove_from_book(id) {
    id = id.slice(0, id.indexOf("_"))
    try {
        var container = document.getElementById("bookContainer")
        var btn_char = document.getElementById("book_btn_" + id).children[0]
        btn_char.innerHTML = "Add to Spellbook"
    } catch(e) {}

    spellbook.splice(spellbook.indexOf(id), 1)
    preplist.splice(spellbook.indexOf(id), 1)

    updateBook()

    if (spellbook.length == 0) {
        popEmptySpellbook()
    } else {
        makeBookRequest(spellbook)
    }
}

function makeBookRequest(book) {
    if (window.location.href.startsWith('http://127.0.0.1:8000/')) {
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

function spellFormatHigher(high) {
    var higher = high != "" ? typeof(high) == "string" ? "At Higher Levels. " + high : "At Higher Levels. " + high.join("<BR/> &emsp;&emsp;") : ""
    higher = "<bi>" + higher.slice(0,higher.indexOf(".")+1) + "</bi>" + higher.slice(higher.indexOf(".")+1,)
    return higher
}

function spellFormatBody(spell) {
    var spellBody = []
    if (spell.desc.join().indexOf("#") > 0) {
        spellBody = descBold(spell.desc)
    } else {
        spellBody = spell.desc
    }
    if (spell.desc.join().indexOf("*") > 0) {
        spellBody = descStyle(spellBody)
    }

    if (spellBody.join().indexOf("|") > 0) {
        spellBody = descTable(spellBody)
    } else {
        spellBody = `<p class="spellDispDescExp">${spellBody.join("<BR/> &emsp;&emsp;")}</p>`
    }

    spellBody = spellBody.replaceAll("&emsp;&emsp;&emsp;&emsp;","&emsp;&emsp;")

    return spellBody
}

function descBold(desc) {
    for (var i = 0; i < desc.length; i++) {
        var para = desc[i]
        if (para.indexOf("#####") != -1) {
            para = para.replace("#####", "&emsp;&emsp;<tb>")
            para += "</tb>"
            desc[i] = para
        }
    }
    return desc
}

function descStyle(desc) {
    for (var i = 0; i < desc.length; i++) {
        var para = desc[i]
        if (para.indexOf("***") != -1) {
            para = para.replace("***","<bi>")
            para = para.replace("***","</bi>")
            desc[i] = para
        }
    }
    return desc
}

function descTable(body) {
    var tableIndexes = []
    for (var i = 0; i < body.length; i++) {
        if (body[i].indexOf("|") != -1) tableIndexes.push(i)
    }
    var tables = []
    var c = tableIndexes[1]
    var s = tableIndexes[0]
    for (var i = 1; i < tableIndexes.length; i++) {
        c = tableIndexes[i]
        if (c == tableIndexes[i-1]+1) {
        } else {
            tables.push([s,tableIndexes[i-1]])
            s = tableIndexes[i]
        }
    }
    tables.push([s,tableIndexes[tableIndexes.length-1]])

    var tableSet = []
    for (var j = 0; j < tables.length; j++) {
    var table = []
        for (var i = tables[j][0]; i <= tables[j][1]; i++) {
            if (i == tables[j][0]) {
                table.push(`<tr><th>${body[i].slice(1,-1).replaceAll("|","</th><th>")}</th></tr>`)
            } else {
                var inp = `<tr><td>${body[i].slice(1,-1).replaceAll("|","</td><td>")}</td></tr>`
                if (inp.indexOf('<td>---</td>') == -1) {
                    table.push(inp)
                }
            }
        }
        tableSet.push(table)
    }

    var last_front = 0
    var a_body_list = []
    for (var i = 0; i < tableSet.length; i++) {
        table = tableSet[i]
        var front = body.slice(last_front, tables[i][0])
        var a_table = "<table class='spell_table'>" + table.join("") + "</table>"
        a_body_list.push(`<p class="spellDispDescExp">${front.join("<BR/> &emsp;&emsp;")}</p>`)
        a_body_list.push(a_table)
        last_front = tables[i][1]+1
    }
    a_body_list.push(`<p class="spellDispDescExp">${body.slice(last_front,).join("<BR/> &emsp;&emsp;")}</p>`)

    spellBody = a_body_list.join("")
    return spellBody
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
    <div class="spellContainer spellHeight" onClick="toggleSpellView('${spell.spellid}')" id="${spell.spellid+'_top'}">
        <div class="name" id="${spell.spellid+'_head0'}">
            <p class="spellName overflow"> ${spell.name} - </p>
        </div>
        <div class="level" id="${spell.spellid+'_head1'}">
            <p class="spellDispDesc overflow hCentered">${spell.level}</p>
        </div>
        <div class="classes" id="${spell.spellid+'_head2'}">
            <p class="spellDispDesc overflow">${spell.classes[0] ? spell.subclasses ? spell.classes.sort().join(", ") + ", " + spell.subclasses.sort().join(", ") : spell.classes.sort().join(", ") : spell.subclasses.sort().join(", ")}</p>
        </div>
        <div class="school" id="${spell.spellid+'_head3'}">
            <p class="spellDispDesc overflow">${spell.school}</p>
        </div>
        <div class="closeBtn">
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
        <div class="closeBtn bottomCloseBtn spellHeight">
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
<p class="book_head_text" style="margin: 20px auto 0px; width: 90%;">Open a spell and click "Add to Spellbook" to start your list of spells</p>
    `
}

function updateButtons() {
    var buttons = [...document.getElementsByClassName("spellToBook")]
    buttons.forEach(button => {
        var target = button.children[0]
        if (spellbook.indexOf(button.id.slice(9)) == -1) {
            target.innerHTML = "Add to Spellbook"
        } else {
            target.innerHTML = "Remove from Spellbook"
        }
    })
}

function collapse_slots(lvl) {
    if (col_heads.includes(lvl.toString())) {
        col_heads.splice(col_heads.indexOf(lvl.toString()), 1)
    } else {
        col_heads.push(lvl.toString())
    }
    vis_collapse(lvl)
    save_collapsed()
}

function vis_collapse(lvl) {
    var container = document.getElementById(`container_${lvl}`)
    collapse(container)
    var arrow = document.getElementById(`arr_${lvl}`)
    arrow.classList.toggle("rot-right")
}

function save_collapsed() {
    settings.collapsed[settings.main - 1] = col_heads
    localStorage.setItem("collapsed", settings.collapsed.join("+"))
}

function populateSpellbook(jsonResponse) {
    var data = JSON.parse(jsonResponse.srcElement.response)
    var spells = document.getElementById("bookContainer")
    spells.innerHTML = ''
    var heads = []

    data.spells.forEach(spell => {
        if (heads.indexOf(spell.level) == -1) {
            heads.push(spell.level)

            spells.innerHTML += `
<div class="book_head" id="book_head_${spell.level}"  onclick="collapse_slots(${spell.level})">
    <div class="rowContainer clickable">
        <p class="book_head_text">${spell.level == 0 ? "Cantrips" : "Level " + spell.level}</p>
        <div class="slotContainerContainer">
            <div class="slotContainer non_clickable" id="slot_container_${spell.level}" onclick="event.stopPropagation()"></div>
        </div>
        <div class="book_head_text">
            <svg id="arr_${spell.level}" class="arrow level_arrow rot-right" viewbox="0 0 28 20">
                <polygon points="6,0 6,20 23.324,10" style="fill:white;stroke-width:3" />
            </svg>
        </div>
    </div>
</div>
<div id="container_${spell.level}" class="level_container" collapsed="false">

</div>
            `
        }
        spell.spellid = spell.spellid + '_bk'
        var spellBody = spellFormatBody(spell).replaceAll("spellDispDescExp", "book_spellDispDescExp")
        var spellHigher = spellFormatHigher(spell.higher_level)
        book_con = document.getElementById(`container_${spell.level}`)
        book_con.innerHTML +=`
<div class="rowContainer">
    <div class="prep_spell clickable" id="${spell.spellid}_prep" onCLick="prepSpell(id)"></div>
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
                <p class="book_spellDispDescExp" style="margin-top: -4px;"><b>Level:</b> ${spell.level}</p>
                <p class="book_spellDispDescExp"><b>School:</b> ${spell.school}</p>
                <p class="book_spellDispDescExp"><b>Casting Time:</b> ${spell.cast_time}</p>
                <p class="book_spellDispDescExp"><b>Range:</b> ${spell.range}</p>
                <p class="book_spellDispDescExp"><b>Components:</b> ${spell.components.join(", ")} ${spell.material != "" ? '('+ spell.material + ')' : ''}</p>
                <p class="book_spellDispDescExp"><b>Duration:</b> ${spell.concentration == true ? "Concentration, " : ""} ${spell.duration}</p>
                <p class="book_spellDispDescExp">${spell.ritual == true ? "<b>Ritual:</b> Yes" : ""}</p>
                <p class="book_spellDispDescExp">${spell.classes[0] ? "<b>Classes:</b> " + spell.classes.sort().join(", ") : ""}</p>
                <p class="book_spellDispDescExp">${spell.subclasses ? "<b>Subclasses:</b> " + spell.subclasses.sort().join(", ") : ""}</p>
                ${spellBody}
                <p class="book_spellDispDescExp">${spellHigher}</p>
                <p class="book_spellDispDescExp">${spell.source.length > 2 ? "<b>Source:</b> " + spell.source : "<b>Sources:</b> " + spell.source.join(", ")}</p>
                <br>
            </div>

            <div class="spellToBook_book clickable invis add_book_hidden_book" id="book_btn_${spell.spellid}" onClick="remove_from_book('${spell.spellid}')">
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
</div>
<div class="h15"></div>
    `
    })
    updateSlotCount()
    updatePrepSpells()
    if (col_heads[0] != "") collapseHeads()
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

function check_storage() {
    var checks = [
        "main", // 1
        "characters", // 2
        "classes", // 3
        "levels", // 4
        "books", // 5
        "prepped", // 6
        "slots", // 7
        "collapsed" // 8
    ]
    var values = [
        "1", // 1
        "Char 1+Char 2+Char 3", // 2
        "8+8+8", // 3
        "1+1+1", // 4
        "++", // 5
        "++", // 6
        "0,0,0,0,0,0,0,0,0+0,0,0,0,0,0,0,0,0+0,0,0,0,0,0,0,0,0", // 7
        "++" // 8
    ]
    checks.forEach((check, index) => {
        if (localStorage.getItem(check) == null) localStorage.setItem(check, values[index])
    })
}

function read_storage() {
    check_storage()

    settings.main = parseInt(localStorage.getItem("main"))
    spellChar = settings.main
    settings.characters = localStorage.getItem("characters").split("+")
    settings.classes = localStorage.getItem("classes").split("+")
    settings.levels = localStorage.getItem("levels").split("+")
    var books = localStorage.getItem("books").split("+")
    var prepped = localStorage.getItem("prepped").split("+")
    var slots = localStorage.getItem("slots").split("+")
    var col_head = localStorage.getItem("collapsed").split("+")
    for (var i = 0; i < 3; i++) {
        settings.books[i] = books[i].split(",")
        settings.prepped[i] = prepped[i].split(",")
        settings.collapsed[i] = col_head[i].split(",")

        // Make sure they're `int`s
        var lst = slots[i].split(",") // slots
        var ints = lst.map(function(x) {
            return parseInt(x)
        })
        isNaN(ints[0]) ? settings.slots[i] = [] : settings.slots[i] = ints
    }

    // get current character and set book to that character
    book_switch_vis("char"+settings.main)

    // set character names on tabs
    for (var i = 1; i <= 3; i++) {
        document.getElementById("char"+i).children[0].innerHTML = settings.characters[i-1]
    }

    // get current book, split into list of class, level, book, prepped, etc
    var ndx = parseInt(settings.main) - 1
    var clas = parseInt(settings.classes[ndx])
    var level = settings.levels[ndx]
    var spells = settings.books[ndx]
    var prep = settings.prepped[ndx]
    var slots_list = settings.slots[ndx]
    var col_head_list = settings.collapsed[ndx]

    // set data gathered
    document.getElementById("classes").selectedIndex = clas
    document.getElementById("lvInput").value = level
    updateSpellSlots(true)

    // set spellbook
    spellbook = spells

    // check for empty spellbook
    if (spellbook.indexOf("") != -1) spellbook.pop(0)

    // populate spellbook if there are spells, or set empty spellbook text
    if (spellbook.length > 0) {
        makeBookRequest(spellbook)
    } else {
        popEmptySpellbook()
    }

    // set prep list
    preplist = prep

    // check for empty prep list
    if (preplist.indexOf("") != -1) preplist.pop(0)

    // set slot list
    slots_used = slots_list

    // set collapsed heads list
    col_heads = col_head_list

    // chcek for empty collapsed list
    if (col_heads.indexOf("") != -1) col_heads.splice(0,1)
}

function update_storage() {
    localStorage.setItem("main", settings.main)
    localStorage.setItem("characters", settings.characters.join("+"))
    localStorage.setItem("classes", settings.classes.join("+"))
    localStorage.setItem("levels", settings.levels.join("+"))
    localStorage.setItem("books", settings.books.join("+"))
    localStorage.setItem("prepped", settings.prepped.join("+"))
}

function updateBook() {
    // gets current character
    settings.main = spellChar
    var ndx = spellChar - 1

    // gets character's class
    settings.classes[ndx] = document.getElementById("classes").selectedIndex

    // gets character's level
    settings.levels[ndx] = document.getElementById("lvInput").value

    // gets character's spellbook
    settings.books[ndx] = spellbook

    // gets character's prep list
    settings.prepped[ndx] = preplist

    // update storage
    update_storage()
}

function readBook() {
    // gets current character
    spellChar = settings.main
    var ndx = spellChar - 1

    // get spellbook
    spellbook = settings.books[ndx]

    // check for empty spellbook
    if (spellbook.indexOf("") != -1) spellbook.pop(0)

    // populate spellbook if there are spells, or set empty spellbook text
    if (spellbook.length > 0) {
        makeBookRequest(spellbook)
    } else {
        popEmptySpellbook()
    }
    updateButtons()

    // set prep list
    preplist = settings.prepped[ndx]

    // check for empty prep list
    if (preplist.indexOf("") != -1) preplist.pop(0)

    // get character data
    var clas = settings.classes[ndx]
    var level = settings.levels[ndx]

    // set data gathered
    document.getElementById("classes").selectedIndex = clas
    document.getElementById("lvInput").value = level
    updateSpellSlots(false)

    // get slots used
    slots_used = settings.slots[ndx]

    // get collapsed headers
    col_heads = settings.collapsed[ndx]
}