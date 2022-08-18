import json
import os

import ilt
from ilt.dal import mongodb


def main():
    root_importers_path = ilt.__path__[0]
    filelocation = os.path.join(root_importers_path, 'importers', 'content', 'xgte.json')

    with open(filelocation) as file:
        xgte = json.load(file)
        for spell in xgte:
            mongodb.getcollection('spells').replace_one({'spellid': spell['spellid']}, spell, upsert=True)

    return 1


if __name__ == "__main__":
    main()
