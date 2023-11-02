import pymongo
import json
from ilt.managers import spellmgr


class FilterSpellsViewImpl(object):
    def do_post(self, data, *args, **kwargs):
        if data.get('loc') == 'l':
            filterdata = json.loads(data['body'])['filter']
        else:
            filterdata = data.get("filter", {})

        field = data.get('field')
        direction = data.get('direction')
        searchquery = data.get('searchquery')
        spellskwargs = {}

        if field:
            sortfield = field[0:-4]
            if sortfield == 'class':
                sortfield = 'classes'
            spellskwargs['sort'] = sortfield

        if direction == '2':
            spellskwargs['sortby'] = pymongo.DESCENDING

        if searchquery == '':
            searchquery = None

        return {"spells": spellmgr.filter_spells(filterdata, searchquery, **spellskwargs)}


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
