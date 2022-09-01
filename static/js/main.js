var curPage = 1
var maxPages = 0
var spellsPerPage = 30
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
  "classSort": "Classes: "
}
var varCycle = {
  "nameSort": 0,
  "levelSort": 0,
  "classSort": 0
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
var character = new Spellbook_Data()

function check_mobile() {
    var mobile = navigator.userAgent.toLowerCase().match(/mobile/i)
    if (mobile) {
        location.href.endsWith("/") ? location.href += "mobile" : location.href += "/mobile"
    }
}

function toggleSpellView(cName) {
    var current = document.getElementById(cName + "_body")

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
        current = document.getElementById(cName + "_" + suffix[i]);
        current.classList.toggle(rclass[i])
    }
}

function toggleBookSpellView(cName) {
    var current = document.getElementById(cName + "_body" + "_" + spellChar)

    if (current.getAttribute("collapsed") === 'true') {
        setTimeout(function(){
            document.getElementById("book_btn_" + cName + "_" + spellChar).classList.toggle("invis")
            setTimeout(function(){
                document.getElementById("book_btn_" + cName + "_" + spellChar).classList.toggle("add_book_hidden_book")
            }, 20);
        }, 300);
        toggleViewBook(current, cName)
    } else {
        document.getElementById("book_btn_" + cName + "_" + spellChar).classList.toggle("add_book_hidden_book")
        setTimeout(function(){
            document.getElementById("book_btn_" + cName + "_" + spellChar).classList.toggle("invis")
            toggleViewBook(current, cName)
        }, 200);
    }
}
function toggleViewBook(current, cName){
    collapse(current)
    var suffix = ["bottom", "tarrow", "barrow", "action", "conc", "ritual", "name"]
    var rclass = ["book_bottom_exp", "rot-right", "rot-left", "invis", "invis", "invis", "book_widen"]
    for (var i = 0; i < suffix.length; i++) {
        current = document.getElementById(cName + "_" + suffix[i] + "_" + spellChar)
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
    document.getElementById(id).innerHTML = sortState[id] + sortState[varCycle[id]]

    if (varCycle[id] == 0) {
        makeFilterRequest('nameSort', 0, currentFilter)
    } else {
        makeFilterRequest(id, varCycle[id], currentFilter)
    }

    for([key] of Object.entries(varCycle)){
        if (key != id){
            varCycle[key] = 0
            document.getElementById(key).innerHTML = sortState[key] + sortState[varCycle[key]]
        }
    }
}

function pageChange(inc) {
    curPage += inc
    if (curPage < 1) curPage = maxPages
    else if (maxPages == 0) curPage = 1
    else if (curPage > maxPages) curPage = 1
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

document.addEventListener('keydown', function(event) {
    if(event.key == 'Escape') {
        var r = delete_prompt(close=true)
        if (r > 0) toggleBook(close=true)
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

class Subclass {
    constructor() {
        this.enabled = false
        this.subclass_names = []
    }
}

function getSubs(class_name) {
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

    clearSubs(class_name)
    var up_class = class_name.charAt(0).toUpperCase() + class_name.slice(1)
    if (!subs[class_name][0]) {
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
        document.getElementById("subclasses").innerHTML += `
            <div id="add_subclass_spells" class="clickable" onclick="add_subclass_spells()" style="margin-left: 10.5px;">
                <p class="add_subs_text">Add Subclass Spells to Book</p>
            </div>
            `
    } else {
        document.querySelector("#subs_con").innerHTML = `<p id="subs" class="ciTxt" style="margin-bottom: 12px;">Select a Class for available Subclasses to appear.</p>`
        document.getElementById("add_subclass_spells").remove()
    }
}

function clearSubs(class_name){
    delete filterState["subs"]
    currentFilter = "{\"filter\": " + JSON.stringify(filterState) + "}"
}

function add_subclass_spells() {
    if (filterState['subs'] == undefined) return

    var subclass_spells = {
        'Artificer (Alchemist)': ['Healing Word','Ray of Sickness','Flaming Sphere','Melf\'s Acid Arrow','Gaseous Form','Mass Healing Word','Blight','Death Ward','Cloudkill','Raise Dead'],
        'Artificer (Armorer)': ['Magic Missile','Thunderwave','Mirror Image','Shatter','Hypnotic Pattern','Lightning Bolt','Fire Shield','Greater Invisibility','Passwall','Wall of Force'],
        'Artificer (Artillerist)': ['Shield','Thunderwave','Scorching Ray','Shatter','Fireball','Wind Wall','Ice Storm','Wall of Fire','Cone of Cold','Wall of Force'],
        'Artificer (Battle Smith)': ['Heroism','Shield','Branding Smite','Warding Bond','Aura of Vitality','Conjure Barrage','Aura of Purity','Fire Shield','Banishing Smite','Mass Cure Wounds'],
        'Bard (Glamour)': ['Command'],
        'Cleric (Arcana)': ['Detect Magic','Magic Missile','Magic Weapon','Nystul\'s Magic Aura','Dispel Magic','Magic Circle','Arcane Eye','Leomund\'s Secret Chest','Planar Binding','Teleportation Circle'],
        'Cleric (Death)': ['False Life','Ray of Sickness','Blindness-Deafness','Ray of Enfeeblement','Animate Dead','Vampiric Touch','Blight','Death Ward','Antilife Shell','Cloudkill'],
        'Cleric (Forge)': ['Identify','Searing Smite','Heat Metal','Magic Weapon','Elemental Weapon','Protection from Energy','Fabricate','Wall of Fire','Animate Objects','Creation'],
        'Cleric (Grave)': ['Bane','False Life','Gentle Repose','Ray of Enfeeblement','Revivify','Vampiric Touch','Blight','Death Ward','Antilife Shell','Raise Dead'],
        'Cleric (Knowledge)': ['Command','Identify','Augury','Suggestion','Nondetection','Speak with Dead','Arcane Eye','Confusion','Legend Lore','Scrying'],
        'Cleric (Life)': ['Bless','Cure Wounds','Lesser Restoration','Spiritual Weapon','Beacon of Hope','Revivify','Death Ward','Guardian of Faith','Mass Cure Wounds','Raise Dead'],
        'Cleric (Light)': ['Burning Hands','Faerie Fire','Flaming Sphere','Scorching Ray','Daylight','Fireball','Guardian of Faith','Wall of Fire','Flame Strike','Scrying'],
        'Cleric (Nature)': ['Animal Friendship','Speak with Animals','Barkskin','Spike Growth','Plant Growth','Wind Wall','Dominate Beast','Grasping Vine','Insect Plague','Tree Stride'],
        'Cleric (Order)': ['Command','Heroism','Hold Person','Zone of Truth','Mass Healing Word','Slow','Compulsion','Locate Creature','Commune','Dominate Person'],
        'Cleric (Peace)': ['Heroism','Sanctuary','Aid','Warding Bond','Beacon of Hope','Sending','Aura of Purity','Otiluke\'s Resilient Sphere','Greater Restoration','Rary\'s Telepathic Bond'],
        'Cleric (Tempest)': ['Fog Cloud','Thunderwave','Gust of Wind','Shatter','Call Lightning','Sleet Storm','Control Water','Ice Storm','Destructive Wave','Insect Plague'],
        'Cleric (Trickery)': ['Charm Person','Disguise Self','Mirror Image','Pass Without Trace','Blink','Dispel Magic','Dimension Door','Polymorph','Dominate Person','Modify Memory'],
        'Cleric (Twilight)': ['Faerie Fire','Sleep','Moonbeam','See Invisibility','Aura of Vitality','Leomund\'s Tiny Hut','Aura of Life','Greater Invisibility','Circle of Power','Mislead'],
        'Cleric (War)': ['Divine Favor','Shield of Faith','Magic Weapon','Spiritual Weapon','Crusader\'s Mantle','Spirit Guardians','Freedom of Movement','Stoneskin','Flame Strike','Hold Monster'],
        'Druid (Arctic)': ['Hold Person','Spike Growth','Sleet Storm','Slow','Freedom of Movement','Ice Storm','Commune with Nature','Cone of Cold'],
        'Druid (Coast)': ['Mirror Image','Misty Step','Water Breathing','Water Walk','Control Water','Freedom of Movement','Conjure Elemental','Scrying'],
        'Druid (Desert)': ['Blur','Silence','Create Food and Water','Protection from Energy','Blight','Hallucinatory Terrain','Insect Plague','Wall of Stone'],
        'Druid (Forest)': ['Barkskin','Spider Climb','call Lightning','Plant Growth','Divination','Freedom of Movement','Commune with Nature','Tree Stride'],
        'Druid (Grassland)': ['Invisibility','Pass Without Trace','Daylight','Haste','Divination','Freedom of Movement','Dream','Insect Plague'],
        'Druid (Mountain)': ['Spider Climb','Spike Growth','Lightning Bolt','Meld into Stone','Stone Shape','Stoneskin','Passwall','Wall of Stone'],
        'Druid (Spores)': ['Chill Touch','Blindness/Deafness','Gentle Repose','Animate Dead','Gaseous Form','Blight','Confusion','Cloudkill','Contagion'],
        'Druid (Stars)': ['Guidance','Guiding Bolt'],
        'Druid (Swamp)': ['Darkness','Melf\'s Acid Arrow','Stinking Cloud','Water Walk','Freedom of Movement','Locate Creature','Insect Plague','Scrying'],
        'Druid (Underdark)': ['Spider Climb','Web','Gaseous Form','Stinking Cloud','Greater Invisibility','Stone Shape','Cloudkill','Insect Plague'],
        'Druid (Wildfire)': ['Burning Hands','Cure Wounds','Flmaing Sphere','Scorching Ray','Plant Growth','Revivify','Aura of Life','Fire Shield','Flame Strike','Mass Cure Wounds'],
        'Monk (Four Elements)': ['Burning Hands','Thunderwave','Gust of Wind','Hold Person','Shatter','Fly','Gaseous Form','Stoneskin','Wall ofFire','Cone of Cold','Wall of Stone'],
        'Monk (Shadow)': ['Minor Illusion','Darkness','Darkvision','Pass Without Trace','Silence'],
        'Monk (Sun Soul)': ['Burning Hands'],
        'Paladin (Ancients)': ['Ensnaring Strike','Speak with Animals','Misty Step','Moonbeam','Plant Growth','Protection from Energy','Ice Storm','Stoneskin','Commune with Nature','Tree Stride'],
        'Paladin (Conquest)': ['Armor of Agathys','Command','Hold Person','Spiritual Weapon','Bestow Curse','Fear','Dominate Beast','Stoneskin','Cloudkill','Dominate Person'],
        'Paladin (Crown)': ['Command','Compelled Duel','Warding Bond','Zone of Truth','Aura of Vitality','Spirit Guardians','Banishment','Guardian of Faith','Circle of Power','Geas'],
        'Paladin (Devotion)': ['Protection from Evil and Good','Sanctuary','Lesser Restoration','Zone of Truth','Beacon of Hope','Dispel Magic','Freedom of Movement','Guardian of Faith','Commune','Flame Strike'],
        'Paladin (Glory)': ['Guiding Bolt','Heroism','Enhance Ability','Magic Weapon','Haste','Protection from Energy','Compulsion','Freedom of Movement','Commune','Flame Strike'],
        'Paladin (Oathbreaker)': ['Hellish Rebuke','Inflict Wounds','Crown of Madness','Darkness','Animate Dead','Bestow Curse','Blight','Confusion','Contagion','Dominate Person'],
        'Paladin (Redemption)': ['Sanctuary','Sleep','Calm Emotions','Hold Person','Counterspell','Hypnotic Pattern','Otiluke\'s Resilient Sphere','Stoneskin','Hold Monster','Wall of Force'],
        'Paladin (Vengeance)': ['Bane','Hunter\'s Mark','Hold Person','Misty Step','Haste','Protection from Energy','Banishment','Dimension Door','Hold Monster','Scrying'],
        'Paladin (Watchers)': ['Alarm','Detect Magic','Moonbeam','See Invisibility','Counterspell','Nondetection','Aura of Purity','Banishment','Hold Monster','Scrying'],
        'Ranger (Fey Wanderer)': ['Charm Person','Misty Step','Dispel Magic','Dimension Door','Mislead'],
        'Ranger (Gloom Stalker)': ['Disguise Self','Rope Trick','Fear','Greater Invisibility','Seeming'],
        'Ranger (Horizon Walker)': ['Protection from Evil and Good','Misty Step','Haste','Banishment','Teleportation Circle'],
        'Ranger (Monster Slayer)': ['Protection from Evil and Good','Zone of Truth','Magic Circle','Banishment','Hold Monster'],
        'Ranger (Swarmkeeper)': ['Mage Hand','Faerie Fire','Web','Gaseous Form','Arcane Eye','Insect Plague'],
        'Sorcerer (Aberrant Mind)': ['Mind Sliver','Arms of Hadar','Dissonant Whispers','Calm Emotions','Detect Thoughts','Hunger of Hadar','Sending','Evard\'s Black Tentacles','Summon Aberration','Rary\'s Telepathic Bond','Telekinesis'],
        'Sorcerer (Clockwork Soul)': ['Alarm','Protection from Evil and Good','Aid','Lesser Restoration','Dispel Magic','Protection from Energy','Freedom of Movement','Summon Construct','Greater Restoration','Wall of Force'],
        'Sorcerer (Divine Soul)': ['Guidance','Resistance','Sacred Flame','Spare the Dying','Thaumaturgy','Toll the Dead','Word of Radiance','Bane','Bless','Ceremony','Command','Create or Destroy Water','Cure Wounds','Detect Evil and Good','Detect Poison and Disease','Guiding Bolt','Healing Word','Inflict Wounds','Protection from Evil and Good','Purify Food and Drink','Sanctuary','Shield of Faith','Aid Augury','Calm Emotions','Continual Flame','Find Traps','Gentle Repose','Lesser Restoration','Locate Object','Prayer of Healing','Protection from Poison','Silence','Spiritual Weapon','Warding Bond','Zone of Truth','Animate Dead','Beacon of Hope','Bestow Curse','Create Food and Water','Fast Friends','Feign Death','Glyph of Warding','Life Transference','Magic Circle','Mass Healing Word','Meld into Stone','Motivational Speech','Remove Curse','Revivify','Sending','Speak with Dead','Spirit Guardians','Spirit Shroud','Control Water','Death Ward','Divination','Freedom of Movement','Guardian of Faith','Locate Creature','Stone Shape','Commune','Contagion','Dawn','Dispel Evil and Good','Flame Strike','Geas','Greater Restoration','Hallow','Holy Weapon','Legend Lore','Mass Cure Wounds','Planar Binding','Raise Dead','Scrying','Summon Celestial','Blade Barrier','Create Undead','Find the Path','Forbiddance','Harm','Heal','Heroes\' Feast','Planar Ally','Word of Recall','Conjure Celestial','Divine Word','Regenerate','Resurrection','Symbol','Temple of the Gods','Antimagic Field','Control Weather','Holy Aura','Astral Projection','Mass Heal','True Resurrection'],
        'Warlock (Archfey)': ['Faerie Fire','Sleep','Calm Emotions','Phantasmal Force','Blink','Plant Growth','Dominate Beast','Greater Invisibility','Dominate Person','Seeming'],
        'Warlock (Celestial)': ['Light','Sacred Flame','Cure Wounds','Guiding Bolt','Flaming Sphere','Lesser Restoration','Daylight','Revivify','Guardian of Faith','Wall of Fire','Flame Strike','Greater Restoration'],
        'Warlock (Fathomless)': ['Create or Destroy Water','Thunderwave','Gust of Wind','Silence','Lightning Bolt','Sleet Storm','Control Water','Summon Elemental','Bigby\'s Hand','Cone of Cold'],
        'Warlock (Fiend)': ['Burning Hands','Command','Blindness/Deafness','Scorching Ray','Fireball','Stinking Cloud','Fire Shield','Wall of Fire','Flame Strike','Hallow'],
        'Warlock (Genie - Dao)': ['Detect Evil and Good','Sanctuary','Phantasmal Force','Spike Growth','Crete Food and Water','Meld into Stone','Phantasmal Killer','Stone Shape','Creation','Wall of Stone','Wish'],
        'Warlock (Genie - Djinni)': ['Detect Evil and Good','Thunderwave','Gust of Wind','Phantasmal Force','Create Food and Water','Wind Wall','Greater Invisibility','Phantasmal Killer','Creation','Seeming','Wish'],
        'Warlock (Genie - Efreeti)': ['Burning Hands','Detect Evil and Good','Phantasmal Force','Scorching Ray','Create Food and Water','Fireball','Fire Shield','Phantasmal Killer','Creation','Flame Strike','Wish'],
        'Warlock (Genie - Marid)': ['Detect Evil and Good','Fog Cloud','Blur','Phantasmal Force','Create Food and Water','Sleet Storm','Control Water','Phantasmal Killer','Cone of Cold','Creation','Wish'],
        'Warlock (Great Old One)': ['Dissonant Whispers','Tasha\'s Hideous Laughter','Detect Thoughts','Phantasmal Force','Clairvoyance','Sending','Dominate Beast','Evard\'s Black Tentacles','Dominate Person','Telekinesis'],
        'Warlock (Hexblade)': ['Shield','Wrathful Smite','Blur','Branding Smite','Blink','Elemental Weapon','Phantasmal Killer','Staggering Smite','Banishing Smite','Cone of Cold'],
        'Warlock (Undying)': ['Spare the Dying','False Life','Ray of Sickness','Blindness/Deafness','Silence','Feign Death','Speak with Dead','Aura of Life','Death Ward','Contagion','Legend Lore']
    }

    var to_format = []

    filterState['subs'].forEach(sub => {
        var chosen_spells = subclass_spells[sub]
        chosen_spells.forEach(spell => {
            if (spellbook.indexOf(spell) == -1) to_format.push(spell)
        })
    })

    to_format.forEach(spell => {
        spell = spell.toLowerCase().replaceAll(" ", "-")
        spellbook.push(spell)
    })

    makeBookRequest(spellbook)
}

function clrESO(){
    [...document.getElementsByClassName("sortSelected")].forEach(e => {
        e.classList.toggle("sortSelected")
    })

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
        document.getElementById(key).innerHTML = sortState[key] + sortState[varCycle[key]]
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

function updateSlotCount(char = spellChar) {
    var heads = []
    var children = [...document.getElementById("book_container_"+char).children]
    children.forEach(child =>{
        if (child.id.startsWith("book_head_")) {
            heads.push(child.id.slice(-1))
        }
    })

    for (var i = 1; i <= 9; i++) {
        var amount = parseInt(document.getElementById(`slot_amt_${i}`).innerHTML)
        if (heads.indexOf(i.toString()) != -1) {
            var cntr = document.getElementById(`slot_container_${char}_${i}`)
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
    catch (e) {}
}

function use_slot(level, place) {
    var container = document.getElementById(`slot_container_${spellChar}_${level}`)
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
    character.slots[character.main - 1] = slots_used
    localStorage.setItem("slots", character.slots.join("+"))
}

function read_used_slots(heads) {
    slots_used.forEach((used, index) => {
        var ndx = index + 1
        if (heads.indexOf(ndx.toString()) == -1) return
        var slot_list = document.getElementById(`slot_container_${spellChar}_${ndx}`).children

        for(var i = 0; i < used; i++) {
            var slot = slot_list[i]
            slot.classList.toggle("used")
        }
    })
}

function clear_used_slots(){
    // visually remove slots
    Array.from(document.getElementsByClassName("used")).forEach(slot => {
        slot.classList.toggle("used")
    })

    // remove from settings
    character.slots[spellChar-1] = [0, 0, 0, 0, 0, 0, 0 ,0 , 0]

    // remove from local storage
    localStorage.slots = character.slots.join("+")
}

function prepSpell(id) {
    var current = document.getElementById(id)
    current.classList.toggle("prepped")

    name = id.slice(0,-12)
    if (preplist.indexOf(name) == -1) {
        preplist.push(name)
    } else {
        preplist.splice(preplist.indexOf(name), 1)
    }
    updateBook()
}

function updatePrepSpells(char) {
    character.prepped[char-1].forEach(spell => {
        var current = document.getElementById(spell+"_bk_"+char+"_prep_"+char)
        current.classList.toggle("prepped")
    })
}

function collapseHeads(char) {
    character.collapsed[char-1].forEach(head => {
        vis_collapse(head, char)
    })
}

function book_switch_view(id) {
    var num = parseInt(id.slice(-1))
    var prev = spellChar

    if (num == prev && num == 4) return

    spellChar = num
    if (num <= 3) {  // if character tab:
        // update spellChar
        character.main = spellChar

        // update spellbook var
        spellbook = character.books[spellChar-1]

        // read char info
        var ndx = spellChar - 1
        var clas = parseInt(character.classes[ndx])
        var level = character.levels[ndx]

        // set char info
        document.getElementById("classes").selectedIndex = clas
        document.getElementById("lvInput").value = level

        // check used slots
        slots_used = character.slots[ndx]
        updateSpellSlots()

        // get prepped spells
        preplist = [...character.prepped[ndx]]

        // update buttons on main spells
        updateButtons()

        // save
        update_storage()
    } else {  // settings
        // remove names with char select
        [...document.getElementsByClassName("char_select")].forEach(e => e.classList.toggle("char_select"))

        // select most recent character
        document.getElementById("charName"+prev).classList.toggle("char_select")
    }

    book_switch_vis(id) // tabs
    book_switch_main(num, prev)  // main container
}

function book_switch_main(id, prev_id) {  // switches main page visibility
    var prev = document.getElementById('book_container_'+prev_id)
    var next = document.getElementById('book_container_'+id)

    prev.classList.toggle("invis")
    next.classList.toggle("invis")
}

function book_switch_vis(id) {  // switches tab visibility
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

function checkBookStatus(id) {
    if (spellbook.indexOf(id) == -1) {  // is in spellbook
        addToBook(id)
    } else {  // isn't in spellbook
        remove_from_book(id)
    }
}

function addToBook(id) {
    // check for settings and abort
    if (spellChar == 4) return

    var btn_char = document.getElementById("book_btn_" + id).children[0]

    if (spellbook.indexOf(id) == -1) {
        spellbook.push(id)
        btn_char.innerHTML = "Remove from Spellbook"
        document.getElementById(id+"_head3").children[0].innerHTML = "Quick Remove"
    } else {
        spellbook.splice(spellbook.indexOf(id), 1)
        btn_char.innerHTML = "Add to Spellbook"
        document.getElementById(id+"_head3").children[0].innerHTML = "Quick Add"
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
        var container = document.getElementById("bookContainer")
        var btn_char = document.getElementById("book_btn_" + id).children[0]
        btn_char.innerHTML = "Add to Spellbook"
        document.getElementById(id+"_head3").children[0].innerHTML = "Quick Add"
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

function updateCharName(id) {
    var char = document.getElementById("char"+id.slice(-1))
    var name = document.getElementById(id).value
    if (name == "") {
        name = "Char " + id.slice(-1)
    }
    char.children[0].innerHTML = name

    character.characters[id.slice(-1) - 1] = name
    update_storage()
}

function select_character(num) {
    // remove names with char select
    [...document.getElementsByClassName("char_select")].forEach(e => e.classList.toggle("char_select"))

    // select most recent character
    document.getElementById("charName"+num).classList.toggle("char_select")
}

function delete_prompt(close=false) {
    if (close) {
        var r = 0
        if (document.getElementById("delete_back").classList.contains('invis')) r = 1
        document.getElementById("delete_back").classList.add('invis')
        return r
    }
    document.getElementById("delete_back").classList.toggle("invis")
    document.getElementById("ch").innerHTML = [...document.getElementsByClassName("char_select")][0].value
}

function delete_character() {
    var ndx = parseInt([...document.getElementsByClassName("char_select")][0].id.slice(-1))-1
    var num = ndx + 1

    // delete from character variable
    character.characters[ndx] = "Char " + num
    character.classes[ndx] = 8
    character.levels[ndx] = 1
    character.books[ndx] = []
    character.prepped[ndx] = []
    character.slots[ndx] = [0,0,0,0,0,0,0,0,0]
    character.collapsed[ndx] = []

    // return visible names to default
    document.getElementById("charName"+num).value = "Char " + num
    document.getElementById("char" + num).children[0].innerHTML = "Char " + num

    // remove all present spells
    popEmptySpellbook(num)

    // close prompt
    delete_prompt()

    // delete from localStorage
    update_storage()
}

function makeBookRequest(book) {
    if (window.location.href.startsWith('http://127.0.0.1:8000/')) {
        url = 'http://127.0.0.1:8000/book-spells'
    } else {
        url = 'https://oyioi0suah.execute-api.us-east-1.amazonaws.com/default/book-spells'
    }

    makeHTTPPostRequest(url, handleSpellbookResponse, JSON.stringify({"book": book,"char": spellChar}))
}

function makeFilterRequest(fieldid, direction, filter){
    if (window.location.href == 'http://127.0.0.1:8000/') {
        url = 'http://127.0.0.1:8000/filter'
        loc = 'l'
    } else {
        url = 'https://qf5278sx80.execute-api.us-east-1.amazonaws.com/default/filter-spells'
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

    var spellBody = a_body_list.join("")
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
        <div class="quick_add" id="${spell.spellid+'_head3'}" onclick="checkBookStatus('${spell.spellid}'); event.stopPropagation()">
            <p class="spellDispDesc overflow" style="margin: auto;">${spellbook.indexOf(spell.spellid) != -1 ? "Quick Remove" : "Quick Add"}</p>
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

        <div class="spellToBook clickable invis add_book_hidden" id="book_btn_${spell.spellid}" onClick="checkBookStatus('${spell.spellid}')">
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

function popEmptySpellbook(char = spellChar) {
    var spells = document.getElementById("book_container_"+char)
    spells.innerHTML = `
<p class="book_head_text" style="margin: 20px auto 0px; width: 90%;">Open a spell and click "Add to Spellbook" to start your list of spells</p>
    `
}

function updateButtons() { // rewrite this
    var buttons = [...document.getElementsByClassName("spellToBook")]
    buttons.forEach(button => {
        var target = button.children[0]
        if (spellbook.indexOf(button.id.slice(9)) == -1) {
            target.innerHTML = "Add to Spellbook"
        } else {
            target.innerHTML = "Remove from Spellbook"
            document.getElementById(button.id.slice(9)+"_head3")
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

function vis_collapse(lvl, char = spellChar) {
    var container = document.getElementById(`container_${char}_${lvl}`)
    collapse(container)
    var arrow = document.getElementById(`arr_${char}_${lvl}`)
    arrow.classList.toggle("rot-right")
}

function save_collapsed() {
    character.collapsed[spellChar - 1] = [...col_heads]
    localStorage.setItem("collapsed", character.collapsed.join("+"))
}

function populateSpellbook(jsonResponse) {
    var data = JSON.parse(jsonResponse.srcElement.response)
    var char = data.char
    var spells = document.getElementById("book_container_"+char)
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
            <div class="slotContainer non_clickable" id="slot_container_${char}_${spell.level}" onclick="event.stopPropagation()"></div>
        </div>
        <div class="book_head_text">
            <svg id="arr_${char}_${spell.level}" class="arrow level_arrow rot-right" viewbox="0 0 28 20">
                <polygon points="6,0 6,20 23.324,10" style="fill:white;stroke-width:3" />
            </svg>
        </div>
    </div>
</div>
<div id="container_${char}_${spell.level}" class="level_container" collapsed="false">

</div>
            `
        }
        spell.spellid = spell.spellid + '_bk_' + char
        var spellBody = spellFormatBody(spell).replaceAll("spellDispDescExp", "book_spellDispDescExp")
        var spellHigher = spellFormatHigher(spell.higher_level)
        var book_con = document.getElementById(`container_${char}_${spell.level}`)
        book_con.innerHTML +=`
<div class="rowContainer">
    <div class="prep_spell clickable" id="${spell.spellid}_prep_${char}" onCLick="prepSpell(id)"></div>
    <div class="book_spell" id="${spell.spellid}">
        <div class="book_spell_container clickable" onClick="toggleBookSpellView('${spell.spellid}')">
            <div class="book_name" id="${spell.spellid}_name_${char}">
                <p class="book_spell_text overflow">${spell.name}</p>
            </div>
            <div class="book_action" id="${spell.spellid}_action_${char}">
                <p class="book_spell_text overflow">${spell.cast_time}</p>
            </div>
            <div class="book_conc" id="${spell.spellid}_conc_${char}">
                <p class="book_spell_text overflow">${spell.concentration ? "Concentration" : ""}</p>
            </div>
            <div class="book_conc"  id="${spell.spellid}_ritual_${char}">
                <p class="book_spell_text overflow">${spell.ritual ? "Ritual" : ""}</p>
            </div>
            <div class="book_close">
                <svg id="${spell.spellid}_tarrow_${char}" class="arrow" style="margin: 0px;margin-left: 10px;">
                    <polygon points="6,0 6,20 23.324,10" style="fill:white;stroke-width:3" />
                </svg>
            </div>
        </div>
        <div class="rowContainer">
            <div class="book_body" style="height: 0px" id="${spell.spellid}_body_${char}" collapsed="true">
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

            <div class="spellToBook_book clickable invis add_book_hidden_book" id="book_btn_${spell.spellid}_${char}" onClick="remove_from_book('${spell.spellid}')">
                <p class="textToBook">Remove from Spellbook</p>
            </div>
        </div>

        <div class="book_spell_container_bottom book_bottom book_bottom_margin clickable" onClick="toggleBookSpellView('${spell.spellid}')" id="${spell.spellid}_bottom_${char}">
            <div class="book_bottom_name">
                <p class="book_spell_text" style="white-space: nowrap;">${spell.name} - </p>
            </div>
            <div class="book_bottom_mid"></div>
            <div class="book_close book_close_bottom">
                <svg id="${spell.spellid}_barrow_${char}" class="arrow" style="margin: 0px; margin-left: 10px;">
                    <polygon points="6,0 6,20 23.324,10" style="fill:white;stroke-width:3" />
                </svg>
            </div>
        </div>
    </div>
</div>
<div class="h15"></div>
    `
    })
    updateSlotCount(char)
    updatePrepSpells(char)
    if (col_heads[0] != "") collapseHeads(char)
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
    // check for localStorage update stuff
    check_storage()

    //read from localStorage and write to 'character' class
    character.main = parseInt(localStorage.getItem("main"))
    spellChar = character.main
    if (spellChar >=4) spellChar = 1
    character.characters = localStorage.getItem("characters").split("+")
    character.classes = localStorage.getItem("classes").split("+")
    character.levels = localStorage.getItem("levels").split("+")
    var books = localStorage.getItem("books").split("+")
    var prepped = localStorage.getItem("prepped").split("+")
    var slots = localStorage.getItem("slots").split("+")
    var col_head = localStorage.getItem("collapsed").split("+")
    for (var i = 0; i < 3; i++) {
        character.books[i] = books[i].split(",")
        character.prepped[i] = [...prepped[i].split(",")]
        character.collapsed[i] = col_head[i].split(",")

        // remove blanks from prepped and collapsed
        if (character.prepped[i].indexOf("") != -1) character.prepped[i].splice(0,1)
        if (character.collapsed[i].indexOf("") != -1) character.collapsed[i].splice(0,1)

        // Make sure `slots` gets given `int`s
        var lst = slots[i].split(",") // slots
        var ints = lst.map(function(x) {
            return parseInt(x)
        })
        isNaN(ints[0]) ? character.slots[i] = [] : character.slots[i] = ints
    }

    // get current character and set book view to that character
    book_switch_view("char"+character.main)
    document.getElementById("book_container_"+character.main).classList.toggle("invis")

    // set character names on tabs
    for (var i = 1; i <= 3; i++) {
        document.getElementById("char"+i).children[0].innerHTML = character.characters[i-1]
        document.getElementById("charName"+i).value = character.characters[i-1]
    }

    // get current book, split into list of class and level
    var ndx = parseInt(character.main) - 1
    var clas = parseInt(character.classes[ndx])
    var level = character.levels[ndx]

    // set data gathered
    document.getElementById("classes").selectedIndex = clas
    document.getElementById("lvInput").value = level
    updateSpellSlots()

    load_all_books()
}

function load_all_books() {
    // save spellChar for later
    var save = spellChar

    // populate all 3 spellbooks
    for (var ndx = 0; ndx < 3; ndx++) {
        // set spellChar for loading into spellbook
        spellChar = ndx + 1

        // get needed variables from character
        var spells = character.books[ndx]
        var prep = character.prepped[ndx]
        var slots_list = character.slots[ndx]
        var col_head_list = character.collapsed[ndx]

        // set spellbook
        spellbook = spells

        // check for empty spellbook
        if (spellbook.indexOf("") != -1) spellbook.pop(0)


        // set prep list
        preplist = [...prep]

        // check for empty prep list
        if (preplist.indexOf("") != -1) preplist.pop(0)

        // set empty spellbook text if empty spellbook, or populate spellbook
        if (spellbook.length < 1) {
            popEmptySpellbook()
        } else {
            makeBookRequest(spellbook)

            // set collapsed heads list
            col_heads = [...col_head_list]

            // check for empty collapsed list
            if (col_heads.indexOf("") != -1) col_heads.splice(0,1)
        }
    }

    spellChar = save

    // update spellbook, prepped, slots, and collapsed
    spellbook = character.books[spellChar-1]
    preplist = [...character.prepped[spellChar-1]]
    slots_used = character.slots[spellChar-1]
    col_heads = [...character.collapsed[spellChar-1]]
}

function update_storage() {
    localStorage.setItem("main", character.main)
    localStorage.setItem("characters", character.characters.join("+"))
    localStorage.setItem("classes", character.classes.join("+"))
    localStorage.setItem("levels", character.levels.join("+"))
    localStorage.setItem("books", character.books.join("+"))
    localStorage.setItem("prepped", character.prepped.join("+"))
    localStorage.setItem("slots", character.slots.join("+"))
    localStorage.setItem("collapsed", character.collapsed.join("+"))
}

function updateBook() {
    // gets current character
    character.main = spellChar
    var ndx = spellChar - 1

    // gets character's class
    character.classes[ndx] = document.getElementById("classes").selectedIndex

    // gets character's level
    character.levels[ndx] = document.getElementById("lvInput").value

    // gets character's spellbook
    character.books[ndx] = spellbook

    // gets character's prep list
    character.prepped[ndx] = [...preplist]

    // update storage
    update_storage()
}

function readBook() {
    // gets current character
    spellChar = character.main
    var ndx = spellChar - 1

    // get spellbook
    spellbook = character.books[ndx]

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
    preplist = [...character.prepped[ndx]]

    // check for empty prep list
    if (preplist.indexOf("") != -1) preplist.pop(0)

    // get character data
    var clas = character.classes[ndx]
    var level = character.levels[ndx]

    // set data gathered
    document.getElementById("classes").selectedIndex = clas
    document.getElementById("lvInput").value = level
    updateSpellSlots()

    // get slots used
    slots_used = character.slots[ndx]

    // get collapsed headers
    col_heads = [...character.collapsed[ndx]]
}