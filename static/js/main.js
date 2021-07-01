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
function populateSpells() {
    var data={
	"spells": [{
			"id": "acid_arrow",
			"name": "Acid Arrow",
			"level": "2",
			"classes": "Fighter (Eldritch Knight), Rogue (Arcane Trickster), Wizard",
			"school": "Evocation",
			"cast_time": "1 action",
			"duration": "Instantaneous",
			"range": "90 feet",
			"components": "V, S, M",
			"material": "Powdered rhubarb leaf and an adder's stomach",
			"desc": "A shimmering green arrow streaks toward a target within range and bursts in a spray of acid. Make a ranged spell attack against the target. On a hit, the target takes 4d4 acid damage immediately and 2d4 acid damage at the end of its next turn. On a miss, the arrow splashes the target with acid for half as much of the initial damage and no damage at the end of its next turn.",
			"higher_level": "When you cast this spell using a spell slot of 3rd level or higher, the damage (both initial and later) increases by 1d4 for each slot level above 2nd."

		},
		{
			"id": "booming_blade",
			"name": "Booming Blade",
			"level": "0",
			"classes": "Fighter (Eldritch Knight), Rogue (Arcane Trickster), Sorcerer, Warlock, Wizard",
			"school": "Evocation",
			"cast_time": "1 action",
			"duration": "1 round",
			"range": "Self (5-foot radius)",
			"components": "S, M",
			"material": "a melee weapon worth at least 1sp",
			"desc": "You brandish the weapon used in the spell's casting and make a melee attack with it against one creature within 5 feet of you. On a hit, the target suffers the weapon attack's normal effects and then becomes sheathed in booming energy until the start of your next turn. If the target willingly moves 5 feet or more before then, the target takes 1d8 thunder damage, and the spell ends.",
			"higher_level": "This spell's damage increases when you reach certain levels. At 5th level, the melee attack deals 1d8 extra thunder damage to the target on a hit, and the damage the target takes for moving increases to 2d8. Both damage rolls increase by 1d8 at 11th level (2d8 and 3d8) and again at 17th level (3d8 and 4d8)."
		}
	]
}
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