var darkMode = true
var filterState = {}
var currentFilter = JSON.stringify({"filter": {}})
var searchQuery = ''
var filterIDs = {
    "artificer": "Artificer",
    "bard": "Bard",
    "cleric": "Cleric",
    "druid": "Druid",
    "fighter": "Fighter (Eldritch Knight)",
    "monk": "Monk",
    "paladin": "Paladin",
    "ranger": "Ranger",
    "rogue": "Rogue (Arcane Trickster)",
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
  0: "▶",
  1: "▼",
  "class" : 0,
  "level" : 0,
  "components" : 0,
  "school" : 0,
  "action" : 0,
  "concentration" : 0,
  "ritual" : 0,
  "_class": "Class: ",
  "_level": "Level: ",
  "_components": "Components: ",
  "_school": "School: ",
  "_action": "Action: ",
  "_concentration": "Concentration: ",
  "_ritual": "Ritual: ",
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

function search(query){
    searchQuery = query
    sort = findSort()
    makeFilterRequest(sort, varCycle[sort], currentFilter, query)
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
  makeFilterRequest('nameSort', 0, currentFilter)
}

function findSort(){
    for([key] of Object.entries(varCycle)){
        if (varCycle[key] != 0) return key
        return 'nameSort'
    }
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
  makeFilterRequest('nameSort', 0, currentFilter)
}

function makeFilterRequest(fieldid, direction, filter){
    makeHTTPPostRequest('http://127.0.0.1:8000/filter?field='+fieldid+'&direction='+direction+'&searchquery='+searchQuery, handleSpellsResponse, filter);
}

function darkModeToggle(){
  darkMode = darkMode ? false : true;
  document.getElementById("darkToggle").innerHTML =
  darkMode ? "Dark Mode: On" : "Dark Mode: Off"
  if (darkMode) {
    applyDarkMode()
  }
  else {
    applyLightMode()
  }
}
function applyDarkMode() {
  divs = document.querySelectorAll("div")
  divs.forEach(element => {
    element.classList.remove('lightScheme')
  });
  inputs = document.querySelectorAll("input")
  inputs.forEach(element => {
    element.classList.remove('lightScheme')
    element.classList.remove('lightText')
  });
  document.querySelector("body").classList.remove("lightScheme")
  ps = document.querySelectorAll("p")
  ps.forEach(element => {
    element.classList.remove('lightText')
  });
  h1s = document.querySelectorAll("h1")
  h1s.forEach(element => {
    element.classList.remove('lightText')
  });
  h2s = document.querySelectorAll("h2")
  h2s.forEach(element => {
    element.classList.remove('bluerText')
  });
  h3s = document.querySelectorAll("h3")
  h3s.forEach(element => {
    element.classList.remove('lightText')
  });
}

function applyLightMode() {
  divs = document.querySelectorAll("div")
  divs.forEach(element => {
    element.classList.add('lightScheme')
  });
  inputs = document.querySelectorAll("input")
  inputs.forEach(element => {
    element.classList.add('lightScheme')
    element.classList.add('lightText')
  });
  document.querySelector("body").classList.add("lightScheme")
  ps = document.querySelectorAll("p")
  ps.forEach(element => {
    element.classList.add('lightText')
  });
  h1s = document.querySelectorAll("h1")
  h1s.forEach(element => {
    element.classList.add('lightText')
  });
  h2s = document.querySelectorAll("h2")
  h2s.forEach(element => {
    element.classList.add('bluerText')
  });
  h3s = document.querySelectorAll("h3")
  h3s.forEach(element => {
    element.classList.add('lightText')
  });


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
  if (darkMode != true) applyLightMode()
}
function CycleList(dID){
  id = dID + "_txt"
  opsID = dID + "_ops"

  searchCycle[dID] += 1
  if (searchCycle[dID] > 1) searchCycle[dID] = 0

  document.getElementById(id).innerHTML = searchCycle["_" + dID] + searchCycle[searchCycle[dID]]

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
    data.spells.forEach(spell => {
        spells.innerHTML +=`<div>
    <div class="spellContainer" id="${spell.spellid}">
      <div onclick="expandSpellView('${spell.spellid}')" class="name">
        <p class="spellName"> ${spell.name} - </p>
      </div><div onclick="expandSpellView('${spell.spellid}')" class="level">
        <p class="spellDispDesc">${spell.level}</p>
      </div><div onclick="expandSpellView('${spell.spellid}')" class="classes">
        <p class="spellDispDesc">${spell.classes.join(", ")}</p>
      </div><div onclick="expandSpellView('${spell.spellid}')" class="school">
        <p class="spellDispDesc">${spell.school}</p>
      </div>
      <div onclick="expandSpellView('${spell.spellid}')" class="closeBtn">
        <p class="expandArrow">▶</p>
      </div>
    </div>
    <div class="blank" id="${spell.spellid}_Exp">
      <div class="spellContainer">
        <div class="expLeft">
          <p class="spellName">${spell.name} - </p>
        </div>
        <div onclick="shrinkSpellView('${spell.spellid}')" class="expTop"></div>
        <div onclick="shrinkSpellView('${spell.spellid}')" class="expRight">
          <p class="expandArrow">▼</p>
        </div>
      </div>
      <div class="expBody">
        <p class="spellDispDescExp">Level: ${spell.level}</p>
        <p class="spellDispDescExp">School: ${spell.school}</p>
        <p class="spellDispDescExp">Casting Time: ${spell.cast_time}</p>
        <p class="spellDispDescExp">Range: ${spell.range}</p>
        <p class="spellDispDescExp">Components: ${spell.components} ${spell.material != "" ? '('+ spell.material + ')' : ''}</p>
        <p class="spellDispDescExp">Duration: ${spell.duration}</p>
        <p class="spellDispDescExp">Classes: ${spell.classes.join(", ")}</p>
        <p class="spellDispDescExp">${typeof(spell.desc) == "string" ? "&emsp;&emsp;" + spell.desc : "&emsp;&emsp;" + spell.desc.join("<BR/> &emsp;&emsp;")}</p>
        <p class="spellDispDescExp">At Higher Levels: ${typeof(spell.higher_level) == "string" ? spell.higher_level : spell.higher_level.join("<BR/> &emsp;&emsp;")}</p>
      </div>
      <div class="rowContainer" style="margin-top: -28px;">
        <div class="expLeft">
          <p class="spellName">${spell.name} - </p>
        </div>
        <div onclick="shrinkSpellView('${spell.spellid}')" class="expBot"></div>
        <div onclick="shrinkSpellView('${spell.spellid}')" class="expRight">
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