var staticurl = window.location.href
var localhost = 'http://127.0.0.1:8000/filter'
var currenturl = 'https://qf5278sx80.execute-api.us-east-1.amazonaws.com/default/filter-spells'
var settings = false
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
    "Artificer_-Alchemist-": "Artificer (Alchemist)",
    "Artificer_-Armorer-": "Artificer (Armorer)",
    "Artificer_-Artillerist-": "Artificer (Artillerist)",
    "Artificer_-Battle_Smith-": "Artificer (Battle Smith)",
    "Bard_-Glamour-": "Bard (Glamour)",
    "Cleric_-Arcana-": "Cleric (Arcana)",
    "Cleric_-Death-": "Cleric (Death)",
    "Cleric_-Forge-": "Cleric (Forge)",
    "Cleric_-Grave-": "Cleric (Grave)",
    "Cleric_-Knowledge-": "Cleric (Knowledge)",
    "Cleric_-Life-": "Cleric (Life)",
    "Cleric_-Light-": "Cleric (Light)",
    "Cleric_-Nature-": "Cleric (Nature)",
    "Cleric_-Order-": "Cleric (Order)",
    "Cleric_-Peace-": "Cleric (Peace)",
    "Cleric_-Trickery-": "Cleric (Trickery)",
    "Cleric_-Twilight-": "Cleric (Twilight)",
    "Cleric_-War-": "Cleric (War)",
    "Druid_-Arctic-": "Druid (Arctic)",
    "Druid_-Coast-": "Druid (Coast)",
    "Druid_-Desert-": "Druid (Desert)",
    "Druid_-Forest-": "Druid (Forest)",
    "Druid_-Mountain-": "Druid (Mountain)",
    "Druid_-Spores-": "Druid (Spores)",
    "Druid_-Stars-": "Druid (Stars)",
    "Druid_-Swamp-": "Druid (Swamp)",
    "Druid_-Underdark-": "Druid (Underdark)",
    "Druid_-Wildfire-": "Druid (Wildfire)",
    "Monk_-Four_Elements-": "Monk (Four Elements)",
    "Monk_-Shadow-": "Monk (Shadow)",
    "Monk_-Sun_Soul-": "Monk (Sun Soul)",
    "Paladin_-Ancients-": "Paladin (Ancients)",
    "Paladin_-Conquest-": "Paladin (Conquest)",
    "Paladin_-Crown-": "Paladin (Crown)",
    "Paladin_-Devotion-": "Paladin (Devotion)",
    "Paladin_-Glory-": "Paladin (Glory)",
    "Paladin_-Oathbreaker-": "Paladin (Oathbreaker)",
    "Paladin_-Redemption-": "Paladin (Redemption)",
    "Paladin_-Vengeance-": "Paladin (Vengeance)",
    "Paladin_-Watchers-": "Paladin (Watchers)",
    "Ranger_-Fey_Wanderer-": "Ranger (Fey Wanderer)",
    "Ranger_-Gloom_Stalker-": "Ranger (Gloom Stalker)",
    "Ranger_-Horizon_Walker-": "Ranger (Horizon Walker)",
    "Ranger_-Monster_Slayer-": "Ranger (Monster Slayer)",
    "Ranger_-Swarmkeeper-": "Ranger (Swarmkeeper)",
    "Sorcerer_-Aberrant_Mind-": "Sorcerer (Aberrant Mind)",
    "Sorcerer_-Clockwork_Soul-": "Sorcerer (Clockwork Soul)",
    "Sorcerer_-Divine_Soul-": "Sorcerer (Divine Soul)",
    "Warlock_-Archfey-": "Warlock (Archfey)",
    "Warlock_-Celestial-": "Warlock (Celestial)",
    "Warlock_-Fathomless-": "Warlock (Fathomless)",
    "Warlock_-Fiend-": "Warlock (Fiend)",
    "Warlock_-Genie_-_Djinni-": "Warlock (Genie - Djinni)",
    "Warlock_-Genie_-_Efreeti-": "Warlock (Genie - Efreeti)",
    "Warlock_-Genie_-_Marid-": "Warlock (Genie - Marid)",
    "Warlock_-Genie_Djinni-": "Warlock (Genie Djinni)",
    "Warlock_-Great_Old_One-": "Warlock (Great Old One)",
    "Warlock_-Hexblade-": "Warlock (Hexblade)",
    "Warlock_-Undying-": "Warlock (Undying)",
    "Wizard_-Chronurgy-": "Wizard (Chronurgy)",
    "Wizard_-Graviturgy-": "Wizard (Graviturgy)",
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

function expandSpellView(cName){
  const current = document.querySelector('#' + cName);
  current.className = 'blank'
  const currentExp = document.querySelector('#' + cName + '_Exp');
  currentExp.className = ''
}
function shrinkSpellView(cName){
  const current = document.querySelector('#' + cName);
  current.className = 'spellContainer'
  const currentExp = document.querySelector('#' + cName + '_Exp');
  currentExp.className = 'blank'
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
    window.scrollTo(0, 0)
}

function scrollToTop() {
    window.scrollTo(0, 0)
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
    sheet.insertRule(".spellHeight {height: " + spellHeight + "px;}")
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
    }
});

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
  sort = findSort()
  makeFilterRequest(sort, varCycle[sort], currentFilter)
}

function findSort(){
    for([key] of Object.entries(varCycle)){
        if (varCycle[key] != 0) return key
    }
    return 'nameSort'
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
    } else {
        url = currenturl
    }
    makeHTTPPostRequest(url+'?pagenum='+curPage+'&spellsperpage='+spellsPerPage+'&field='+fieldid+'&direction='+direction+'&searchquery='+searchQuery+'&url='+url, handleSpellsResponse, filter);
}

function expandExclSrch(){
  const current = document.querySelector('#eeso');
  current.className = 'blank'
  const currentExp = document.querySelector('#eeso_exp');
  currentExp.className = ''
}
function shrinkExclSrch(){
  const current = document.querySelector('#eeso');
  current.className = 'smallBtn'
  const currentExp = document.querySelector('#eeso_exp');
  currentExp.className = 'blank'
}
function CycleList(dID){
  id = dID + "_txt"
  opsID = dID + "_ops"

  searchCycle[dID] += 1
  if (searchCycle[dID] > 1) searchCycle[dID] = 0

  if (searchCycle[dID] == 1) document.getElementById(id).innerHTML = searchCycle["_" + dID] + searchCycle[searchCycle[dID]]
  else document.getElementById(id).innerHTML = searchCycle["_" + dID] +
        `<svg width="28px", height="24px" style="position: relative; top: 1px; right: 5px;">
          <polygon points="6,6 6,24 23.324,15" style="fill:white;stroke-width:3" />
        </svg>`

  if (searchCycle[dID] == 0){
    const current = document.querySelector("#" + opsID)
    current.className = "blank"
  }else if (searchCycle[dID] == 1){
    const current = document.querySelector("#" + opsID)
    current.className = ""
  }
}

function populateSpells(jsonResponse) {
    var data = JSON.parse(jsonResponse.srcElement.response)
    spells = document.getElementById("spellList")
    spells.innerHTML = ''
    spellCount = data.spellscount
    maxPages = Math.ceil(spellCount/spellsPerPage)
    data.spells.forEach(spell => {
        spells.innerHTML +=`<div>
    <div class="spellContainer" id="${spell.spellid}">
      <div onclick="expandSpellView('${spell.spellid}')" class="name spellHeight">
        <p class="spellName overflow"> ${spell.name} - </p>
      </div><div onclick="expandSpellView('${spell.spellid}')" class="level spellHeight">
        <p class="spellDispDesc overflow hCentered">${spell.level}</p>
      </div><div onclick="expandSpellView('${spell.spellid}')" class="classes spellHeight">
        <p class="spellDispDesc overflow">${spell.classes[0] ? spell.subclasses ? spell.classes.sort().join(", ") + ", " + spell.subclasses.sort().join(", ") : spell.classes.sort().join(", ") : spell.subclasses.sort().join(", ")}</p>
      </div><div onclick="expandSpellView('${spell.spellid}')" class="school spellHeight">
        <p class="spellDispDesc overflow">${spell.school}</p>
      </div>
      <div onclick="expandSpellView('${spell.spellid}')" class="closeBtn spellHeight">
        <svg width="28px", height="20px">
          <polygon points="6,0 6,20 23.324,10" style="fill:white;stroke-width:3" />
        </svg>
      </div>
    </div>
    <div class="blank" id="${spell.spellid}_Exp">
      <div class="spellContainer">
        <div onclick="shrinkSpellView('${spell.spellid}')" class="expLeft spellHeight">
          <p class="spellName" style="white-space: nowrap;">${spell.name} - </p>
        </div>
        <div onclick="shrinkSpellView('${spell.spellid}')" class="expTop spellHeight"></div>
        <div onclick="shrinkSpellView('${spell.spellid}')" class="expRight spellHeight">
          <p class="expandArrow">▼</p>
        </div>
      </div>
      <div class="expBody">
        <br>
        <p class="spellDispDescExp" style="margin-top: 20px;">Level: ${spell.level}</p>
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
      <div class="rowContainer" style="margin-top: -28px;">
        <div onclick="shrinkSpellView('${spell.spellid}')" class="expLeft spellHeight">
          <p class="spellName" style="white-space: nowrap;">${spell.name} - </p>
        </div>
        <div onclick="shrinkSpellView('${spell.spellid}')" class="expBot spellHeight"></div>
        <div onclick="shrinkSpellView('${spell.spellid}')" class="expRight spellHeight">
          <p class="expandArrow">▲</p>
        </div>
      </div>
    </div>
  </div>`
    })
}

function makeHTTPPostRequest(url, callback, data) {
    objXMLHttp=new XMLHttpRequest()
    objXMLHttp.onreadystatechange  = callback
    objXMLHttp.open("POST", url)
    objXMLHttp.setRequestHeader("Content-Type", "application/json");
    objXMLHttp.send(data)
}

function handleSpellsResponse(data) {
    if (this.readyState == 4 && this.status == 200){
        populateSpells(data)
    }
}