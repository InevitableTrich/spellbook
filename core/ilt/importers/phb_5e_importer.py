from gql import gql, Client
from gql.transport.aiohttp import AIOHTTPTransport
from ilt.dal import mongodb
import ilt
import os
import json


def checknames(spell):
    badnames = ['Instant Summons',
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

    mongodb.getcollection('spells').replace_one({'spellid': spell['spellid']}, spell, upsert=True)

root_importers_path = ilt.__path__[0]
filelocation = os.path.join(root_importers_path, 'importers', 'content', 'phb.json')
with open(filelocation) as file:
    phb = json.load(file)
    for spell in phb:
        mongodb.getcollection('spells').replace_one({'spellid': spell['spellid']}, spell, upsert=True)
