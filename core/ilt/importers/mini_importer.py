import json
import os

import ilt
from ilt.dal import mongodb


def main():
    root_importers_path = ilt.__path__[0]
    filelocation = os.path.join(root_importers_path, 'importers', 'content', 'frost.json')

    with open(filelocation) as file:
        frost = json.load(file)
        for spell in frost:
            mongodb.getcollection('spells').replace_one({'spellid': spell['spellid']}, spell, upsert=True)

    filelocation = os.path.join(root_importers_path, 'importers', 'content', 'ftod.json')

    with open(filelocation) as file:
        ftod = json.load(file)
        for spell in ftod:
            mongodb.getcollection('spells').replace_one({'spellid': spell['spellid']}, spell, upsert=True)

    filelocation = os.path.join(root_importers_path, 'importers', 'content', 'kwalish.json')

    with open(filelocation) as file:
        kwalish = json.load(file)
        for spell in kwalish:
            mongodb.getcollection('spells').replace_one({'spellid': spell['spellid']}, spell, upsert=True)

    filelocation = os.path.join(root_importers_path, 'importers', 'content', 'strix.json')

    with open(filelocation) as file:
        strix = json.load(file)
    for spell in strix:
        mongodb.getcollection('spells').replace_one({'spellid': spell['spellid']}, spell, upsert=True)

    return 1


if __name__ == "__main__":
    main()
