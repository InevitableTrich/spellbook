import json
from ilt.managers import spellmgr


class BookSpellsViewImpl(object):
    def do_post(self, data, *args, **kwargs):
        try:
            id_list = json.loads(data['body'])['book']
            char = json.loads(data['body'])['char']
        except:
            id_list = data.get("book", {})
            char = data.get("char", {})

        spells = spellmgr.get_book_spells(id_list)
        return {"spells": spells, "char": char}


class SpellsViewImpl(object):
    def do_post(self, data, *args, **kwargs):
        return {"spells": spellmgr.get_spells()}
