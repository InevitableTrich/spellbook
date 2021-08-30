from gql import gql, Client
from gql.transport.aiohttp import AIOHTTPTransport
from ilt.dal import mongodb
import ilt
import os
import json


def addartificer(spell):
    artificerspells = [
        'Acid Splash',
        'Dancing Lights',
        'Fire Bolt',
        'Guidance',
        'Light',
        'Mage Hand',
        'Mending',
        'Message',
        'Poison Spray',
        'Prestidigitation',
        'Ray of Frost',
        'Resistance',
        'Shocking Grasp',
        'Spare the Dying',
        'Thorn Whip',
        'Alarm',
        'Cure Wounds',
        'Detect Magic',
        'Disguise Self',
        'Expeditius Retreat',
        'Faerie Fire',
        'False Life',
        'Grease',
        'Identify',
        'Jump',
        'Longstrider',
        'Purify Food and Drink',
        'Sanctuary',
        'Aid',
        'Alter Self',
        'Arcane Lock',
        'Blur',
        'Continual Flame',
        'Darkvision',
        'Enhance Ability',
        'Enlarge/Reduce',
        'Heat Metal',
        'Invisibility',
        'Lesser Restoration',
        'Levitate',
        'Magic Mouth',
        'Magic Weapon',
        'Protection from Poison',
        'Rope Trick',
        'See Invisibility',
        'Spider Climb',
        'Web',
        'Blink',
        'Create Food and Water',
        'Dispel Magic',
        'Elemental Weapon',
        'Fly',
        'Glyph of Warding',
        'Haste',
        'Protection from Energy',
        'Revivify',
        'Water Breathing',
        'Water Walk',
        'Arcane Eye',
        'Fabricate',
        'Freedom of Movement',
        'Leomund\'s Secret Chest',
        'Mordenkainen\'s Faithful Hound',
        'Mordenkainen\'s Private Sanctum',
        'Otiluke\'s Resilient Sphere',
        'Stone Shape',
        'Stoneskin',
        'Animate Objects',
        'Bigby\'s Hand',
        'Creation',
        'Greater Restoration',
        'Wall of Stone',
    ]
    if not any(x in spell['name'] for x in artificerspells):
        return spell
    spell['classes'].append('Artificer')
    return spell


def checknames(spell):
    badnames = ['Instant Summons',
                'Black Tentacles',
                'Secret Chest',
                'Tiny Hut',
                'Acid Arrow',
                'Faithful Hound',
                'Magnificent Mansion',
                'Private Sanctum',
                'Arcane Sword',
                'Arcanist\'s Magic Aura',
                'Freezing Sphere',
                'Resilient Sphere',
                'Irresistible Dance',
                'Telepathic Bond',
                'Hideous Laughter',
                'Floating Disk']

    if not any(x in spell['name'] for x in badnames):
        return spell

    if spell['name'] == 'Instant Summons':
        spell['name'] = 'Drawmij\'s Instant Summons'
    elif spell['name'] == 'Black Tentacles':
        spell['name'] = 'Evard\'s Black Tentacles'
    elif spell['name'] == 'Secret Chest':
        spell['name'] = 'Leomunds Secret Chest'
    elif spell['name'] == 'Tiny Hut':
        spell['name'] = 'Leomunds Tiny Hut'
    elif spell['name'] == 'Acid Arrow':
        spell['name'] = 'Melf\'s Acid Arrow'
    elif spell['name'] == 'Faithful Hound':
        spell['name'] = 'Mordenkainen\'s Faithful Hound'
    elif spell['name'] == 'Magnificent Mansion':
        spell['name'] = 'Mordenkainen\'s  Magnificent Mansion'
    elif spell['name'] == 'Private Sanctum':
        spell['name'] = 'Mordenkainen\'s Private Sanctum'
    elif spell['name'] == 'Arcane Sword':
        spell['name'] = 'Mordenkainen\'s Sword'
    elif spell['name'] == 'Arcanist\'s Magic Aura':
        spell['name'] = 'Nystul\'s Magic Aura'
    elif spell['name'] == 'Freezing Sphere':
        spell['name'] = 'Otiluke\'s Freezing Sphere'
    elif spell['name'] == 'Resilient Sphere':
        spell['name'] = 'Otiluke\'s Resilient Sphere'
    elif spell['name'] == 'Irresistible Dance':
        spell['name'] = 'Otto\'s Irresistible Dance'
    elif spell['name'] == 'Telepathic Bond':
        spell['name'] = 'Rary\'s Telepathic Bond'
    elif spell['name'] == 'Hideous Laughter':
        spell['name'] = 'Tasha\'s Hideous Laughter'
    elif spell['name'] == 'Floating Disk':
        spell['name'] = 'Tenser\'s Floating Disk'

    return spell


transport = AIOHTTPTransport(url="https://www.dnd5eapi.co/graphql")

client = Client(transport=transport, fetch_schema_from_transport=True)

query = gql(
    """
    query getSpells {
        spells(limit:500) {
            index
            name
            level
            classes{name}
            school{name}
            casting_time
            duration
            range
            components
            material
            ritual
            concentration
            desc
            higher_level
        }
    }
"""
)

result = client.execute(query)
spells = result['spells']

for spell in spells:
    preparedclasses = [spellclass['name'] for spellclass in spell['classes']]
    preparedschool = spell['school']['name']

    spell['classes'] = preparedclasses
    spell['school'] = preparedschool
    if not spell['material']:
        spell['material'] = ''
    spell['spellid'] = spell.pop('index')
    spell['cast_time'] = spell.pop('casting_time')
    spell['level'] = str(spell['level'])
    spell['source'] = "Players Handbook"
    spell = checknames(spell)
    spell = addartificer(spell)

    mongodb.getcollection('spells').replace_one({'spellid': spell['spellid']}, spell, upsert=True)

root_importers_path = ilt.__path__[0]
filelocation = os.path.join(root_importers_path, 'importers', 'content', 'phb.json')
with open(filelocation) as file:
    phb = json.load(file)
    for spell in phb:
        mongodb.getcollection('spells').replace_one({'spellid': spell['spellid']}, spell, upsert=True)
