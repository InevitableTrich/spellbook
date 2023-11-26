import ilt
import os
import json
from ilt.dal import mongodb

ROOT_IMPORT_PATH = ilt.__path__[0]
spell_count = 0

def import_spells(filename):
    global spell_count

    filelocation = os.path.join(ROOT_IMPORT_PATH, 'importers', 'content', filename + '.json')
    with open(filelocation) as file:
        spells = json.load(file)
        for spell in spells:
            # number each spell
            spell['spell_num'] = spell_count

            # handle conditional reaction cast times
            spell['condition'] = ''
            if type(spell['cast_time']) == list:
                spell['condition'] = spell['cast_time'][1]
                spell['cast_time'] = spell['cast_time'][0]

            # handle if spell has one source listed
            if type(spell['source']) == str:
                spell['source'] = [spell['source']]

            # handle spell duration beginning with "up to " for concentration spells
            if spell['duration'].startswith('up to ') or spell['duration'].startswith('Up to '):
                spell['duration'] = spell['duration'][6:]

            spell['direction'] = ''
            if spell['range'].startswith('Self'):
                spell['direction'] = spell['range'][6:-1]
                spell['range'] = 'Self'

            spell['royalty'] = ''
            for component in spell['components']:
                if component.startswith('R'):
                    spell['royalty'] = component[3:-1]
                    spell['components'].remove(component)
                    spell['components'].append('R')


            mongodb.getcollection('spells').replace_one({'spell_num': spell['spell_num']}, spell, upsert=True)

            spell_count += 1