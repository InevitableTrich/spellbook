from gql import gql, Client
from gql.transport.aiohttp import AIOHTTPTransport
from ilt.dal import mongodb

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
    mongodb.getcollection('spells').replace_one({'spellid': spell['spellid']}, spell, upsert=True)
