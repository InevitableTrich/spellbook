var darkMode = true
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

  for([key] of Object.entries(varCycle)){
    if (key != id){
      varCycle[key] = 0
      document.getElementById(key).innerHTML = sortState[key] +
      sortState[varCycle[key]]
    }
  }

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
function populateSpells(jsonResponse) {
    var data = JSON.parse(jsonResponse.srcElement.response)
    spells = document.getElementById("spellList")
    spells.innerHTML = ''
    data.spells.forEach(spell => {
        spells.innerHTML +=`<div>
    <div class="spellContainer" id="${spell.id}">
      <div onclick="expandSpellView('${spell.id}')" class="name">
        <p class="spellName"> ${spell.name} - </p>
      </div><div onclick="expandSpellView('${spell.id}')" class="level">
        <p class="spellDispDesc">${spell.level}</p>
      </div><div onclick="expandSpellView('${spell.id}')" class="classes">
        <p class="spellDispDesc">${spell.classes}</p>
      </div><div onclick="expandSpellView('${spell.id}')" class="school">
        <p class="spellDispDesc">${spell.school}</p>
      </div>
      <div onclick="expandSpellView('${spell.id}')" class="closeBtn">
        <p class="expandArrow">▶</p>
      </div>
    </div>
    <div class="blank" id="${spell.id}_Exp">
      <div class="spellContainer">
        <div class="expLeft">
          <p class="spellName">${spell.name} - </p>
        </div>
        <div onclick="shrinkSpellView('${spell.id}')" class="expTop"></div>
        <div onclick="shrinkSpellView('${spell.id}')" class="expRight">
          <p class="expandArrow">▼</p>
        </div>
      </div>
      <div class="expBody">
        <p class="spellDispDescExp">Level: ${spell.level}</p>
        <p class="spellDispDescExp">School: ${spell.school}</p>
        <p class="spellDispDescExp">Casting Time: ${spell.cast_time}</p>
        <p class="spellDispDescExp">Range: ${spell.range}</p>
        <p class="spellDispDescExp">Components: ${spell.components} (${spell.material})</p>
        <p class="spellDispDescExp">Duration: ${spell.duration}</p>
        <p class="spellDispDescExp">Classes: ${spell.classes}</p>
        <p class="spellDispDescExp">${spell.desc}</p>

        <p class="spellDispDescExp">At Higher Levels: ${spell.higher_level}</p>
      </div>
      <div class="rowContainer" style="margin-top: -28px;">
        <div class="expLeft">
          <p class="spellName">${spell.name} - </p>
        </div>
        <div onclick="shrinkSpellView('${spell.id}')" class="expBot"></div>
        <div onclick="shrinkSpellView('${spell.id}')" class="expRight">
          <p class="expandArrow">▲</p>
        </div>
      </div>
    </div>
  </div>`
    })
}

function makeHTTPRequest(url, callback) {
    objXMLHttp=new XMLHttpRequest()
    objXMLHttp.onreadystatechange  = callback
    objXMLHttp.open("GET", url)
    objXMLHttp.send()
}

function handleResponse(data) {
    if (this.readyState == 4 && this.status == 200){
        populateSpells(data)
    }
}