from ilt.dal import mongodb
from ilt.managers.spellmgr import getspellscollection


artificer_list = [
    "Blink",
    "Continual Flame",
    "Freedom of Movement",
    "Animate Objects",
    "Chain Lightning",
    "Alter Self",
    "Create Food and Water",
    "Faerie Fire",
    "Blur",
    "Dispel Magic",
    "Enhance Ability",
    "Glyph of Warding",
    "Enlarge/Reduce",
    "Fire Bolt",
    "Greater Restoration",
    "Haste",
    "Mordenkainen's Faithful Hound",
    "False Life",
    "Guidance",
    "Acid Splash",
    "Cure Wounds",
    "Disguise Self",
    "Alarm",
    "Darkvision",
    "Fly",
    "Aid",
    "Grease",
    "Arcane Eye",
    "Arcane Lock",
    "Creation",
    "Dancing Lights",
    "Fabricate",
    "Call Lightning",
    "Detect Magic",
    "Greater Invisibility",
    "Protection from Poison",
    "Spare the Dying",
    "Wall of Stone",
    "Poison Spray",
    "Revivify",
    "Water Walk",
    "Invisibility",
    "Lesser Restoration",
    "Ray of Frost",
    "Rope Trick",
    "Stone Shape",
    "Mage Hand",
    "Jump",
    "Levitate",
    "Message",
    "Shocking Grasp",
    "Prestidigitation",
    "Mass Cure Wounds",
    "Purify Food and Drink",
    "Identify",
    "Light",
    "Sanctuary",
    "Mending",
    "Otiluke's Resilient Sphere",
    "Water Breathing",
    "Heat Metal",
    "Longstrider",
    "See Invisibility",
    "Magic Mouth",
    "Stoneskin",
    "Web",
    "Mordenkainen's Private Sanctum",
    "Spider Climb",
    "Lightning Bolt",
    "Magic Weapon",
    "Resistance",
    "Bigby's Hand",
    "Elemental Weapon",
    "Thorn Whip"
]


def add_artificer():
    col = getspellscollection()
    spells = [x for x in col.find(projection={'_id': False})]

    for spell in spells:
        if spell['name'] in artificer_list and "Artificer" not in spell['classes']:
            spell['classes'].append("Artificer")

        mongodb.getcollection("spells").replace_one({"spell_num": spell["spell_num"]}, spell, upsert=True)
