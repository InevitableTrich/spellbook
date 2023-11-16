from ilt.dal import mongodb
from ilt.managers.spellmgr import getspellscollection

subspellsalch = [
    'Healing Word',
    'Ray of Sickness',
    'Flaming Sphere',
    'Melf\'s Acid Arrow',
    'Gaseous Form',
    'Mass Healing Word',
    'Blight',
    'Death Ward',
    'Cloudkill',
    'Raise Dead',
]
subspellsarm = [
    'Magic Missile',
    'Thunderwave',
    'Mirror Image',
    'Shatter',
    'Hypnotic Pattern',
    'Lightning Bolt',
    'Fire Shield',
    'Greater Invisibility',
    'Passwall',
    'Wall of Force',
]
subspellsartil = [
    'Shield',
    'Thunderwave',
    'Scorching Ray',
    'Shatter',
    'Fireball',
    'Wind Wall',
    'Ice Storm',
    'Wall of Fire',
    'Cone of Cold',
    'Wall of Force',
]
subspellsbatt = [
    'Heroism',
    'Shield',
    'Branding Smite',
    'Warding Bond',
    'Aura of Vitality',
    'Conjure Barrage',
    'Aura of Purity',
    'Fire Shield',
    'Banishing Smite',
    'Mass Cure Wounds',
]
subspellsglam = [
    'Command'
]
subspellsarca = [
    'Detect Magic',
    'Magic Missile',
    'Magic Weapon',
    'Nystul\'s Magic Aura',
    'Dispel Magic',
    'Magic Circle',
    'Arcane Eye',
    'Leomund\'s Secret Chest',
    'Planar Binding',
    'Teleportation Circle',
]
subspellsdeath = [
    'False Life',
    'Ray of Sickness',
    'Blindness/Deafness',
    'Ray of Enfeeblement',
    'Animate Dead',
    'Vampiric Touch',
    'Blight',
    'Death Ward',
    'Antilife Shell',
    'Cloudkill',
]
subspellsforge = [
    'Identify',
    'Searing Smite',
    'Heat Metal',
    'Magic Weapon',
    'Elemental Weapon',
    'Protection from Energy',
    'Fabricate',
    'Wall of Fire',
    'Animate Objects',
    'Creation',
]
subspellsgrave = [
    'Bane',
    'False Life',
    'Gentle Repose',
    'Ray of Enfeeblement',
    'Revivify',
    'Vampiric Touch',
    'Blight',
    'Death Ward',
    'Antilife Shell',
    'Raise Dead',
]
subspellsknow = [
    'Command',
    'Identify',
    'Augury',
    'Suggestion',
    'Nondetection',
    'Speak with Dead',
    'Arcane Eye',
    'Confusion',
    'Legend Lore',
    'Scrying',
]
subspellslife = [
    'Bless',
    'Cure Wounds',
    'Lesser Restoration',
    'Spiritual Weapon',
    'Beacon of Hope',
    'Revivify',
    'Death Ward',
    'Guardian of Faith',
    'Mass Cure Wounds',
    'Raise Dead',
]
subspellslight = [
    'Burning Hands',
    'Faerie Fire',
    'Flaming Sphere',
    'Scorching Ray',
    'Daylight',
    'Fireball',
    'Guardian of Faith',
    'Wall of Fire',
    'Flame Strike',
    'Scrying',
]
subspellsnat = [
    'Animal Friendship',
    'Speak with Animals',
    'Barkskin',
    'Spike Growth',
    'Plant Growth',
    'Wind Wall',
    'Dominate Beast',
    'Grasping Vine',
    'Insect Plague',
    'Tree Stride',
]
subspellsorder = [
    'Command',
    'Heroism',
    'Hold Person',
    'Zone of Truth',
    'Mass Healing Word',
    'Slow',
    'Compulsion',
    'Locate Creature',
    'Commune',
    'Dominate Person',
]
subspellspeace = [
    'Heroism',
    'Sanctuary',
    'Aid',
    'Warding Bond',
    'Beacon of Hope',
    'Sending',
    'Aura of Purity',
    'Otiluke\'s Resilient Sphere',
    'Greater Restoration',
    'Rary\'s Telepathic Bond',
]
subspellstempest = [
    'Fog Cloud',
    'Thunderwave',
    'Gust of Wind',
    'Shatter',
    'Call Lightning',
    'Sleet Storm',
    'Control Water',
    'Ice Storm',
    'Destructive Wave',
    'Insect Plague',
]
subspellstrick = [
    'Charm Person',
    'Disguise Self',
    'Mirror Image',
    'Pass Without Trace',
    'Blink',
    'Dispel Magic',
    'Dimension Door',
    'Polymorph',
    'Dominate Person',
    'Modify Memory',
]
subspellstwigh = [
    'Faerie Fire',
    'Sleep',
    'Moonbeam',
    'See Invisibility',
    'Aura of Vitality',
    'Leomund\'s Tiny Hut',
    'Aura of Life',
    'Greater Invisibility',
    'Circle of Power',
    'Mislead',
]
subspellswar = [
    'Divine Favor',
    'Shield of Faith',
    'Magic Weapon',
    'Spiritual Weapon',
    'Crusader\'s Mantle',
    'Spirit Guardians',
    'Freedom of Movement',
    'Stoneskin',
    'Flame Strike',
    'Hold Monster',
]
subspellsarc = [
    'Hold Person',
    'Spike Growth',
    'Sleet Storm',
    'Slow',
    'Freedom of Movement',
    'Ice Storm',
    'Commune with Nature',
    'Cone of Cold',
]
subspellscoast = [
    'Mirror Image',
    'Misty Step',
    'Water Breathing',
    'Water Walk',
    'Control Water',
    'Freedom of Movement',
    'Conjure Elemental',
    'Scrying',
]
subspellsdes = [
    'Blur',
    'Silence',
    'Create Food and Water',
    'Protection from Energy',
    'Blight',
    'Hallucinatory Terrain',
    'Insect Plague',
    'Wall of Stone',
]
subspellsforest = [
    'Barkskin',
    'Spider Climb',
    'call Lightning',
    'Plant Growth',
    'Divination',
    'Freedom of Movement',
    'Commune with Nature',
    'Tree Stride',
]
subspellsgrass = [
    'Invisibility',
    'Pass Without Trace',
    'Daylight',
    'Haste',
    'Divination',
    'Freedom of Movement',
    'Dream',
    'Insect Plague',
]
subspellsmount = [
    'Spider Climb',
    'Spike Growth',
    'Lightning Bolt',
    'Meld into Stone',
    'Stone Shape',
    'Stoneskin',
    'Passwall',
    'Wall of Stone',
]
subspellsspore = [
    'Chill Touch',
    'Blindness/Deafness',
    'Gentle Repose',
    'Animate Dead',
    'Gaseous Form',
    'Blight',
    'Confusion',
    'Cloudkill',
    'Contagion',
]
subspellsstars = [
    'Guidance',
    'Guiding Bolt',
]
subspellsswamp = [
    'Darkness'
    'Melf\'s Acid Arrow',
    'Stinking Cloud',
    'Water Walk',
    'Freedom of Movement',
    'Locate Creature',
    'Insect Plague',
    'Scrying',
]
subspellsunder = [
    'Spider Climb',
    'Web',
    'Gaseous Form',
    'Stinking Cloud',
    'Greater Invisibility',
    'Stone Shape',
    'Cloudkill',
    'Insect Plague',
]
subspellswild = [
    'Burning Hands',
    'Cure Wounds',
    'Flmaing Sphere',
    'Scorching Ray',
    'Plant Growth',
    'Revivify',
    'Aura of Life',
    'Fire Shield',
    'Flame Strike',
    'Mass Cure Wounds',
]
subspellsfour = [
    'Burning Hands'
    'Thunderwave',
    'Gust of Wind',
    'Hold Person',
    'Shatter',
    'Fly',
    'Gaseous Form',
    'Stoneskin',
    'Wall ofFire',
    'Cone of Cold',
    'Wall of Stone',
]
subspellsshadow = [
    'Minor Illusion',
    'Darkness',
    'Darkvision',
    'Pass Without Trace',
    'Silence',
]
subspellssun = [
    'Burning Hands'
]
subspellsancient = [
    'Ensnaring Strike',
    'Speak with Animals',
    'Misty Step',
    'Moonbeam',
    'Plant Growth',
    'Protection from Energy',
    'Ice Storm',
    'Stoneskin',
    'Commune with Nature',
    'Tree Stride',
]
subspellsconq = [
    'Armor of Agathys',
    'Command',
    'Hold Person',
    'Spiritual Weapon',
    'Bestow Curse',
    'Fear',
    'Dominate Beast',
    'Stoneskin',
    'Cloudkill',
    'Dominate Person',
]
subspellscrown = [
    'Command',
    'Compelled Duel',
    'Warding Bond',
    'Zone of Truth',
    'Aura of Vitality',
    'Spirit Guardians',
    'Banishment',
    'Guardian of Faith',
    'Circle of Power',
    'Geas',
]
subspellsdevot = [
    'Protection from Evil and Good',
    'Sanctuary',
    'Lesser Restoration',
    'Zone of Truth',
    'Beacon of Hope',
    'Dispel Magic',
    'Freedom of Movement',
    'Guardian of Faith',
    'Commune',
    'Flame Strike',
]
subspellsglory = [
    'Guiding Bolt',
    'Heroism',
    'Enhance Ability',
    'Magic Weapon',
    'Haste',
    'Protection from Energy',
    'Compulsion',
    'Freedom of Movement',
    'Commune',
    'Flame Strike',
]
subspellsoath = [
    'Hellish Rebuke',
    'Inflict Wounds',
    'Crown of Madness',
    'Darkness',
    'Animate Dead',
    'Bestow Curse',
    'Blight',
    'Confusion',
    'Contagion',
    'Dominate Person',
]
subspellsredemp = [
    'Sanctuary',
    'Sleep',
    'Calm Emotions',
    'Hold Person',
    'Counterspell',
    'Hypnotic Pattern',
    'Otiluke\'s Resilient Sphere',
    'Stoneskin',
    'Hold Monster',
    'Wall of Force',
]
subspellsvenge = [
    'Bane'
    'Hunter\'s Mark',
    'Hold Person',
    'Misty Step',
    'Haste',
    'Protection from Energy',
    'Banishment',
    'Dimension Door',
    'Hold Monster',
    'Scrying',
]
subspellswatch = [
    'Alarm',
    'Detect Magic',
    'Moonbeam',
    'See Invisibility',
    'Counterspell',
    'Nondetection',
    'Aura of Purity',
    'Banishment',
    'Hold Monster',
    'Scrying',
]
subspellsfey = [
    'Charm Person',
    'Misty Step',
    'Dispel Magic',
    'Dimension Door',
    'Mislead',
]
subspellsgloom = [
    'Disguise Self',
    'Rope Trick',
    'Fear',
    'Greater Invisibility',
    'Seeming',
]
subspellshori = [
    'Protection from Evil and Good',
    'Misty Step',
    'Haste',
    'Banishment',
    'Teleportation Circle',
]
subspellsmonst = [
    'Protection from Evil and Good',
    'Zone of Truth',
    'Magic Circle',
    'Banishment',
    'Hold Monster',
]
subspellsswarm = [
    'Mage Hand',
    'Faerie Fire',
    'Web',
    'Gaseous Form',
    'Arcane Eye',
    'Insect Plague',
]
subspellsabberant = [
    'Mind Sliver',
    'Arms of Hadar',
    'Dissonant Whispers',
    'Calm Emotions',
    'Detect Thoughts',
    'Hunger of Hadar',
    'Sending',
    'Evard\'s Black Tentacles',
    'Summon Aberration',
    'Rary\'s Telepathic Bond',
    'Telekinesis',
]
subspellsclock = [
    'Alarm',
    'Protection from Evil and Good',
    'Aid',
    'Lesser Restoration',
    'Dispel Magic',
    'Protection from Energy',
    'Freedom of Movement',
    'Summon Construct',
    'Greater Restoration',
    'Wall of Force',
]
subspellsdivine = [
    'Guidance',
    'Resistance',
    'Sacred Flame',
    'Spare the Dying',
    'Thaumaturgy',
    'Toll the Dead',
    'Word of Radiance',
    'Bane',
    'Bless',
    'Ceremony',
    'Command',
    'Create or Destroy Water',
    'Cure Wounds',
    'Detect Evil and Good',
    'Detect Poison and Disease',
    'Guiding Bolt',
    'Healing Word',
    'Inflict Wounds',
    'Protection from Evil and Good',
    'Purify Food and Drink',
    'Sanctuary',
    'Shield of Faith',
    'Aid Augury',
    'Calm Emotions',
    'Continual Flame',
    'Find Traps',
    'Gentle Repose',
    'Lesser Restoration',
    'Locate Object',
    'Prayer of Healing',
    'Protection from Poison',
    'Silence',
    'Spiritual Weapon',
    'Warding Bond',
    'Zone of Truth',
    'Animate Dead',
    'Beacon of Hope',
    'Bestow Curse',
    'Create Food and Water',
    'Fast Friends',
    'Feign Death',
    'Glyph of Warding',
    'Life Transference',
    'Magic Circle',
    'Mass Healing Word',
    'Meld into Stone',
    'Motivational Speech',
    'Remove Curse',
    'Revivify',
    'Sending',
    'Speak with Dead',
    'Spirit Guardians',
    'Spirit Shroud',
    'Control Water',
    'Death Ward',
    'Divination',
    'Freedom of Movement',
    'Guardian of Faith',
    'Locate Creature',
    'Stone Shape',
    'Commune',
    'Contagion',
    'Dawn',
    'Dispel Evil and Good',
    'Flame Strike',
    'Geas',
    'Greater Restoration',
    'Hallow',
    'Holy Weapon',
    'Legend Lore',
    'Mass Cure Wounds',
    'Planar Binding',
    'Raise Dead',
    'Scrying',
    'Summon Celestial',
    'Blade Barrier',
    'Create Undead',
    'Find the Path',
    'Forbiddance',
    'Harm',
    'Heal',
    'Heroes\' Feast',
    'Planar Ally',
    'Word of Recall',
    'Conjure Celestial',
    'Divine Word',
    'Regenerate',
    'Resurrection',
    'Symbol',
    'Temple of the Gods',
    'Antimagic Field',
    'Control Weather',
    'Holy Aura',
    'Astral Projection',
    'Mass Heal',
    'True Resurrection',
]
subspellsarch = [
    'Faerie Fire',
    'Sleep',
    'Calm Emotions',
    'Phantasmal Force',
    'Blink',
    'Plant Growth',
    'Dominate Beast',
    'Greater Invisibility',
    'Dominate Person',
    'Seeming',
]
subspellscelest = [
    'Light',
    'Sacred Flame',
    'Cure Wounds',
    'Guiding Bolt',
    'Flaming Sphere',
    'Lesser Restoration',
    'Daylight',
    'Revivify',
    'Guardian of Faith',
    'Wall of Fire',
    'Flame Strike',
    'Greater Restoration',
]
subspellsfathom = [
    'Create or Destroy Water',
    'Thunderwave',
    'Gust of Wind',
    'Silence',
    'Lightning Bolt',
    'Sleet Storm',
    'Control Water',
    'Summon Elemental',
    'Bigby\'s Hand',
    'Cone of Cold',
]
subspellsfiend = [
    'Burning Hands',
    'Command',
    'Blindness/Deafness',
    'Scorching Ray',
    'Fireball',
    'Stinking Cloud',
    'Fire Shield',
    'Wall of Fire',
    'Flame Strike',
    'Hallow',
]
subspellsdao = [
    'Detect Evil and Good'
    'Sanctuary'
    'Phantasmal Force'
    'Spike Growth'
    'Crete Food and Water'
    'Meld into Stone'
    'Phantasmal Killer'
    'Stone Shape'
    'Creation'
    'Wall of Stone'
    'Wish'
]
subspellsdjin = [
    'Detect Evil and Good',
    'Thunderwave',
    'Gust of Wind',
    'Phantasmal Force',
    'Create Food and Water',
    'Wind Wall',
    'Greater Invisibility',
    'Phantasmal Killer',
    'Creation',
    'Seeming',
    'Wish',
]
subspellsefre = [
    'Burning Hands',
    'Detect Evil and Good',
    'Phantasmal Force',
    'Scorching Ray',
    'Create Food and Water',
    'Fireball',
    'Fire Shield',
    'Phantasmal Killer',
    'Creation',
    'Flame Strike',
    'Wish',
]
subspellsmarid = [
    'Detect Evil and Good',
    'Fog Cloud',
    'Blur',
    'Phantasmal Force',
    'Create Food and Water',
    'Sleet Storm',
    'Control Water',
    'Phantasmal Killer',
    'Cone of Cold',
    'Creation',
    'Wish',
]
subspellsgreat = [
    'Dissonant Whispers',
    'Tasha\'s Hideous Laughter',
    'Detect Thoughts',
    'Phantasmal Force',
    'Clairvoyance',
    'Sending',
    'Dominate Beast',
    'Evard\'s Black Tentacles',
    'Dominate Person',
    'Telekinesis',
]
subspellshex = [
    'Shield',
    'Wrathful Smite',
    'Blur',
    'Branding Smite',
    'Blink',
    'Elemental Weapon',
    'Phantasmal Killer',
    'Staggering Smite',
    'Banishing Smite',
    'Cone of Cold',
]
subspellsundy = [
    'Spare the Dying',
    'False Life',
    'Ray of Sickness',
    'Blindness/Deafness',
    'Silence',
    'Feign Death',
    'Speak with Dead',
    'Aura of Life',
    'Death Ward',
    'Contagion',
    'Legend Lore',
]

def addsubs(spell):
    if not any(x in spell['name'] for x in subspellsundy):
        pass
    else:
        if 'subclasses' in spell:
            if not 'Warlock (Undying)' in spell['subclasses']:
                spell['subclasses'].append('Warlock (Undying)')
        else:
            spell['subclasses'] = ['Warlock (Undying)']

    if not any(x in spell['name'] for x in subspellshex):
        pass
    else:
        if 'subclasses' in spell:
            if not 'Warlock (Hexblade)' in spell['subclasses']:
                spell['subclasses'].append('Warlock (Hexblade)')
        else:
            spell['subclasses'] = ['Warlock (Hexblade)']

    if not any(x in spell['name'] for x in subspellsgreat):
        pass
    else:
        if 'subclasses' in spell:
            if not 'Warlock (Great Old One)' in spell['subclasses']:
                spell['subclasses'].append('Warlock (Great Old One)')
        else:
            spell['subclasses'] = ['Warlock (Great Old One)']

    if not any(x in spell['name'] for x in subspellsmarid):
        pass
    else:
        if 'subclasses' in spell:
            if not 'Warlock (Genie - Marid)' in spell['subclasses']:
                spell['subclasses'].append('Warlock (Genie - Marid)')
        else:
            spell['subclasses'] = ['Warlock (Genie - Marid)']

    if not any(x in spell['name'] for x in subspellsefre):
        pass
    else:
        if 'subclasses' in spell:
            if not 'Warlock (Genie - Efreeti)' in spell['subclasses']:
                spell['subclasses'].append('Warlock (Genie - Efreeti)')
        else:
            spell['subclasses'] = ['Warlock (Genie - Efreeti)']

    if not any(x in spell['name'] for x in subspellsdjin):
        pass
    else:
        if 'subclasses' in spell:
            if not 'Warlock (Genie - Djinni)' in spell['subclasses']:
                spell['subclasses'].append('Warlock (Genie - Djinni)')
        else:
            spell['subclasses'] = ['Warlock (Genie Djinni)']

    if not any(x in spell['name'] for x in subspellsdao):
        pass
    else:
        if 'subclasses' in spell:
            if not 'Warlock (Genie - Dao)' in spell['subclasses']:
                spell['subclasses'].append('Warlock (Genie - Dao)')
        else:
            spell['subclasses'] = ['Warlock (Genie - Dao)']

    if not any(x in spell['name'] for x in subspellsfiend):
        pass
    else:
        if 'subclasses' in spell:
            if not 'Warlock (Fiend)' in spell['subclasses']:
                spell['subclasses'].append('Warlock (Fiend)')
        else:
            spell['subclasses'] = ['Warlock (Fiend)']

    if not any(x in spell['name'] for x in subspellsfathom):
        pass
    else:
        if 'subclasses' in spell:
            if not 'Warlock (Fathomless)' in spell['subclasses']:
                spell['subclasses'].append('Warlock (Fathomless)')
        else:
            spell['subclasses'] = ['Warlock (Fathomless)']

    if not any(x in spell['name'] for x in subspellscelest):
        pass
    else:
        if 'subclasses' in spell:
            if not 'Warlock (Celestial)' in spell['subclasses']:
                spell['subclasses'].append('Warlock (Celestial)')
        else:
            spell['subclasses'] = ['Warlock (Celestial)']

    if not any(x in spell['name'] for x in subspellsarch):
        pass
    else:
        if 'subclasses' in spell:
            if not 'Warlock (Archfey)' in spell['subclasses']:
                spell['subclasses'].append('Warlock (Archfey)')
        else:
            spell['subclasses'] = ['Warlock (Archfey)']

    if not any(x in spell['name'] for x in subspellsdivine):
        pass
    else:
        if 'subclasses' in spell:
            if not 'Sorcerer (Divine Soul)' in spell['subclasses']:
                spell['subclasses'].append('Sorcerer (Divine Soul)')
        else:
            spell['subclasses'] = ['Sorcerer (Divine Soul)']

    if not any(x in spell['name'] for x in subspellsclock):
        pass
    else:
        if 'subclasses' in spell:
            if not 'Sorcerer (Clockwork Soul)' in spell['subclasses']:
                spell['subclasses'].append('Sorcerer (Clockwork Soul)')
        else:
            spell['subclasses'] = ['Sorcerer (Clockwork Soul)']

    if not any(x in spell['name'] for x in subspellsabberant):
        pass
    else:
        if 'subclasses' in spell:
            if not 'Sorcerer (Aberrant Mind)' in spell['subclasses']:
                spell['subclasses'].append('Sorcerer (Aberrant Mind)')
        else:
            spell['subclasses'] = ['Sorcerer (Aberrant Mind)']

    if not any(x in spell['name'] for x in subspellsswarm):
        pass
    else:
        if 'subclasses' in spell:
            if not 'Ranger (Swarmkeeper)' in spell['subclasses']:
                spell['subclasses'].append('Ranger (Swarmkeeper)')
        else:
            spell['subclasses'] = ['Ranger (Swarmkeeper)']

    if not any(x in spell['name'] for x in subspellsmonst):
        pass
    else:
        if 'subclasses' in spell:
            if not 'Ranger (Monster Slayer)' in spell['subclasses']:
                spell['subclasses'].append('Ranger (Monster Slayer)')
        else:
            spell['subclasses'] = ['Ranger (Monster Slayer)']

    if not any(x in spell['name'] for x in subspellshori):
        pass
    else:
        if 'subclasses' in spell:
            if not 'Ranger (Horizon Walker)' in spell['subclasses']:
                spell['subclasses'].append('Ranger (Horizon Walker)')
        else:
            spell['subclasses'] = ['Ranger (Horizon Walker)']

    if not any(x in spell['name'] for x in subspellsgloom):
        pass
    else:
        if 'subclasses' in spell:
            if not 'Ranger (Gloom Stalker)' in spell['subclasses']:
                spell['subclasses'].append('Ranger (Gloom Stalker)')
        else:
            spell['subclasses'] = ['Ranger (Gloom Stalker)']

    if not any(x in spell['name'] for x in subspellsfey):
        pass
    else:
        if 'subclasses' in spell:
            if not 'Ranger (Fey Wanderer)' in spell['subclasses']:
                spell['subclasses'].append('Ranger (Fey Wanderer)')
        else:
            spell['subclasses'] = ['Ranger (Fey Wanderer)']

    if not any(x in spell['name'] for x in subspellswatch):
        pass
    else:
        if 'subclasses' in spell:
            if not 'Paladin (Watchers)' in spell['subclasses']:
                spell['subclasses'].append('Paladin (Watchers)')
        else:
            spell['subclasses'] = ['Paladin (Watchers)']

    if not any(x in spell['name'] for x in subspellsvenge):
        pass
    else:
        if 'subclasses' in spell:
            if not 'Paladin (Vengeance)' in spell['subclasses']:
                spell['subclasses'].append('Paladin (Vengeance)')
        else:
            spell['subclasses'] = ['Paladin (Vengeance)']

    if not any(x in spell['name'] for x in subspellsredemp):
        pass
    else:
        if 'subclasses' in spell:
            if not 'Paladin (Redemption)' in spell['subclasses']:
                spell['subclasses'].append('Paladin (Redemption)')
        else:
            spell['subclasses'] = ['Paladin (Redemption)']

    if not any(x in spell['name'] for x in subspellsoath):
        pass
    else:
        if 'subclasses' in spell:
            if not 'Paladin (Oathbreaker)' in spell['subclasses']:
                spell['subclasses'].append('Paladin (Oathbreaker)')
        else:
            spell['subclasses'] = ['Paladin (Oathbreaker)']

    if not any(x in spell['name'] for x in subspellsglory):
        pass
    else:
        if 'subclasses' in spell:
            if not 'Paladin (Glory)' in spell['subclasses']:
                spell['subclasses'].append('Paladin (Glory)')
        else:
            spell['subclasses'] = ['Paladin (Glory)']

    if not any(x in spell['name'] for x in subspellsdevot):
        pass
    else:
        if 'subclasses' in spell:
            if not 'Paladin (Devotion)' in spell['subclasses']:
                spell['subclasses'].append('Paladin (Devotion)')
        else:
            spell['subclasses'] = ['Paladin (Devotion)']

    if not any(x in spell['name'] for x in subspellscrown):
        pass
    else:
        if 'subclasses' in spell:
            if not 'Paladin (Crown)' in spell['subclasses']:
                spell['subclasses'].append('Paladin (Crown)')
        else:
            spell['subclasses'] = ['Paladin (Crown)']

    if not any(x in spell['name'] for x in subspellsconq):
        pass
    else:
        if 'subclasses' in spell:
            if not 'Paladin (Conquest)' in spell['subclasses']:
                spell['subclasses'].append('Paladin (Conquest)')
        else:
            spell['subclasses'] = ['Paladin (Conquest)']

    if not any(x in spell['name'] for x in subspellsancient):
        pass
    else:
        if 'subclasses' in spell:
            if not 'Paladin (Ancients)' in spell['subclasses']:
                spell['subclasses'].append('Paladin (Ancients)')
        else:
            spell['subclasses'] = ['Paladin (Ancients)']

    if not any(x in spell['name'] for x in subspellssun):
        pass
    else:
        if 'subclasses' in spell:
            if not 'Monk (Sun Soul)' in spell['subclasses']:
                spell['subclasses'].append('Monk (Sun Soul)')
        else:
            spell['subclasses'] = ['Monk (Sun Soul)']

    if not any(x in spell['name'] for x in subspellsshadow):
        pass
    else:
        if 'subclasses' in spell:
            if not 'Monk (Shadow)' in spell['subclasses']:
                spell['subclasses'].append('Monk (Shadow)')
        else:
            spell['subclasses'] = ['Monk (Shadow)']

    if not any(x in spell['name'] for x in subspellsfour):
        pass
    else:
        if 'subclasses' in spell:
            if not 'Monk (Four Elements)' in spell['subclasses']:
                spell['subclasses'].append('Monk (Four Elements)')
        else:
            spell['subclasses'] = ['Monk (Four Elements)']

    if not any(x in spell['name'] for x in subspellswild):
        pass
    else:
        if 'subclasses' in spell:
            if not 'Druid (Wildfire)' in spell['subclasses']:
                spell['subclasses'].append('Druid (Wildfire)')
        else:
            spell['subclasses'] = ['Druid (Wildfire)']

    if not any(x in spell['name'] for x in subspellsunder):
        pass
    else:
        if 'subclasses' in spell:
            if not 'Druid (Underdark)' in spell['subclasses']:
                spell['subclasses'].append('Druid (Underdark)')
        else:
            spell['subclasses'] = ['Druid (Underdark)']

    if not any(x in spell['name'] for x in subspellsswamp):
        pass
    else:
        if 'subclasses' in spell:
            if not 'Druid (Swamp)' in spell['subclasses']:
                spell['subclasses'].append('Druid (Swamp)')
        else:
            spell['subclasses'] = ['Druid (Swamp)']

    if not any(x in spell['name'] for x in subspellsstars):
        pass
    else:
        if 'subclasses' in spell:
            if not 'Druid (Stars)' in spell['subclasses']:
                spell['subclasses'].append('Druid (Stars)')
        else:
            spell['subclasses'] = ['Druid (Stars)']

    if not any(x in spell['name'] for x in subspellsspore):
        pass
    else:
        if 'subclasses' in spell:
            if not 'Druid (Spores)' in spell['subclasses']:
                spell['subclasses'].append('Druid (Spores)')
        else:
            spell['subclasses'] = ['Druid (Spores)']

    if not any(x in spell['name'] for x in subspellsmount):
        pass
    else:
        if 'subclasses' in spell:
            if not 'Druid (Mountain)' in spell['subclasses']:
                spell['subclasses'].append('Druid (Mountain)')
        else:
            spell['subclasses'] = ['Druid (Mountain)']

    if not any(x in spell['name'] for x in subspellsgrass):
        pass
    else:
        if 'subclasses' in spell:
            if not 'Druid (Grassland)' in spell['subclasses']:
                spell['subclasses'].append('Druid (Grassland)')
        else:
            spell['subclasses'] = ['Druid (Grassland)']

    if not any(x in spell['name'] for x in subspellsforest):
        pass
    else:
        if 'subclasses' in spell:
            if not 'Druid (Forest)' in spell['subclasses']:
                spell['subclasses'].append('Druid (Forest)')
        else:
            spell['subclasses'] = ['Druid (Forest)']

    if not any(x in spell['name'] for x in subspellsdes):
        pass
    else:
        if 'subclasses' in spell:
            if not 'Druid (Desert)' in spell['subclasses']:
                spell['subclasses'].append('Druid (Desert)')
        else:
            spell['subclasses'] = ['Druid (Desert)']

    if not any(x in spell['name'] for x in subspellscoast):
        pass
    else:
        if 'subclasses' in spell:
            if not 'Druid (Coast)' in spell['subclasses']:
                spell['subclasses'].append('Druid (Coast)')
        else:
            spell['subclasses'] = ['Druid (Coast)']

    if not any(x in spell['name'] for x in subspellsarc):
        pass
    else:
        if 'subclasses' in spell:
            if not 'Druid (Arctic)' in spell['subclasses']:
                spell['subclasses'].append('Druid (Arctic)')
        else:
            spell['subclasses'] = ['Druid (Arctic)']

    if not any(x in spell['name'] for x in subspellswar):
        pass
    else:
        if 'subclasses' in spell:
            if not 'Cleric (War)' in spell['subclasses']:
                spell['subclasses'].append('Cleric (War)')
        else:
            spell['subclasses'] = ['Cleric (War)']

    if not any(x in spell['name'] for x in subspellstwigh):
        pass
    else:
        if 'subclasses' in spell:
            if not 'Cleric (Twilight)' in spell['subclasses']:
                spell['subclasses'].append('Cleric (Twilight)')
        else:
            spell['subclasses'] = ['Cleric (Twilight)']

    if not any(x in spell['name'] for x in subspellstrick):
        pass
    else:
        if 'subclasses' in spell:
            if not 'Cleric (Trickery)' in spell['subclasses']:
                spell['subclasses'].append('Cleric (Trickery)')
        else:
            spell['subclasses'] = ['Cleric (Trickery)']

    if not any(x in spell['name'] for x in subspellstempest):
        pass
    else:
        if 'subclasses' in spell:
            if not 'Cleric (Tempest)' in spell['subclasses']:
                spell['subclasses'].append('Cleric (Tempest)')
        else:
            spell['subclasses'] = ['Cleric (Tempest)']

    if not any(x in spell['name'] for x in subspellspeace):
        pass
    else:
        if 'subclasses' in spell:
            if not 'Cleric (Peace)' in spell['subclasses']:
                spell['subclasses'].append('Cleric (Peace)')
        else:
            spell['subclasses'] = ['Cleric (Peace)']

    if not any(x in spell['name'] for x in subspellsorder):
        pass
    else:
        if 'subclasses' in spell:
            if not 'Cleric (Order)' in spell['subclasses']:
                spell['subclasses'].append('Cleric (Order)')
        else:
            spell['subclasses'] = ['Cleric (Order)']

    if not any(x in spell['name'] for x in subspellsnat):
        pass
    else:
        if 'subclasses' in spell:
            if not 'Cleric (Nature)' in spell['subclasses']:
                spell['subclasses'].append('Cleric (Nature)')
        else:
            spell['subclasses'] = ['Cleric (Nature)']

    if not any(x in spell['name'] for x in subspellslight):
        pass
    else:
        if 'subclasses' in spell:
            if not 'Cleric (Light)' in spell['subclasses']:
                spell['subclasses'].append('Cleric (Light)')
        else:
            spell['subclasses'] = ['Cleric (Light)']

    if not any(x in spell['name'] for x in subspellslife):
        pass
    else:
        if 'subclasses' in spell:
            if not 'Cleric (Life)' in spell['subclasses']:
                spell['subclasses'].append('Cleric (Life)')
        else:
            spell['subclasses'] = ['Cleric (Life)']

    if not any(x in spell['name'] for x in subspellsknow):
        pass
    else:
        if 'subclasses' in spell:
            if not 'Cleric (Knowledge)' in spell['subclasses']:
                spell['subclasses'].append('Cleric (Knowledge)')
        else:
            spell['subclasses'] = ['Cleric (Knowledge)']

    if not any(x in spell['name'] for x in subspellsgrave):
        pass
    else:
        if 'subclasses' in spell:
            if not 'Cleric (Grave)' in spell['subclasses']:
                spell['subclasses'].append('Cleric (Grave)')
        else:
            spell['subclasses'] = ['Cleric (Grave)']

    if not any(x in spell['name'] for x in subspellsforge):
        pass
    else:
        if 'subclasses' in spell:
            if not 'Cleric (Forge)' in spell['subclasses']:
                spell['subclasses'].append('Cleric (Forge)')
        else:
            spell['subclasses'] = ['Cleric (Forge)']

    if not any(x in spell['name'] for x in subspellsdeath):
        pass
    else:
        if 'subclasses' in spell:
            if not 'Cleric (Death)' in spell['subclasses']:
                spell['subclasses'].append('Cleric (Death)')
        else:
            spell['subclasses'] = ['Cleric (Death)']

    if not any(x in spell['name'] for x in subspellsarca):
        pass
    else:
        if 'subclasses' in spell:
            if not 'Cleric (Arcana)' in spell['subclasses']:
                spell['subclasses'].append('Cleric (Arcana)')
        else:
            spell['subclasses'] = ['Cleric (Arcana)']

    if not any(x in spell['name'] for x in subspellsglam):
        pass
    else:
        if 'subclasses' in spell:
            if not 'Bard (Glamour)' in spell['subclasses']:
                spell['subclasses'].append('Bard (Glamour)')
        else:
            spell['subclasses'] = ['Bard (Glamour)']

    if not any(x in spell['name'] for x in subspellsbatt):
        pass
    else:
        if 'subclasses' in spell:
            if not 'Artificer (Battle Smith)' in spell['subclasses']:
                spell['subclasses'].append('Artificer (Battle Smith)')
        else:
            spell['subclasses'] = ['Artificer (Battle Smith)']

    if not any(x in spell['name'] for x in subspellsartil):
        pass
    else:
        if 'subclasses' in spell:
            if not 'Artificer (Artillerist)' in spell['subclasses']:
                spell['subclasses'].append('Artificer (Artillerist)')
        else:
            spell['subclasses'] = ['Artificer (Artillerist)']

    if not any(x in spell['name'] for x in subspellsarm):
        pass
    else:
        if 'subclasses' in spell:
            if not 'Artificer (Armorer)' in spell['subclasses']:
                spell['subclasses'].append('Artificer (Armorer)')
        else:
            spell['subclasses'] = ['Artificer (Armorer)']

    if not any(x in spell['name'] for x in subspellsalch):
        pass
    else:
        if 'subclasses' in spell:
            if not 'Artificer (Alchemist)' in spell['subclasses']:
                spell['subclasses'].append('Artificer (Alchemist)')
        else:
            spell['subclasses'] = ['Artificer (Alchemist)']

    return spell


def main():
    col = getspellscollection()
    spells = [x for x in col.find(projection={'_id': False})]
    for spell in spells:
        updatedspell = addsubs(spell)

        updatedspell["subclasses"] = updatedspell.get("subclasses", [])

        mongodb.getcollection('spells').replace_one({'spellid': updatedspell['spellid']}, updatedspell, upsert=True)


if __name__ == "__main__":
    main()
