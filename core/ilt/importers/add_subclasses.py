import json

from spell_importer import SpellImporter


def add_subclasses(importer: SpellImporter):
    with open("content/subclasses/subclasses.json") as subs:
        subclasses = json.load(subs)

    for spell in importer.spell_list:
        spell["subclasses"] = spell.get("subclasses", [])

        for subclass, sub_spells in subclasses.items():
            if spell["name"] in sub_spells:
                spell["subclasses"].append(subclass)
