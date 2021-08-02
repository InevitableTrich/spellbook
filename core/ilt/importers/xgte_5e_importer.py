from ilt.dal import mongodb
import json


with open('C:/Users/Trich/Dev/spellbook/static/json/xgte.json') as file:
    xgte = json.load(file)
    for spell in xgte:
        mongodb.getcollection('spells').replace_one({'spellid': spell['spellid']}, spell, upsert=True)
