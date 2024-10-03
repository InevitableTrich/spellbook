from ilt.dal import mongodb
from ilt.managers.spellmgr import getspellscollection

subclasses = {
    "Artificer (Alchemist)": [
        "Healing Word",
        "Ray of Sickness",
        "Flaming Sphere",
        "Melf\'s Acid Arrow",
        "Gaseous Form",
        "Mass Healing Word",
        "Blight",
        "Death Ward",
        "Cloudkill",
        "Raise Dead"
    ],
    "Artificer (Armorer)": [
        "Magic Missile",
        "Thunderwave",
        "Mirror Image",
        "Shatter",
        "Hypnotic Pattern",
        "Lightning Bolt",
        "Fire Shield",
        "Greater Invisibility",
        "Passwall",
        "Wall of Force"
    ],
    "Artificer (Artillerist)": [
        "Shield",
        "Thunderwave",
        "Scorching Ray",
        "Shatter",
        "Fireball",
        "Wind Wall",
        "Ice Storm",
        "Wall of Fire",
        "Cone of Cold",
        "Wall of Force"
    ],
    "Artificer (Battle Smith)": [
        "Heroism",
        "Shield",
        "Branding Smite",
        "Warding Bond",
        "Aura of Vitality",
        "Conjure Barrage",
        "Aura of Purity",
        "Fire Shield",
        "Banishing Smite",
        "Mass Cure Wounds"
    ],
    "Bard (Glamour)": [
        "Command"
    ],
    "Bard (Glamour 2024)": [
        "Charm Person",
        "Mirror Image"
    ],
    "Cleric (Arcana)": [
        "Detect Magic",
        "Magic Missile",
        "Magic Weapon",
        "Nystul\'s Magic Aura",
        "Dispel Magic",
        "Magic Circle",
        "Arcane Eye",
        "Leomund\'s Secret Chest",
        "Planar Binding",
        "Teleportation Circle",
    ],
    "Cleric (Death)": [
        "False Life",
        "Ray of Sickness",
        "Blindness/Deafness",
        "Ray of Enfeeblement",
        "Animate Dead",
        "Vampiric Touch",
        "Blight",
        "Death Ward",
        "Antilife Shell",
        "Cloudkill"
    ],
    "Cleric (Forge)": [
        "Identify",
        "Searing Smite",
        "Heat Metal",
        "Magic Weapon",
        "Elemental Weapon",
        "Protection from Energy",
        "Fabricate",
        "Wall of Fire",
        "Animate Objects",
        "Creation"
    ],
    "Cleric (Grave)": [
        "Bane",
        "False Life",
        "Gentle Repose",
        "Ray of Enfeeblement",
        "Revivify",
        "Vampiric Touch",
        "Blight",
        "Death Ward",
        "Antilife Shell",
        "Raise Dead"
    ],
    "Cleric (Knowledge)": [
        "Command",
        "Identify",
        "Augury",
        "Suggestion",
        "Nondetection",
        "Speak with Dead",
        "Arcane Eye",
        "Confusion",
        "Legend Lore",
        "Scrying"
    ],
    "Cleric (Life)": [
        "Bless",
        "Cure Wounds",
        "Lesser Restoration",
        "Spiritual Weapon",
        "Beacon of Hope",
        "Revivify",
        "Death Ward",
        "Guardian of Faith",
        "Mass Cure Wounds",
        "Raise Dead"
    ],
    "Cleric (Life 2024)": [
        "Aid",
        "Bless",
        "Cure Wounds",
        "Lesser Restoration",
        "Mass Healing Word",
        "Revivify",
        "Aura of Life",
        "Death Ward",
        "Greater Restoration",
        "Mass Cure Wounds"
    ],
    "Cleric (Light)": [
        "Burning Hands",
        "Faerie Fire",
        "Flaming Sphere",
        "Scorching Ray",
        "Daylight",
        "Fireball",
        "Guardian of Faith",
        "Wall of Fire",
        "Flame Strike",
        "Scrying"
    ],
    "Cleric (Light 2024)": [
        "Burning Hands",
        "Faerie Fire",
        "Scorching Ray",
        "See Invisibility",
        "Daylight",
        "Fireball",
        "Arcane Eye",
        "Wall of Fire",
        "Flame Strike",
        "Scrying"
    ],
    "Cleric (Nature)": [
        "Animal Friendship",
        "Speak with Animals",
        "Barkskin",
        "Spike Growth",
        "Plant Growth",
        "Wind Wall",
        "Dominate Beast",
        "Grasping Vine",
        "Insect Plague",
        "Tree Stride"
    ],
    "Cleric (Order)": [
        "Command",
        "Heroism",
        "Hold Person",
        "Zone of Truth",
        "Mass Healing Word",
        "Slow",
        "Compulsion",
        "Locate Creature",
        "Commune",
        "Dominate Person"
    ],
    "Cleric (Peace)": [
        "Heroism",
        "Sanctuary",
        "Aid",
        "Warding Bond",
        "Beacon of Hope",
        "Sending",
        "Aura of Purity",
        "Otiluke\'s Resilient Sphere",
        "Greater Restoration",
        "Rary\'s Telepathic Bond"
    ],
    "Cleric (Tempest)": [
        "Fog Cloud",
        "Thunderwave",
        "Gust of Wind",
        "Shatter",
        "Call Lightning",
        "Sleet Storm",
        "Control Water",
        "Ice Storm",
        "Destructive Wave",
        "Insect Plague"
    ],
    "Cleric (Trickery)": [
        "Charm Person",
        "Disguise Self",
        "Mirror Image",
        "Pass Without Trace",
        "Blink",
        "Dispel Magic",
        "Dimension Door",
        "Polymorph",
        "Dominate Person",
        "Modify Memory"
    ],
    "Cleric (Trickery 2024)": [
        "Charm Person",
        "Disguise Self",
        "Invisibility",
        "Pass Without Trace",
        "Hypnotic Pattern",
        "Nondetection",
        "Confusion",
        "Dimension Door",
        "Dominate Person",
        "Modify Memory"
    ],
    "Cleric (Twilight)": [
        "Faerie Fire",
        "Sleep",
        "Moonbeam",
        "See Invisibility",
        "Aura of Vitality",
        "Leomund\'s Tiny Hut",
        "Aura of Life",
        "Greater Invisibility",
        "Circle of Power",
        "Mislead"
    ],
    "Cleric (War)": [
        "Divine Favor",
        "Shield of Faith",
        "Magic Weapon",
        "Spiritual Weapon",
        "Crusader\'s Mantle",
        "Spirit Guardians",
        "Freedom of Movement",
        "Stoneskin",
        "Flame Strike",
        "Hold Monster"
    ],
    "Cleric (War 2024)": [
        "Guiding Bolt",
        "Magic Weapon",
        "Shield of Faith",
        "Spiritual Weapon",
        "Crusader\'s Mantle",
        "Spirit Guardians",
        "Fire Shield",
        "Freedom of Movement",
        "Hold Monster",
        "Steel Wind Strike"
    ],
    "Druid (Arctic)": [
        "Hold Person",
        "Spike Growth",
        "Sleet Storm",
        "Slow",
        "Freedom of Movement",
        "Ice Storm",
        "Commune with Nature",
        "Cone of Cold"
    ],
    "Druid (Arid)": [
        "Blur",
        "Burning Hands",
        "Fire Bolt",
        "Fireball",
        "Blight",
        "Wall of Stone"
    ],
    "Druid (Coast)": [
        "Mirror Image",
        "Misty Step",
        "Water Breathing",
        "Water Walk",
        "Control Water",
        "Freedom of Movement",
        "Conjure Elemental",
        "Scrying"
    ],
    "Druid (Desert)": [
        "Blur",
        "Silence",
        "Create Food and Water",
        "Protection from Energy",
        "Blight",
        "Hallucinatory Terrain",
        "Insect Plague",
        "Wall of Stone"
    ],
    "Druid (Forest)": [
        "Barkskin",
        "Spider Climb",
        "call Lightning",
        "Plant Growth",
        "Divination",
        "Freedom of Movement",
        "Commune with Nature",
        "Tree Stride"
    ],
    "Druid (Grassland)": [
        "Invisibility",
        "Pass Without Trace",
        "Daylight",
        "Haste",
        "Divination",
        "Freedom of Movement",
        "Dream",
        "Insect Plague"
    ],
    "Druid (Moon)": [
        "Cure Wounds",
        "Moonbeam",
        "Starry Wisp",
        "Conjure Animals",
        "Fount of Moonlight",
        "Mass Cure Wounds"
    ],
    "Druid (Mountain)": [
        "Spider Climb",
        "Spike Growth",
        "Lightning Bolt",
        "Meld into Stone",
        "Stone Shape",
        "Stoneskin",
        "Passwall",
        "Wall of Stone"
    ],
    "Druid (Polar)": [
        "Fog Cloud",
        "Hold Person",
        "Ray of Frost",
        "Sleet Storm",
        "Ice Storm",
        "Cone of Cold"
    ],
    "Druid (Sea)": [
        "Fog Cloud",
        "Gust of Wind",
        "Ray of Frost",
        "Shatter",
        "Thunderwave",
        "Lightning Bolt",
        "Water Breathing",
        "Control Water",
        "Ice Storm",
        "Conjure Elemental",
        "Hold Monster"
    ],
    "Druid (Spores)": [
        "Chill Touch",
        "Blindness/Deafness",
        "Gentle Repose",
        "Animate Dead",
        "Gaseous Form",
        "Blight",
        "Confusion",
        "Cloudkill",
        "Contagion"
    ],
    "Druid (Stars)": [
        "Guidance",
        "Guiding Bolt"
    ],
    "Druid (Swamp)": [
        "Darkness",
        "Melf\'s Acid Arrow",
        "Stinking Cloud",
        "Water Walk",
        "Freedom of Movement",
        "Locate Creature",
        "Insect Plague",
        "Scrying"
    ],
    "Druid (Temperate)": [
        "Misty Step",
        "Shocking Grasp",
        "Sleep",
        "Lightning Bolt",
        "Freedom of Movement",
        "Tree Stride"
    ],
    "Druid (Tropical)": [
        "Acid Splash",
        "Ray of Sickness",
        "Web",
        "Stinking Cloud",
        "Polymorph",
        "Isenct Plague"
    ],
    "Druid (Underdark)": [
        "Spider Climb",
        "Web",
        "Gaseous Form",
        "Stinking Cloud",
        "Greater Invisibility",
        "Stone Shape",
        "Cloudkill",
        "Insect Plague"
    ],
    "Druid (Wildfire)": [
        "Burning Hands",
        "Cure Wounds",
        "Flmaing Sphere",
        "Scorching Ray",
        "Plant Growth",
        "Revivify",
        "Aura of Life",
        "Fire Shield",
        "Flame Strike",
        "Mass Cure Wounds"
    ],
    "Monk (Four Elements)": [
        "Burning Hands",
        "Thunderwave",
        "Gust of Wind",
        "Hold Person",
        "Shatter",
        "Fly",
        "Gaseous Form",
        "Stoneskin",
        "Wall ofFire",
        "Cone of Cold",
        "Wall of Stone"
    ],
    "Monk (Shadow)": [
        "Minor Illusion",
        "Darkness",
        "Darkvision",
        "Pass Without Trace",
        "Silence"
    ],
    "Monk (Sun Soul)": [
        "Burning Hands"
    ],
    "Paladin (Ancients)": [
        "Ensnaring Strike",
        "Speak with Animals",
        "Misty Step",
        "Moonbeam",
        "Plant Growth",
        "Protection from Energy",
        "Ice Storm",
        "Stoneskin",
        "Commune with Nature",
        "Tree Stride"
    ],
    "Paladin (Conquest)": [
        "Armor of Agathys",
        "Command",
        "Hold Person",
        "Spiritual Weapon",
        "Bestow Curse",
        "Fear",
        "Dominate Beast",
        "Stoneskin",
        "Cloudkill",
        "Dominate Person"
    ],
    "Paladin (Crown)": [
        "Command",
        "Compelled Duel",
        "Warding Bond",
        "Zone of Truth",
        "Aura of Vitality",
        "Spirit Guardians",
        "Banishment",
        "Guardian of Faith",
        "Circle of Power",
        "Geas"
    ],
    "Paladin (Devotion)": [
        "Protection from Evil and Good",
        "Sanctuary",
        "Lesser Restoration",
        "Zone of Truth",
        "Beacon of Hope",
        "Dispel Magic",
        "Freedom of Movement",
        "Guardian of Faith",
        "Commune",
        "Flame Strike"
    ],
    "Paladin (Devotion 2024)": [
        "Protection from Evil and Good",
        "Shield of Faith",
        "Aid",
        "Zone of Truth",
        "Beacon of Hope",
        "Dispel Magic",
        "Freedom of Movement",
        "Guardian of Faith",
        "Commune",
        "Flame Strike"
    ],
    "Paladin (Glory)": [
        "Guiding Bolt",
        "Heroism",
        "Enhance Ability",
        "Magic Weapon",
        "Haste",
        "Protection from Energy",
        "Compulsion",
        "Freedom of Movement",
        "Commune",
        "Flame Strike"
    ],
    "Paladin (Glory 2024)": [
        "Guiding Bolt",
        "Heroism",
        "Enhance Ability",
        "Magic Weapon",
        "Haste",
        "Protection from Energy",
        "Compulsion",
        "Freedom of Movement",
        "Legend Lore",
        "Yolande\'s Regal Presence"
    ],
    "Paladin (Oathbreaker)": [
        "Hellish Rebuke",
        "Inflict Wounds",
        "Crown of Madness",
        "Darkness",
        "Animate Dead",
        "Bestow Curse",
        "Blight",
        "Confusion",
        "Contagion",
        "Dominate Person"
    ],
    "Paladin (Redemption)": [
        "Sanctuary",
        "Sleep",
        "Calm Emotions",
        "Hold Person",
        "Counterspell",
        "Hypnotic Pattern",
        "Otiluke\'s Resilient Sphere",
        "Stoneskin",
        "Hold Monster",
        "Wall of Force"
    ],
    "Paladin (Vengeance)": [
        "Bane",
        "Hunter\'s Mark",
        "Hold Person",
        "Misty Step",
        "Haste",
        "Protection from Energy",
        "Banishment",
        "Dimension Door",
        "Hold Monster",
        "Scrying"
    ],
    "Paladin (Watchers)": [
        "Alarm",
        "Detect Magic",
        "Moonbeam",
        "See Invisibility",
        "Counterspell",
        "Nondetection",
        "Aura of Purity",
        "Banishment",
        "Hold Monster",
        "Scrying"
    ],
    "Ranger (Fey Wanderer)": [
        "Charm Person",
        "Misty Step",
        "Dispel Magic",
        "Dimension Door",
        "Mislead"
    ],
    "Ranger (Fey Wanderer 2024)": [
        "Charm Person",
        "Misty Step",
        "Summon Fey",
        "Dimension Door",
        "Mislead"
    ],
    "Ranger (Gloom Stalker)": [
        "Disguise Self",
        "Rope Trick",
        "Fear",
        "Greater Invisibility",
        "Seeming"
    ],
    "Ranger (Horizon Walker)": [
        "Protection from Evil and Good",
        "Misty Step",
        "Haste",
        "Banishment",
        "Teleportation Circle"
    ],
    "Ranger (Monster Slayer)": [
        "Protection from Evil and Good",
        "Zone of Truth",
        "Magic Circle",
        "Banishment",
        "Hold Monster"
    ],
    "Ranger (Swarmkeeper)": [
        "Mage Hand",
        "Faerie Fire",
        "Web",
        "Gaseous Form",
        "Arcane Eye",
        "Insect Plague"
    ],
    "Sorcerer (Aberrant Mind)": [
        "Mind Sliver",
        "Arms of Hadar",
        "Dissonant Whispers",
        "Calm Emotions",
        "Detect Thoughts",
        "Hunger of Hadar",
        "Sending",
        "Evard\'s Black Tentacles",
        "Summon Aberration",
        "Rary\'s Telepathic Bond",
        "Telekinesis"
    ],
    "Sorcerer (Aberrant Sorcery)": [
        "Arms of Hadar",
        "Calm Emotions",
        "Detect Thoughts",
        "Dissonant Whispers",
        "Mind Sliver"
        "Hunger of Hadar",
        "Sending",
        "Evard\'s Black Tentacles",
        "Summon Aberration",
        "Rary\'s Telepathic Bond",
        "Telekinesis"
    ],
    "Sorcerer (Clockwork Soul)": [
        "Alarm",
        "Protection from Evil and Good",
        "Aid",
        "Lesser Restoration",
        "Dispel Magic",
        "Protection from Energy",
        "Freedom of Movement",
        "Summon Construct",
        "Greater Restoration",
        "Wall of Force"
    ],
    "Sorcerer (Clockwork Sorcery)": [
        "Aid",
        "Alarm",
        "Lesser Restoration",
        "Protection from Evil and Good",
        "Dispel Magic",
        "Protection from Energy",
        "Freedom of Movement",
        "Summon Construct",
        "Greater Restoration",
        "Wall of Force"
    ],
    "Sorcerer (Draconic Sorcery)": [
        "Alter Self",
        "Chromatic Orb",
        "Command",
        "Dragon\'s Breath",
        "Fear",
        "Fly",
        "Arcane Eye",
        "Charm Monster",
        "Legend Lore",
        "Summon Dragon"
    ],
    "Sorcerer (Divine Soul)": [
        "Guidance",
        "Resistance",
        "Sacred Flame",
        "Spare the Dying",
        "Thaumaturgy",
        "Toll the Dead",
        "Word of Radiance",
        "Bane",
        "Bless",
        "Ceremony",
        "Command",
        "Create or Destroy Water",
        "Cure Wounds",
        "Detect Evil and Good",
        "Detect Poison and Disease",
        "Guiding Bolt",
        "Healing Word",
        "Inflict Wounds",
        "Protection from Evil and Good",
        "Purify Food and Drink",
        "Sanctuary",
        "Shield of Faith",
        "Aid Augury",
        "Calm Emotions",
        "Continual Flame",
        "Find Traps",
        "Gentle Repose",
        "Lesser Restoration",
        "Locate Object",
        "Prayer of Healing",
        "Protection from Poison",
        "Silence",
        "Spiritual Weapon",
        "Warding Bond",
        "Zone of Truth",
        "Animate Dead",
        "Beacon of Hope",
        "Bestow Curse",
        "Create Food and Water",
        "Fast Friends",
        "Feign Death",
        "Glyph of Warding",
        "Life Transference",
        "Magic Circle",
        "Mass Healing Word",
        "Meld into Stone",
        "Motivational Speech",
        "Remove Curse",
        "Revivify",
        "Sending",
        "Speak with Dead",
        "Spirit Guardians",
        "Spirit Shroud",
        "Control Water",
        "Death Ward",
        "Divination",
        "Freedom of Movement",
        "Guardian of Faith",
        "Locate Creature",
        "Stone Shape",
        "Commune",
        "Contagion",
        "Dawn",
        "Dispel Evil and Good",
        "Flame Strike",
        "Geas",
        "Greater Restoration",
        "Hallow",
        "Holy Weapon",
        "Legend Lore",
        "Mass Cure Wounds",
        "Planar Binding",
        "Raise Dead",
        "Scrying",
        "Summon Celestial",
        "Blade Barrier",
        "Create Undead",
        "Find the Path",
        "Forbiddance",
        "Harm",
        "Heal",
        "Heroes\' Feast",
        "Planar Ally",
        "Word of Recall",
        "Conjure Celestial",
        "Divine Word",
        "Regenerate",
        "Resurrection",
        "Symbol",
        "Temple of the Gods",
        "Antimagic Field",
        "Control Weather",
        "Holy Aura",
        "Astral Projection",
        "Mass Heal",
        "True Resurrection"
    ],
    "Warlock (Archfey)": [
        "Faerie Fire",
        "Sleep",
        "Calm Emotions",
        "Phantasmal Force",
        "Blink",
        "Plant Growth",
        "Dominate Beast",
        "Greater Invisibility",
        "Dominate Person",
        "Seeming"
    ],
    "Warlock (Archfey 2024)": [
        "Calm Emotions",
        "Faerie Fire",
        "Misty Step",
        "Phantasmal Force",
        "Sleep",
        "Blink",
        "Plant Growth",
        "Dominate Beast",
        "Greater Invisibility",
        "Dominate Person",
        "Seeming"
    ],
    "Warlock (Celestial)": [
        "Light",
        "Sacred Flame",
        "Cure Wounds",
        "Guiding Bolt",
        "Flaming Sphere",
        "Lesser Restoration",
        "Daylight",
        "Revivify",
        "Guardian of Faith",
        "Wall of Fire",
        "Flame Strike",
        "Greater Restoration"
    ],
    "Warlock (Celestial 2024)": [
        "Aid",
        "Cure Wounds",
        "Guiding Bolt",
        "Lesser Restoration",
        "Light",
        "Sacred Flame",
        "Daylight",
        "Revivify",
        "Guardian of Faith",
        "Wall of Fire",
        "Greater Restoration",
        "Summon Celestial"
    ],
    "Warlock (Fathomless)": [
        "Create or Destroy Water",
        "Thunderwave",
        "Gust of Wind",
        "Silence",
        "Lightning Bolt",
        "Sleet Storm",
        "Control Water",
        "Summon Elemental",
        "Bigby\'s Hand",
        "Cone of Cold"
    ],
    "Warlock (Fiend)": [
        "Burning Hands",
        "Command",
        "Blindness/Deafness",
        "Scorching Ray",
        "Fireball",
        "Stinking Cloud",
        "Fire Shield",
        "Wall of Fire",
        "Flame Strike",
        "Hallow"
    ],
    "Warlock (Fiend 2024)": [
        "Burning Hands",
        "Command",
        "Scorching Ray",
        "Suggestion",
        "Fireball",
        "Stinking Cloud",
        "Fire Shield",
        "Wall of Fire",
        "Geas",
        "Insect Plague"
    ],
    "Warlock (Genie - Dao)": [
        "Detect Evil and Good",
        "Sanctuary",
        "Phantasmal Force",
        "Spike Growth",
        "Crete Food and Water",
        "Meld into Stone",
        "Phantasmal Killer",
        "Stone Shape",
        "Creation",
        "Wall of Stone",
        "Wish"
    ],
    "Warlock (Genie - Djinni)": [
        "Detect Evil and Good",
        "Thunderwave",
        "Gust of Wind",
        "Phantasmal Force",
        "Create Food and Water",
        "Wind Wall",
        "Greater Invisibility",
        "Phantasmal Killer",
        "Creation",
        "Seeming",
        "Wish"
    ],
    "Warlock (Genie - Efreeti)": [
        "Burning Hands",
        "Detect Evil and Good",
        "Phantasmal Force",
        "Scorching Ray",
        "Create Food and Water",
        "Fireball",
        "Fire Shield",
        "Phantasmal Killer",
        "Creation",
        "Flame Strike",
        "Wish"
    ],
    "Warlock (Genie - Marid)": [
        "Detect Evil and Good",
        "Fog Cloud",
        "Blur",
        "Phantasmal Force",
        "Create Food and Water",
        "Sleet Storm",
        "Control Water",
        "Phantasmal Killer",
        "Cone of Cold",
        "Creation",
        "Wish"
    ],
    "Warlock (Great Old One)": [
        "Dissonant Whispers",
        "Tasha\'s Hideous Laughter",
        "Detect Thoughts",
        "Phantasmal Force",
        "Clairvoyance",
        "Sending",
        "Dominate Beast",
        "Evard\'s Black Tentacles",
        "Dominate Person",
        "Telekinesis"
    ],
    "Warlock (Great Old One 2024)": [
        "Detect Thoughts",
        "Dissonant Whispers",
        "Phantasmal Force",
        "Tasha\'s Hideous Laughter",
        "Clairvoyance",
        "Hunger of Hadar",
        "Confusion",
        "Summon Aberration",
        "Modify Memory",
        "Telekinesis"
    ],
    "Warlock (Hexblade)": [
        "Shield",
        "Wrathful Smite",
        "Blur",
        "Branding Smite",
        "Blink",
        "Elemental Weapon",
        "Phantasmal Killer",
        "Staggering Smite",
        "Banishing Smite",
        "Cone of Cold"
    ],
    "Warlock (Undying)": [
        "Spare the Dying",
        "False Life",
        "Ray of Sickness",
        "Blindness/Deafness",
        "Silence",
        "Feign Death",
        "Speak with Dead",
        "Aura of Life",
        "Death Ward",
        "Contagion",
        "Legend Lore"
    ]
}

def add_subclasses():
    col = getspellscollection()
    spells = [x for x in col.find(projection={'_id': False})]

    for spell in spells:

        spell["subclasses"] = spell.get("subclasses", [])

        for subclass, sub_spells in subclasses.items():
            if spell["name"] in sub_spells:
                spell["subclasses"].append(subclass)

        mongodb.getcollection("spells").replace_one({"spell_num": spell["spell_num"]}, spell, upsert=True)
