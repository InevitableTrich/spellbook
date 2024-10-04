import json

from spell_importer import spell_list


def add_subclasses():
    with open("content/subclasses/subclasses.json") as subs:
        subclasses = json.load(subs)

    for spell in spell_list:
        spell["subclasses"] = spell.get("subclasses", [])

        for subclass, sub_spells in subclasses.items():
            if spell["name"] in sub_spells:
                spell["subclasses"].append(subclass)
