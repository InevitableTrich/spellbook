import pymongo
import json
from ilt.managers import spellmgr


class FilterSpellsViewImpl(object):
    def do_post(self, data, *args, **kwargs):
        if data['loc'] == 'l':
            filterdata = json.loads(data['body'])['filter']
        else:
            filterdata = data.get("filter", {})

        page = int(data.get('pagenum'))
        spellsperpage = int(data.get('spellsperpage'))
        field = data.get('field')
        direction = data.get('direction')
        searchquery = data.get('searchquery')
        spellskwargs = {}

        spellnumsstart = (page - 1) * spellsperpage
        spellnumsend = (page * spellsperpage)

        if field:
            sortfield = field[0:-4]
            if sortfield == 'class':
                sortfield = 'classes'
            spellskwargs['sort'] = sortfield

        if direction == '1':
            sortdir = pymongo.ASCENDING
            spellskwargs['sortby'] = sortdir
        elif direction == '2':
            sortdir = pymongo.DESCENDING
            spellskwargs['sortby'] = sortdir
        if searchquery == '':
            spells, spellscount = spellmgr.filter_spells(filterdata, spellnumsstart, spellnumsend, **spellskwargs)
            return {"spells": spells, "spellscount": spellscount}

        spells, spellscount = spellmgr.search_filter_spells(filterdata, searchquery, spellnumsstart, spellnumsend,
                                                            **spellskwargs)
        return {"spells": spells, "spellscount": spellscount}