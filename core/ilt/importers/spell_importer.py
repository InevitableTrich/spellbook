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
            spell['spell_num'] = spell_count

            mongodb.getcollection('spells').replace_one({'spellid': spell['spellid']}, spell, upsert=True)

            spell_count += 1
