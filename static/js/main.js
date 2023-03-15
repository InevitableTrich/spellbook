var cur_page = 1
var max_pages = 0
var spells_per_page = 30
var spells_count = 0
var filter_state = {}
var current_filter = JSON.stringify({"filter": {}})
var search_query = ''
var sort_state = {
  0: '<svg class="sort_arrow" viewbox="0 0 10 10"><path fill="rgb(222, 222, 222)" d="M 2 4.5 l 0 1 l 6 0 l 0 -1 z"/></svg>',
  1: '<svg class="sort_arrow" viewbox="0 0 10 10"><path fill="rgb(222, 222, 222)" d="M 0 0 l 10 0 l -5 8.65 z"/></svg>',
  2: '<svg class="sort_arrow" viewbox="0 0 10 10"><path fill="rgb(222, 222, 222)" d="M 0 8.65 l 10 0 l -5 -8.65 z"/></svg>',
  "nameSort": "Spell Name: ",
  "levelSort": "Spell Level: "
}
var var_cycle = {
  "nameSort": 0,
  "levelSort": 0
}
var loading_svg = '<svg viewbox="0 0 10 10" class="loading_svg"><path fill="rgb(90,90,90)" d="M 4.5 1.5 Q 4.5 1 5 1 Q 5.5 1 5.5 1.5 L 5.5 2.5 Q 5.5 3 5 3 Q 4.5 3 4.5 2.5 Z"/><path fill="rgb(102,102,102)" d="M 7.183 2.2189 Q 7.433 1.7859 7 1.536 Q 6.567 1.2861 6.317 1.7171 L 5.817 2.5851 Q 5.567 3.0181 6 3.268 Q 6.433 3.518 6.683 3.0849 Z"/><path fill="rgb(114,114,114)" d="M 8.281 3.684 Q 8.714 3.434 8.464 3 Q 8.214 2.568 7.781 2.818 L 6.915 3.318 Q 6.482 3.568 6.732 4 Q 6.982 4.434 7.415 4.184 Z"/><path fill="rgb(126,126,126)" d="M 8.5 4.5 Q 9 4.5 9 5 Q 9 5.5 8.5 5.5 L 7.5 5.5 Q 7 5.5 7 5 Q 7 4.5 7.5 4.5 Z"/><path fill="rgb(138,138,138)" d="M 7.416 5.816 Q 6.983 5.567 6.733 6 Q 6.483 6.433 6.916 6.682 L 7.782 7.182 Q 8.215 7.432 8.464 7 Q 8.715 6.566 8.282 6.316 Z"/><path fill="rgb(150,150,150)" d="M 6.317 8.281 Q 6.567 8.714 7 8.464 Q 7.433 8.214 7.183 7.781 L 6.683 6.915 Q 6.433 6.482 6 6.732 Q 5.567 6.982 5.817 7.415 Z"/><path fill="rgb(162,162,162)" d="M 5.5 8.5 Q 5.5 9 5 9 Q 4.5 9 4.5 8.5 L 4.5 7.5 Q 4.5 7 5 7 Q 5.5 7 5.5 7.5 Z"/><path fill="rgb(174,174,174)" d="M 2.817 7.781 Q 2.567 8.214 3 8.464 Q 3.433 8.714 3.683 8.281 L 4.183 7.415 Q 4.433 6.982 4 6.732 Q 3.567 6.482 3.317 6.925 Z"/><path fill="rgb(186,186,186)" d="M 1.719 6.316 Q 1.286 6.566 1.536 7 Q 1.786 7.432 2.219 7.182 L 3.085 6.682 Q 3.518 6.432 3.268 6 Q 3.018 5.566 2.585 5.816 Z"/><path fill="rgb(198,198,198)" d="M 1.5 5.5 Q 1 5.5 1 5 Q 1 4.5 1.5 4.5 L 2.5 4.5 Q 3 4.5 3 5 Q 3 5.5 2.5 5.5 Z"/><path fill="rgb(210,210,210)" d="M 2.219 2.818 Q 1.786 2.568 1.536 3.0012 Q 1.286 3.434 1.719 3.684 L 2.585 4.184 Q 3.0183 4.434 3.286 4 Q 3.518 3.568 3.0845 3.318 Z"/><path fill="rgb(222,222,222)" d="M 3.683 1.719 Q 3.433 1.286 3 1.586 Q 2.567 1.786 2.817 2.219 L 3.317 3.085 Q 3.567 3.518 4 3.268 Q 4.433 3.0181 4.183 2.585 Z"/></svg>'

var spell_char = 1
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
        this.spec_names = [[],[],[]]
        this.spec_values = [[],[],[]]
    }
}
var character = new Spellbook_Data()

function check_mobile() {
    var mobile = navigator.userAgent.toLowerCase().match(/mobile/i)
    if (mobile) {
        location.href.endsWith("/") ? location.href += "mobile" : location.href += "/mobile"
    }
}

function toggle_spell_view(cName) {
    var current = document.getElementById(cName + "_body")

    if (current.getAttribute("collapsed") === 'true') {
        setTimeout(function(){
            document.getElementById("book_btn_" + cName).classList.toggle("invis")
            setTimeout(function(){
                document.getElementById("book_btn_" + cName).classList.toggle("add_book_hidden")
            }, 20);
        }, 300);
        toggle_view_main(cName, current)
    } else {
        document.getElementById("book_btn_" + cName).classList.toggle("add_book_hidden")
        setTimeout(function(){
            document.getElementById("book_btn_" + cName).classList.toggle("invis")
            toggle_view_main(cName, current)
        }, 200);
    }
}
function toggle_view_main(cName, current) {
    collapse(current)
    suffix = ["head0", "head1", "head2", "head3", "bottom", "tarrow", "barrow"]
    rclass = ["widen", "invis", "invis", "invis", "bottom_exp", "rot-right", "rot-left"]
    for (var i = 0; i < suffix.length; i++) {
        current = document.getElementById(cName + "_" + suffix[i]);
        current.classList.toggle(rclass[i])
    }
}

function toggle_book_spell_view(cName) {
    var current = document.getElementById(cName + "_body" + "_" + spell_char)

    if (current.getAttribute("collapsed") === 'true') {
        setTimeout(function(){
            document.getElementById("book_btn_" + cName + "_" + spell_char).classList.toggle("invis")
            setTimeout(function(){
                document.getElementById("book_btn_" + cName + "_" + spell_char).classList.toggle("add_book_hidden_book")
            }, 20);
        }, 300);
        toggle_view_book(current, cName)
    } else {
        document.getElementById("book_btn_" + cName + "_" + spell_char).classList.toggle("add_book_hidden_book")
        setTimeout(function(){
            document.getElementById("book_btn_" + cName + "_" + spell_char).classList.toggle("invis")
            toggle_view_book(current, cName)
        }, 200);
    }
}
function toggle_view_book(current, cName){
    collapse(current)
    var suffix = ["bottom", "tarrow", "barrow", "action", "conc", "ritual", "name"]
    var rclass = ["book_bottom_exp", "rot-right", "rot-left", "invis", "invis", "invis", "book_widen"]
    for (var i = 0; i < suffix.length; i++) {
        current = document.getElementById(cName + "_" + suffix[i] + "_" + spell_char)
        current.classList.toggle(rclass[i])
    }
}

function collapse(element, height = 0) {
    var isCollapsed = element.getAttribute('collapsed') === 'true';
    if(isCollapsed) {
        expand_section(element)
        element.setAttribute('collapsed', 'false')
    } else {
        collapse_section(element, height)
    }
}

function collapse_section(element, height = 0) {
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

function expand_section(element) {
    var sectionHeight = element.scrollHeight;
    element.style.height = sectionHeight + 'px';

    element.addEventListener('transitionend', function(e) {
        element.removeEventListener('transitionend', arguments.callee);
        element.style.height = null;
    });

    element.setAttribute('collapsed', 'false');
}

function cycle_sort(id){
    var_cycle[id] += 1
    if (var_cycle[id] > 2) var_cycle[id] = 0
    document.getElementById(id).innerHTML = sort_state[id] + sort_state[var_cycle[id]]

    if (var_cycle[id] == 0) {
        make_filter_request('nameSort', 0, current_filter)
    } else {
        make_filter_request(id, var_cycle[id], current_filter)
    }

    for([key] of Object.entries(var_cycle)){
        if (key != id){
            var_cycle[key] = 0
            document.getElementById(key).innerHTML = sort_state[key] + sort_state[var_cycle[key]]
        }
    }
}

function page_change(inc) {
    cur_page += inc
    if (cur_page < 1) cur_page = max_pages
    else if (max_pages == 0) cur_page = 1
    else if (cur_page > max_pages) cur_page = 1
    document.getElementById("pageTxt").innerHTML = "Page " + cur_page
    document.getElementById("spellList").innerHTML = loading_svg
    sort = find_sort()
    make_filter_request(sort, var_cycle[sort], current_filter)
}

function reset_page() {
    page_one()
    sort = find_sort()
    make_filter_request(sort, var_cycle[sort], current_filter)
}

function page_one() {
    cur_page = 1
    document.getElementById("pageTxt").innerHTML = "Page " + cur_page
    scroll_to_top()
}

function scroll_to_top() {
    window.scrollBy({top: -(window.scrollY), left: 0, behavior: 'smooth'})
}

document.addEventListener('keydown', function(event) {
    if(event.key == 'Escape') {
        var r = delete_prompt(close=true)
        if (r > 0) toggle_book(close=true)
    } else if (event.key == 'b' && document.activeElement.nodeName != 'INPUT' && document.getElementById('delete_back').classList.contains('invis')) {
        toggle_book()
    } else if (event.key == 'c' && document.activeElement.nodeName != 'INPUT' && !document.getElementById('bookCon').classList.contains('invis')) {
        document.getElementById('book_char_spec_tab').classList.toggle('book_char_spec_tab_out')
    } else if ((event.key == '1' || event.key == '2' || event.key == '3' || event.key == '4') && document.activeElement.nodeName != 'INPUT' && !document.getElementById('bookCon').classList.contains('invis')) {
        book_switch_view(event.key)
    }
});

function toggle_book(close=false) {
    if (close) {
        document.getElementById("bookCon").classList.add('invis')
        return
    }
    document.getElementById("bookCon").classList.toggle('invis')
}

function search(query){
    if (query != "") search_query = "\"" + query + "\""
    else search_query = ""
    sort = find_sort()
    reset_page()
    make_filter_request(sort, var_cycle[sort], current_filter)
}

function sort_toggle(id, field){
    filterKey = get_filter_IDs(id, field)

    if (filter_state[field]) {
        if (filter_state[field].includes(filterKey)) {
            var index = filter_state[field].indexOf(filterKey)
            if (index !== -1) {
              filter_state[field].splice(index, 1);
            }
            if (filter_state[field].length == 0) {
              delete filter_state[field]
            }
        } else {
            filter_state[field].push(filterKey)
        }
    } else {
        filter_state[field] = [filterKey]
    }
    current_filter = "{\"filter\": " + JSON.stringify(filter_state) + "}"

    toggle = document.getElementById(id)
    toggle.classList.toggle("sortSelected")
    toggle = document.getElementById("_" + id)
    toggle.classList.toggle("sortSelectedTxt")

    if (field == "classes") {
        get_subs(id)
    }

    page_one()
    sort = find_sort()
    make_filter_request(sort, var_cycle[sort], current_filter)
}

function get_filter_IDs(id, field) {
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
            "ftod": "Fizban's Treasury of Dragons",
            "kwalish": "Lost Laboratory of Kwalish",
            "strix": "Strixhaven: a Curriculum of Chaos",
            "srd": "Standard Reference Document"
        }
        tID = sources[id]
    } else {
        console.log("Key Error in Filters")
    }

    return tID
}

function find_sort(){
    for([key] of Object.entries(var_cycle)){
        if (var_cycle[key] != 0) return key
    }
    return 'nameSort'
}

class Subclass_List {
    constructor(subclass_names) {
        this.enabled = false
        this.subclass_names = [...subclass_names]
    }
}

var artificer = new Subclass_List(["alchemist", "armorer", "artillerist", "battle smith"])
var bard = new Subclass_List(["glamour"])
var cleric = new Subclass_List(["arcana", "death", "forge", "grave", "knowledge", "life", "light", "nature", "order",
                           "peace", "trickery", "twilight", "war"])
var druid = new Subclass_List(["arctic", "coast", "desert", "forest", "mountain", "spores", "stars", "swamp",
                          "underdark", "wildfire"])
var monk = new Subclass_List(["four elements", "shadow", "sun soul"])
var paladin = new Subclass_List(["ancients", "conquest", "crown", "devotion", "glory", "oathbreaker", "redemption",
                            "vengeance", "watchers"])
var ranger = new Subclass_List(["fey wanderer", "gloom stalker", "horizon walker", "monster slayer", "swarmkeeper"])
var sorcerer = new Subclass_List(["aberrant mind", "clockwork soul", "divine soul"])
var warlock = new Subclass_List(["archfey", "celestial", "fathomless", "fiend", "genie - djinni", "genie - efreeti",
                            "genie - marid", "great old one", "hexblade", "undying"])
var wizard = new Subclass_List(["chronurgy", "graviturgy"])
var subclass_lists = {
    'artificer': artificer,
    'bard': bard,
    'cleric': cleric,
    'druid': druid,
    'monk': monk,
    'paladin': paladin,
    'ranger': ranger,
    'sorcerer': sorcerer,
    'warlock': warlock,
    'wizard': wizard
}
var visible_subclasses = []

function get_subs(class_name) {

    clear_subs(class_name)

    var capitalized_class = class_name.charAt(0).toUpperCase() + class_name.slice(1)
    if (!subclass_lists[class_name].enabled) {
        subclass_lists[class_name].subclass_names.forEach(sub => {
            var sub_no_spaces = sub.replaceAll(" ", "_")
            var id = `${class_name}_${sub_no_spaces}`
            var capitalized_sub = sub.split(" ").map(function(word){return word[0].toUpperCase() + word.substr(1)}).join(" ")
            visible_subclasses.push(
                `<div class="rowContainer"><div class="classItem" id=${id} onclick="sort_toggle(id, 'subs')"><p class="ciTxt" id=${`_${id}`}>${capitalized_class} (${capitalized_sub})</p></div>`
            )
        });
        subclass_lists[class_name].enabled = true
    } else {
        subclass_lists[class_name].subclass_names.forEach(sub => {
            var sub_no_spaces = sub.replaceAll(" ", "_")
            var id = `${class_name}_${sub_no_spaces}`
            var capitalized_sub = sub.split(" ").map(function(word){return word[0].toUpperCase() + word.substr(1)}).join(" ")
            var ndx = visible_subclasses.indexOf(
                `<div class="rowContainer"><div class="classItem" id=${id} onclick="sort_toggle(id, 'subs')"><p class="ciTxt" id=${`_${id}`}>${capitalized_class} (${capitalized_sub})</p></div>`
            )
            visible_subclasses = visible_subclasses.slice(0,ndx).concat(visible_subclasses.slice(ndx+1))
        });
        subclass_lists[class_name].enabled = false
    }

    visible_subclasses.sort()
    if (visible_subclasses.length > 0) {
        var subs_string = visible_subclasses.join('<p class="ciComma">,</p></div>') + "</div>"
        document.querySelector("#subs_con").innerHTML = subs_string
        if (document.getElementById("add_subclass_spells") == null) document.getElementById("subclasses").innerHTML += `
            <div id="add_subclass_spells" class="clickable" onclick="add_subclass_spells()">
                <p class="add_subs_text">Add Subclass Spells to Book</p>
            </div>
            `
    } else {
        document.querySelector("#subs_con").innerHTML = `<p id="subs" class="ciTxt" style="margin-bottom: 12px;">Select a Class for available Subclasses to appear.</p>`
        document.getElementById("add_subclass_spells").remove()
    }
}

function clear_subs(class_name){
    delete filter_state["subs"]
    current_filter = "{\"filter\": " + JSON.stringify(filter_state) + "}"
}

function add_subclass_spells() {
    if (filter_state['subs'] == undefined) return

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

    filter_state['subs'].forEach(sub => {
        var chosen_spells = subclass_spells[sub]
        chosen_spells.forEach(spell => {
            if (spellbook.indexOf(spell) == -1) to_format.push(spell)
        })
    })

    to_format.forEach(spell => {
        spell = spell.toLowerCase().replaceAll(" ", "-")
        spellbook.push(spell)
    })

    make_book_request(spellbook)
}

function clear_filters(){
    [...document.getElementsByClassName("sortSelected")].forEach(e => {
        e.classList.toggle("sortSelected")
        e.children[0].classList.toggle("sortSelectedTxt")
    })

    document.getElementById("subs_con").innerHTML = `<p id="subs" class="ciTxt" style="margin-bottom: 12px;">Select a Class for available Subclasses to appear.</p>`
    try {document.getElementById("add_subclass_spells").remove()} catch(e){}
    for([key] of Object.entries(subclass_lists)){
        subclass_lists[key].enabled = false
    }

    visible_subclasses = []

    if (!document.getElementById("ef_top").classList.contains("shrink")) {
        toggle_filter()
    }

    current_filter = JSON.stringify({"filter": {}})
    filter_state = {}

    for([key] of Object.entries(var_cycle)){
        var_cycle[key] = 0
        document.getElementById(key).innerHTML = sort_state[key] + sort_state[var_cycle[key]]
    }

    searchBar = document.getElementById('search')
    searchBar.value = ""
    search_query = ''
    reset_page()
    make_filter_request('nameSort', 0, current_filter)
}

function update_spell_slots() {
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
        "warlock": [[1], [2], [0, 2], [0, 2], [0, 0, 2], [0, 0, 2], [0, 0, 0, 2], [0, 0, 0, 2], [0, 0, 0, 0, 2], [0, 0, 0, 0, 2], [0, 0, 0, 0, 3], [0, 0, 0, 0, 3], [0, 0, 0, 0, 3], [0, 0, 0, 0, 3], [0, 0, 0, 0, 3], [0, 0, 0, 0, 3], [0, 0, 0, 0, 4], [0, 0, 0, 0, 4], [0, 0, 0, 0, 4], [0, 0, 0, 0, 4]]
    }


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
    update_slot_count()
}

function update_slot_count(char = spell_char) {
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
        read_used_slots(char, heads)
    }
    catch (e) {}
}

function use_slot(level, place) {
    var container = document.getElementById(`slot_container_${spell_char}_${level}`)
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

function read_used_slots(char, heads) {
    slots_used.forEach((used, index) => {
        var ndx = index + 1
        if (heads.indexOf(ndx.toString()) == -1) return
        var slot_list = document.getElementById(`slot_container_${char}_${ndx}`).children

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
    character.slots[spell_char-1] = [0, 0, 0, 0, 0, 0, 0 ,0 , 0]

    // remove from local storage
    localStorage.slots = character.slots.join("+")
}

function prep_spell(id) {
    var current = document.getElementById(id)
    current.classList.toggle("prepped")

    name = id.slice(0,-12)
    if (preplist.indexOf(name) == -1) {
        preplist.push(name)
    } else {
        preplist.splice(preplist.indexOf(name), 1)
    }
    update_book()
}

function update_prep_spells(char) {
    character.prepped[char-1].forEach(spell => {
        var current = document.getElementById(spell+"_bk_"+char+"_prep_"+char)
        current.classList.toggle("prepped")
    })
}

function collapse_heads(char) {
    character.collapsed[char-1].forEach(head => {
        vis_collapse(head, char)
    })
}

function book_switch_view(id) {
    var num = parseInt(id.slice(-1))
    var prev = spell_char

    if (num == prev && num == 4) return

    spell_char = num
    if (num <= 3) {  // if character tab:
        // update spell_char
        character.main = spell_char

        // update spellbook var
        spellbook = character.books[spell_char-1]

        // read char info
        var ndx = spell_char - 1
        var clas = parseInt(character.classes[ndx])
        var level = character.levels[ndx]

        // set char info
        document.getElementById("classes").selectedIndex = clas
        document.getElementById("lvInput").value = level
        update_char_spec_tab(clas)

        // check used slots
        slots_used = character.slots[ndx]
        update_spell_slots()

        // get prepped spells
        preplist = [...character.prepped[ndx]]

        // update buttons on main spells
        update_buttons()

        // save
        update_storage()
    } else {  // settings
        // remove names with char select
        [...document.getElementsByClassName("char_select")].forEach(e => e.classList.toggle("char_select"))

        // select most recent character
        document.getElementById("charName"+prev).classList.toggle("char_select")
        // set char spec names
        update_settings_char_spec_names(prev)
    }

    book_switch_vis(num, prev) // tabs
    book_switch_main(num, prev)  // main container
}

function book_switch_main(id, prev_id) {  // switches main page visibility
    var prev = document.getElementById('book_container_'+prev_id)
    var next = document.getElementById('book_container_'+id)

    prev.classList.toggle("invis")
    next.classList.toggle("invis")
}

function book_switch_vis(num, prev) {  // switches tab visibility
    var prev = document.getElementById("char"+prev)
    var next = document.getElementById("char"+num)

    prev.classList.toggle("book_char_exp")
    next.classList.toggle("book_char_exp")
}

function check_book_status(id, event) {
    // check for settings and abort
    if (spell_char == 4) {
        settings_popup(event)
        return
    }

    if (spellbook.indexOf(id) == -1) {  // is in spellbook
        add_to_book(id)
    } else {  // isn't in spellbook
        remove_from_book(id)
    }
}

function settings_popup(event) {
    var popup = document.getElementById("settings_popup")
    popup.classList.remove("zero_opacity")

    var pos_x = event.pageX - popup.clientWidth
    var pos_y = event.pageY - popup.clientHeight

    popup.style.left = pos_x + 'px'
    popup.style.top = pos_y + 'px'
    popup.classList.add("zero_opacity")
}

function add_to_book(id) {
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

    update_book()

    if (spellbook.length == 0) {
        pop_empty_spellbook()
    } else {
        make_book_request(spellbook)
    }
}

function remove_from_book(id) {
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

    update_book()

    if (spellbook.length == 0) {
        pop_empty_spellbook()
    } else {
        // remove spell
        var book_spell = document.getElementById(id + '_bk_' + spell_char)  // spell
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

function update_char_name(id) {  // update name on tabs
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

    // update class/level/slots
    document.getElementById("classes").selectedIndex = character.classes[num-1]
    document.getElementById("lvInput").value = character.levels[num-1]
    update_spell_slots()


    // load counter names + values to sidebar
    update_char_spec_tab(character.classes[num-1], `${num}`)
    //load counter names to settings page
    update_settings_char_spec_names(num)
}

function update_settings_char_spec_names(num) {
    var class_name = document.getElementById("classes")[character.classes[parseInt(num)-1]].innerHTML
    for (var i = 0; i < 4; i++){
        if (character.spec_names[num-1][i] == "") {
            document.getElementById("counter_name_"+(i+1)).value = counter_name_defaults[class_name][i]
        } else {
            document.getElementById("counter_name_"+(i+1)).value = character.spec_names[num-1][i]
        }
        document.getElementById("counter_name_"+(i+1)).placeholder = counter_name_defaults[class_name][i]
    }
}

function save_char_spec_names(num) {
    var name = document.getElementById("counter_name_"+num)

    if (name.value == "") {
        document.getElementById("count_"+num+"_text").innerHTML = name.placeholder
    } else {
        document.getElementById("count_"+num+"_text").innerHTML = name.value
    }

    var char = parseInt([...document.getElementsByClassName("char_select")][0].id.slice(-1))
    var names = []
    for (var i = 0; i < 4; i++) {
        names.push(document.getElementById("counter_name_"+(i+1)).value)
    }

    character.spec_names[char-1] = names
    localStorage.setItem("spec_names", character.spec_names.join("+"))
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
    var class_name = document.getElementById("classes")[character.classes[ndx]].innerHTML

    // delete from character variable
    character.characters[ndx] = "Char " + num
    character.classes[ndx] = 8
    character.levels[ndx] = 1
    character.books[ndx] = []
    character.prepped[ndx] = []
    character.slots[ndx] = [0,0,0,0,0,0,0,0,0]
    character.collapsed[ndx] = []
    character.spec_names[ndx] = ["","","",""]
    character.spec_values[ndx] = ["","","",""]

    // return visible names to default
    document.getElementById("charName"+num).value = "Char " + num
    document.getElementById("char" + num).children[0].innerHTML = "Char " + num

    // return counter names + values to default
    for(var i = 1; i <= 4; i++) {
        document.getElementById("count_"+i+"_text").innerHTML = counter_name_defaults[class_name][i-1]
        document.getElementById("counter_name_"+i).value = counter_name_defaults[class_name][i-1]
        document.getElementById("count_"+i).value = 0
    }

    // remove all present spells
    pop_empty_spellbook(num)

    // close prompt
    delete_prompt()

    // delete from localStorage
    update_storage()
}

function make_book_request(book) {
    if (window.location.href.startsWith('http://127.0.0.1:8000/')) {
        url = 'http://127.0.0.1:8000/book-spells'
    } else {
        url = 'https://oyioi0suah.execute-api.us-east-1.amazonaws.com/default/book-spells'
    }

    document.getElementById("book_container_"+spell_char).innerHTML = loading_svg
    make_HTTP_post_request(url, handle_spellbook_response, JSON.stringify({"book": book,"char": spell_char}))
}

function make_filter_request(fieldid, direction, filter){
    if (window.location.href.startsWith('http://127.0.0.1:8000/')) {
        url = 'http://127.0.0.1:8000/filter'
        loc = 'l'
    } else {
        url = 'https://qf5278sx80.execute-api.us-east-1.amazonaws.com/default/filter-spells'
        loc = 's'
    }

    document.getElementById("spellList").innerHTML = loading_svg
    make_HTTP_post_request(url+'?pagenum='+cur_page+'&spellsperpage='+spells_per_page+'&field='+fieldid+'&direction='+direction+'&searchquery='+search_query+'&loc='+loc, handle_spells_response, filter);
}

function toggle_filter(){
    var top = document.getElementById('ef_top')
    var text = document.getElementById('ef_top').children[0]
    var body = document.getElementById('ef_body')
    isCollapsed = body.getAttribute('collapsed') === 'true';

    top.classList.toggle('shrink')
    if (isCollapsed) {
        text.innerHTML = 'Shrink Filter Options'
        body.setAttribute('collapsed', 'false')
        expand_section(body)
    } else {
        text.innerHTML = 'Expand Filter Options'
        body.setAttribute('collapsed', 'true')
        collapse_section(body)
        filters = ["class", "level", "school", "source", "subclass", "action", "concentration", "ritual"]
        filters.forEach(id => {
            if (document.getElementById(id + "_ops").getAttribute('collapsed') === 'false') {
                cycle_list(id)
            }
        });
    }
}

function cycle_list(dID){  // toggle filter sections
    var ops = dID + "_ops"
    var current = document.getElementById(ops)
    collapse(current)
    var arrow = document.getElementById(dID + "_arr")

    arrow.classList.toggle("rot-right")
    isCollapsed = arrow.getAttribute('collapsed') === 'true'
    if (!isCollapsed) {
        arrow.setAttribute('collapsed', 'true')
    } else {
        arrow.setAttribute('collapsed', 'false')
    }
}

counter_name_defaults = {
    "Artificer": ["Prepared", "Tinkering", "Infusions", "Flash"],
    "Bard": ["Prepared", "Inspiration", "Extra 1", "Extra 2"],
    "Cleric": ["Prepared", "Divinity", "Extra 1", "Extra 2"],
    "Druid": ["Prepared", "Wild Shape", "Extra 1", "Extra 2"],
    "Monk": ["Ki", "Extra 1", "Extra 2", "Extra 3"],
    "Paladin": ["Prepared", "Lay on Hands", "Extra 1", "Extra 2"],
    "Ranger": ["Known", "Extra 1", "Extra 2", "Extra 3"],
    "Sorcerer": ["Known", "Points", "Extra 1", "Extra 2"],
    "Warlock": ["Known", "Extra 1", "Extra 2", "Extra 3"],
    "Wizard": ["Prepared", "Extra 1", "Extra 2", "Extra 3"]
}
function update_char_spec_tab(ndx, char=spell_char) {
    if (char == 4) char = parseInt([...document.getElementsByClassName("char_select")][0].id.slice(-1))
    var class_name = document.getElementById("classes")[ndx].innerHTML
    document.getElementById("book_char_spec_text").innerHTML = "Open " + class_name + " Counters"

    for (var i = 0; i < 4; i++) {
        if (character.spec_names[char-1][i] == "") {
            document.getElementById("count_"+(i+1)+"_text").innerHTML = counter_name_defaults[class_name][i]
        } else {
            document.getElementById("count_"+(i+1)+"_text").innerHTML = character.spec_names[char-1][i]
        }
        if (character.spec_values[char-1][i] == ""){
            document.getElementById("count_"+(i+1)).value = 0
        } else {
            document.getElementById("count_"+(i+1)).value = character.spec_values[char-1][i]
        }
    }
}

function update_class_values(char = spell_char) {
    if (spell_char == 4) char = parseInt([...document.getElementsByClassName("char_select")][0].id.slice(-1))
    var values = []
    for (var i = 1; i <= 4; i++) values.push(document.getElementById("count_"+(i)).value)
    character.spec_values[char-1] = [...values]
    localStorage.setItem("spec_values", character.spec_values.join("+"))
}

function spell_format_higher(high) {
    var higher = high != "" ? typeof(high) == "string" ? "At Higher Levels. " + high : "At Higher Levels. " + high.join("<BR/> &emsp;&emsp;") : ""
    higher = "<bi>" + higher.slice(0,higher.indexOf(".")+1) + "</bi>" + higher.slice(higher.indexOf(".")+1,)
    return higher
}

function spell_format_body(spell) {
    var spellBody = []
    if (spell.desc.join().indexOf("#") > 0) {
        spellBody = desc_bold(spell.desc)
    } else {
        spellBody = spell.desc
    }
    if (spell.desc.join().indexOf("*") > 0) {
        spellBody = desc_style(spellBody)
    }

    if (spellBody.join().indexOf("|") > 0) {
        spellBody = desc_table(spellBody)
    } else {
        spellBody = `<p class="spellDispDescExp">${spellBody.join("<BR/> &emsp;&emsp;")}</p>`
    }

    spellBody = spellBody.replaceAll("&emsp;&emsp;&emsp;&emsp;","&emsp;&emsp;")

    return spellBody
}

function desc_bold(desc) {
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

function desc_style(desc) {
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

function desc_table(body) {
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

function populate_spells(jsonResponse) {
    var data = JSON.parse(jsonResponse.srcElement.response)
    spells = document.getElementById("spellList")
    spells.innerHTML = ''
    spells_count = data.spellscount
    max_pages = Math.ceil(spells_count/spells_per_page)
    data.spells.forEach(spell => {
        var spellBody = spell_format_body(spell)
        var spellHigher = spell_format_higher(spell.higher_level)
        spells.innerHTML +=`
<div id="${spell.spellid}">
    <div class="h20"></div>
    <div class="spellContainer spellHeight" onClick="toggle_spell_view('${spell.spellid}')" id="${spell.spellid+'_top'}">
        <div class="name" id="${spell.spellid+'_head0'}">
            <p class="spellName overflow"> ${spell.name} - </p>
        </div>
        <div class="level" id="${spell.spellid+'_head1'}">
            <p class="spellDispDesc overflow hCentered">${spell.level}</p>
        </div>
        <div class="classes" id="${spell.spellid+'_head2'}">
            <p class="spellDispDesc overflow">${spell.classes[0] ? spell.subclasses ? spell.classes.sort().join(", ") + ", " + spell.subclasses.sort().join(", ") : spell.classes.sort().join(", ") : spell.subclasses.sort().join(", ")}</p>
        </div>
        <div class="quick_add" id="${spell.spellid+'_head3'}" onclick="check_book_status('${spell.spellid}', event); event.stopPropagation()">
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
            <p class="spellDispDescExp"><b>Casting Time:</b> ${typeof(spell.cast_time) == "string" ? spell.cast_time : spell.cast_time.join(", ")}</p>
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

        <div class="spellToBook clickable invis add_book_hidden" id="book_btn_${spell.spellid}" onClick="check_book_status('${spell.spellid}', event)">
            <p class="textToBook">${spellbook.indexOf(spell.spellid) != -1 ? "Remove from Spellbook" : "Add to Spellbook"}</p>
        </div>
    </div>
    <div class="rowContainer bottom bottom_margin" onClick="toggle_spell_view('${spell.spellid}')" id="${spell.spellid+'_bottom'}">
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

function pop_empty_spellbook(char = spell_char) {
    var spells = document.getElementById("book_container_"+char)
    spells.innerHTML = `
        <p class="book_head_text" style="margin: 20px auto 0px; width: 90%;">Open a spell and click "Add to Spellbook" to start your list of spells.</p>
    `
}

function update_buttons() {
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

function vis_collapse(lvl, char = spell_char) {
    var container = document.getElementById(`container_${char}_${lvl}`)
    collapse(container)
    var arrow = document.getElementById(`arr_${char}_${lvl}`)
    arrow.classList.toggle("rot-right")
}

function save_collapsed() {
    character.collapsed[spell_char - 1] = [...col_heads]
    localStorage.setItem("collapsed", character.collapsed.join("+"))
}

function populate_spellbook(jsonResponse) {
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
        var spellBody = spell_format_body(spell).replaceAll("spellDispDescExp", "book_spellDispDescExp")
        var spellHigher = spell_format_higher(spell.higher_level)
        var book_con = document.getElementById(`container_${char}_${spell.level}`)
        book_con.innerHTML +=`
<div class="rowContainer">
    <div class="prep_spell clickable" id="${spell.spellid}_prep_${char}" onCLick="prep_spell(id)"></div>
    <div class="book_spell" id="${spell.spellid}">
        <div class="book_spell_container clickable" onClick="toggle_book_spell_view('${spell.spellid}')">
            <div class="book_name" id="${spell.spellid}_name_${char}">
                <p class="book_spell_text overflow">${spell.name}</p>
            </div>
            <div class="book_action" id="${spell.spellid}_action_${char}">
                <p class="book_spell_text overflow">${typeof(spell.cast_time) == "string" ? spell.cast_time : spell.cast_time[0]}</p>
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
                <p class="book_spellDispDescExp"><b>Casting Time:</b> ${typeof(spell.cast_time) == "string" ? spell.cast_time : spell.cast_time.join(", ")}</p>
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

        <div class="book_spell_container_bottom book_bottom book_bottom_margin clickable" onClick="toggle_book_spell_view('${spell.spellid}')" id="${spell.spellid}_bottom_${char}">
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
    update_slot_count(char)
    update_prep_spells(char)
    if (col_heads[0] != "") collapse_heads(char)
}

function make_HTTP_post_request(url, callback, data) {
    objXMLHttp=new XMLHttpRequest()
    objXMLHttp.onreadystatechange = callback
    objXMLHttp.open("POST", url)
    objXMLHttp.setRequestHeader("Content-Type", "application/json");
    objXMLHttp.send(data)
}

function handle_spells_response(data) {
    if (this.readyState == 4 && this.status == 200){
        populate_spells(data)
    }
}

function handle_spellbook_response(data) {
    if (this.readyState == 4 && this.status == 200){
        populate_spellbook(data)
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
        "collapsed", // 8
        "spec_names", // 9
        "spec_values" // 10
    ]
    var values = [
        "1", // 1
        "Char 1+Char 2+Char 3", // 2
        "8+8+8", // 3
        "1+1+1", // 4
        "++", // 5
        "++", // 6
        "0,0,0,0,0,0,0,0,0+0,0,0,0,0,0,0,0,0+0,0,0,0,0,0,0,0,0", // 7
        "++", // 8
        ",,,+,,,+,,,", // 9
        ",,,+,,,+,,," // 10
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
    spell_char = character.main
    if (spell_char >=4) spell_char = 1
    character.characters = localStorage.getItem("characters").split("+")
    character.classes = localStorage.getItem("classes").split("+")
    character.levels = localStorage.getItem("levels").split("+")
    var books = localStorage.getItem("books").split("+")
    var prepped = localStorage.getItem("prepped").split("+")
    var slots = localStorage.getItem("slots").split("+")
    var col_head = localStorage.getItem("collapsed").split("+")
    var spec_names = localStorage.getItem("spec_names").split("+")
    var spec_values = localStorage.getItem("spec_values").split("+")
    for (var i = 0; i < 3; i++) {
        character.books[i] = books[i].split(",")
        character.prepped[i] = [...prepped[i].split(",")]
        character.collapsed[i] = col_head[i].split(",")
        character.spec_names[i] = spec_names[i].split(",")
        character.spec_values[i] = spec_values[i].split(",")

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
    document.getElementById("char"+character.main).classList.toggle("book_char_exp")

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
    update_char_spec_tab(clas)
    update_settings_char_spec_names(ndx+1, ndx+1)

    load_all_books()
}

function load_all_books() {
    // save spell_char for later
    var save = spell_char

    // populate all 3 spellbooks
    for (var ndx = 0; ndx < 3; ndx++) {
        // set spell_char for loading into spellbook
        spell_char = ndx + 1

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
            pop_empty_spellbook()
        } else {
            make_book_request(spellbook)

            // set collapsed heads list
            col_heads = [...col_head_list]

            // check for empty collapsed list
            if (col_heads.indexOf("") != -1) col_heads.splice(0,1)
        }
    }

    spell_char = save

    // update spellbook, prepped, slots, and collapsed
    spellbook = character.books[spell_char-1]
    preplist = [...character.prepped[spell_char-1]]
    slots_used = character.slots[spell_char-1]
    col_heads = [...character.collapsed[spell_char-1]]
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
    localStorage.setItem("spec_names", character.spec_names.join("+"))
    localStorage.setItem("spec_values", character.spec_values.join("+"))
}

function update_book(char = spell_char) {
    // gets current character
    if (char == 4) char = parseInt([...document.getElementsByClassName("char_select")][0].id.slice(-1))
    character.main = char
    var ndx = char - 1

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