var staticurl = window.location.href
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
var oldFilter = {}
var currentFilter = JSON.stringify({"filter": {}})
var searchQuery = ''
var filterIDs = {
    "artificer": "Artificer",
    "bard": "Bard",
    "cleric": "Cleric",
    "druid": "Druid",
    "fighter": "Wizard",
    "monk": "Monk",
    "paladin": "Paladin",
    "ranger": "Ranger",
    "rogue": "Wizard",
    "sorcerer": "Sorcerer",
    "warlock": "Warlock",
    "wizard": "Wizard",
    "l0": "0",
    "l1": "1",
    "l2": "2",
    "l3": "3",
    "l4": "4",
    "l5": "5",
    "l6": "6",
    "l7": "7",
    "l8": "8",
    "l9": "9",
    "abjuration": "Abjuration",
    "conjuration": "Conjuration",
    "divination": "Divination",
    "enchantment": "Enchantment",
    "evocation": "Evocation",
    "illusion": "Illusion",
    "necromancy": "Necromancy",
    "transmutation": "Transmutation",

"artificer_alchemist": "Artificer (Alchemist)",
"artificer_armorer": "Artificer (Armorer)",
"artificer_artillerist": "Artificer (Artillerist)",
"artificer_battle_smith": "Artificer (Battle Smith)",
"bard_glamour": "Bard (Glamour)",
"cleric_arcana": "Cleric (Arcana)",
"cleric_death": "Cleric (Death)",
"cleric_forge": "Cleric (Forge)",
"cleric_grave": "Cleric (Grave)",
"cleric_knowledge": "Cleric (Knowledge)",
"cleric_life": "Cleric (Life)",
"cleric_light": "Cleric (Light)",
"cleric_nature": "Cleric (Nature)",
"cleric_order": "Cleric (Order)",
"cleric_peace": "Cleric (Peace)",
"cleric_trickery": "Cleric (Trickery)",
"cleric_twilight": "Cleric (Twilight)",
"cleric_war": "Cleric (War)",
"druid_arctic": "Druid (Arctic)",
"druid_coast": "Druid (Coast)",
"druid_desert": "Druid (Desert)",
"druid_forest": "Druid (Forest)",
"druid_mountain": "Druid (Mountain)",
"druid_spores": "Druid (Spores)",
"druid_stars": "Druid (Stars)",
"druid_swamp": "Druid (Swamp)",
"druid_underdark": "Druid (Underdark)",
"druid_wildfire": "Druid (Wildfire)",
"monk_four_elements": "Monk (Four Elements)",
"monk_shadow": "Monk (Shadow)",
"monk_sun_soul": "Monk (Sun Soul)",
"paladin_ancients": "Paladin (Ancients)",
"paladin_conquest": "Paladin (Conquest)",
"paladin_crown": "Paladin (Crown)",
"paladin_devotion": "Paladin (Devotion)",
"paladin_glory": "Paladin (Glory)",
"paladin_oathbreaker": "Paladin (Oathbreaker)",
"paladin_redemption": "Paladin (Redemption)",
"paladin_vengeance": "Paladin (Vengeance)",
"paladin_watchers": "Paladin (Watchers)",
"ranger_fey_wanderer": "Ranger (Fey Wanderer)",
"ranger_gloom_stalker": "Ranger (Gloom Stalker)",
"ranger_horizon_walker": "Ranger (Horizon Walker)",
"ranger_monster_slayer": "Ranger (Monster Slayer)",
"ranger_swarmkeeper": "Ranger (Swarmkeeper)",
"sorcerer_aberrant_mind": "Sorcerer (Aberrant Mind)",
"sorcerer_clockwork_soul": "Sorcerer (Clockwork Soul)",
"sorcerer_divine_soul": "Sorcerer (Divine Soul)",
"warlock_archfey": "Warlock (Archfey)",
"warlock_celestial": "Warlock (Celestial)",
"warlock_fathomless": "Warlock (Fathomless)",
"warlock_fiend": "Warlock (Fiend)",
"warlock_genie_-_djinni": "Warlock (Genie - Djinni)",
"warlock_genie_-_efreeti": "Warlock (Genie - Efreeti)",
"warlock_genie_-_marid": "Warlock (Genie - Marid)",
"warlock_genie_djinni": "Warlock (Genie Djinni)",
"warlock_great_old_one": "Warlock (Great Old One)",
"warlock_hexblade": "Warlock (Hexblade)",
"warlock_undying": "Warlock (Undying)",
"wizard_chronurgy": "Wizard (Chronurgy)",
"wizard_graviturgy": "Wizard (Graviturgy)",

    "_action": "1 action",
    "bonus_action": "1 bonus action",
    "reaction": "1 reaction",
    "minute": "1 minute",
    "ten_minute": "10 minutes",
    "hour": "1 hour",
    "_concentration": true,
    "not_concentration": false,
    "_ritual": true,
    "not_ritual": false,
    "phb": "Players Handbook",
    "xgte": "Xanathar's Guide to Everything",
    "eepc": "Elemental Evil Player's Companion",
    "acqinc": "Acquisitions Incorporated",
    "tcoe": "Tasha's Cauldron of Everything",
    "scag": "Sword Coast Adventurer's Guide",
    "egtw": "Explorer's Guide to Wildemount"
}
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
var searchCycle = {
  1: "▼",
  "class" : 0,
  "subclass": 0,
  "level" : 0,
  "components" : 0,
  "school" : 0,
  "action" : 0,
  "concentration" : 0,
  "ritual" : 0,
  "source": 0,
  "_class": "Class: ",
  "_subclass": "Subclass: ",
  "_level": "Level: ",
  "_components": "Components: ",
  "_school": "School: ",
  "_action": "Action: ",
  "_concentration": "Concentration: ",
  "_ritual": "Ritual: ",
  "_source": "Source: "
}

function toggleSpellView(cName){
    var current = document.querySelector("#" + cName + "_body")
    collapse(current)
    suffix = ["head0", "head1", "head2", "head3", "bottom", "tarrow", "barrow"]
    rclass = ["widen", "invis", "invis", "invis", "bottom_exp", "rot-right", "rot-left"]
    for (var i = 0; i < suffix.length; i++) {
        current = document.querySelector('#' + cName + "_" + suffix[i]);
        if (current.className.indexOf(rclass[i]) == -1) {
            current.className += " " + rclass[i]
        } else {
            current.className = current.className.replace(" " + rclass[i], "")
        }
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
    document.getElementById("spellList").innerHTML = '<img src="/static/images/loading.gif" alt="Loading" width="3%" height="3%" style="display: block; margin: 0 auto;" rel="import">'
    sort = findSort()
    makeFilterRequest(sort, varCycle[sort], currentFilter)
}

function resetPage() {
    curPage = 1
    document.getElementById("pageTxt").innerHTML = "Page " + curPage
    sort = findSort()
    makeFilterRequest(sort, varCycle[sort], currentFilter)
    scrollToTop()
}

function scrollToTop() {
    window.scrollBy({top: -(window.scrollY), left: 0, behavior: 'smooth'})
}

function settingsToggle(close=false){
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
    settingsToggle()
}
function setSetPos(pos) {
    switch(pos){
        case 1:
            document.getElementById('settingsGear').style.top = 0
            document.getElementById('settingsGear').style.left = "47.5%"
            document.getElementById('settingsGear').style.right ="auto"
            document.getElementById('settingsGear').style.bottom = "auto"
            break
        case 2:
            document.getElementById('settingsGear').style.top = 0
            document.getElementById('settingsGear').style.left = "auto"
            document.getElementById('settingsGear').style.right = 0
            document.getElementById('settingsGear').style.bottom = "auto"
            break
        case 3:
            document.getElementById('settingsGear').style.top = "auto"
            document.getElementById('settingsGear').style.left = "auto"
            document.getElementById('settingsGear').style.right = 0
            document.getElementById('settingsGear').style.bottom = "47.5%"
            break
        case 5:
            document.getElementById('settingsGear').style.top = "auto"
            document.getElementById('settingsGear').style.left = "47.5%"
            document.getElementById('settingsGear').style.right = "auto"
            document.getElementById('settingsGear').style.bottom = 0
            break
        case 6:
            document.getElementById('settingsGear').style.top = "auto"
            document.getElementById('settingsGear').style.left = 0
            document.getElementById('settingsGear').style.right = "auto"
            document.getElementById('settingsGear').style.bottom = 0
            break
        case 7:
            document.getElementById('settingsGear').style.top = "47.5%"
            document.getElementById('settingsGear').style.left = 0
            document.getElementById('settingsGear').style.right = "auto"
            document.getElementById('settingsGear').style.bottom = "auto"
            break
        case 8:
            document.getElementById('settingsGear').style.top = 0
            document.getElementById('settingsGear').style.left = 0
            document.getElementById('settingsGear').style.right = "auto"
            document.getElementById('settingsGear').style.bottom = "auto"
            break
    }
    document.querySelectorAll("div.spaceItem").forEach(element => {
        element.style.border = "rgb(80,80,80) solid 3px"
    });

    document.getElementById('setPos' + pos).style.border = "white solid 3px"
}
document.addEventListener('keydown', function(event) {
    if(event.key == 'Escape') {
        settingsToggle(close=true)
        toggleAcc(close=true)
    }
});

function toggleAcc(close=false) {
    if (close) {
        document.getElementById("accCon").classList.add('blank')
        accountView = false
        return
    }
    if (accountView) {
        document.getElementById("accCon").classList.add('blank')
        accountView = false
    } else {
        document.getElementById("accCon").classList.remove('blank')
        accountView = true
    }
}

function search(query){
    if (query != "") searchQuery = "\"" + query + "\""
    else searchQuery = ""
    sort = findSort()
    resetPage()
    makeFilterRequest(sort, varCycle[sort], currentFilter)
}

function sortToggle(id, field){
  filterKey = filterIDs[id]

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

  sort = findSort()
  makeFilterRequest(sort, varCycle[sort], currentFilter)
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

function populateSpells(jsonResponse) {
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