import re

import ilt
import os
import json
from ilt.dal import mongodb


class SpellImporter:
    ROOT_IMPORT_PATH = ilt.__path__[0]

    def __init__(self):
        self._spell_count = 0
        self._spell_list = []

    @property
    def spell_list(self):
        return self._spell_list

    def from_json(self, filename):
        filelocation = os.path.join(SpellImporter.ROOT_IMPORT_PATH, 'importers', 'content', 'books', filename + '.json')
        with (open(filelocation) as file):
            spells = json.load(file)
            for spell in spells:
                # handle if spell has one source listed
                if type(spell['source']) == str:
                    spell['source'] = [spell['source']]

                # handle conditional reaction cast times
                spell['condition'] = ''
                if type(spell['cast_time']) == list:
                    spell['condition'] = spell['cast_time'][1]
                    spell['cast_time'] = spell['cast_time'][0]

                # split other cast time format
                if ',' in spell['cast_time']:
                    cast_time = spell['cast_time'].split(',')
                    spell['condition'] = cast_time[1]
                    spell['cast_time'] = cast_time[0]

                # give conditional cast times separation
                if '(' in spell['cast_time'] or ')' in spell['cast_time']:
                    spell['condition'] = spell['cast_time']
                    spell['cast_time'] = "Conditional"

                # format cast_times to be the same
                regex = re.compile(r'^1 [\w ]*action[\w ]*$')
                if regex.match(spell['cast_time']):
                    spell['cast_time'] = spell['cast_time'][2:]
                    spell['cast_time'] = spell['cast_time'].title()

                # number each spell
                spell['spell_num'] = self._spell_count

                # handle spell duration beginning with "up to " for concentration spells
                if spell['duration'].startswith('up to ') or spell['duration'].startswith('Up to '):
                    spell['duration'] = spell['duration'][6:]

                # handle spell duration beginning with "concentration"
                if spell['duration'].startswith("Concentration"):
                    spell['concentration'] = True
                    spell['duration'] = spell['duration'][20:]

                if '(' in spell['duration'] or ')' in spell['duration']:
                    spell['duration'] = "Special"

                if spell['duration'] == "Until dispelled or triggered":
                    spell['duration'] = "Until dispelled"

                # handle range separation into range and direction
                spell['direction'] = ''
                if spell['range'].startswith('Self'):
                    spell['direction'] = spell['range'][6:-1]
                    spell['range'] = 'Self'

                # replace instances of R component with coin amount to the R component, and the coin
                # amount into the royalty slot
                spell['royalty'] = ''
                for component in spell['components']:
                    if component.startswith('R'):
                        spell['royalty'] = component[3:-1]
                        spell['components'].remove(component)
                        spell['components'].append('R')

                if ("Wizard" in spell["classes"]) and (int(spell["level"]) < 5):
                    school = spell["school"]
                    if "Player's Handbook 2024" in spell['source']:
                        spell['classes'].append("Fighter")
                        spell['classes'].append("Rogue")
                    elif school == "Enchantment" or school == "Illusion":
                        spell["classes"].append("Rogue")
                    elif school == "Abjuration" or school == "Evocation":
                        spell["classes"].append("Fighter")

                self._spell_list.append(spell)
                self._spell_count += 1

    def upload_spells(self):
        spells_collection = mongodb.getcollection("spells")

        for spell in self._spell_list:
            spells_collection.replace_one({"spell_num": spell["spell_num"]}, spell, upsert=True)
