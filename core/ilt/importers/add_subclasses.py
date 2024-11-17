import json

from spell_importer import SpellImporter


def add_subclasses(importer: SpellImporter):
    with open("content/subclasses/subclasses.json") as subs:
        subclasses = json.load(subs)

    for spell in importer.spell_list:
        spell["subclasses"] = spell.get("subclasses", [])

        for subclass, sub_spells in subclasses.items():
            # add phb subclasses only to corresponding year
            if '2024' in subclass:
                if "Player's Handbook 2024" in spell['source'] and spell["name"] in sub_spells:
                    if '-2024' in subclass:
                        spell["subclasses"].append(subclass[:-6])
                    else:
                        spell["subclasses"].append(subclass)
            elif '2014' in subclass:
                if "Player's Handbook 2014" in spell['source'] and spell["name"] in sub_spells:
                    if '-2014' in subclass:
                        spell["subclasses"].append(subclass[:-6])
                    else:
                        spell["subclasses"].append(subclass)

            # otherwise add normally, prioritizing 2014
            elif spell["name"] in sub_spells and "Player's Handbook 2014" in spell['source']\
                    or spell["name"] in sub_spells and "Player's Handbook 2024" not in spell['source']:
                spell["subclasses"].append(subclass)