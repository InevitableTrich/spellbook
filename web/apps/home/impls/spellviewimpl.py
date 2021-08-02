import pymongo
from ilt.managers import spellmgr


class FilterSpellsViewImpl(object):
    def do_post(self, data, *args, **kwargs):
        filterdata = data.get("filter", {})

        page = int(data.get('pagenum'))
        field = data.get('field')
        direction = data.get('direction')
        searchquery = data.get('searchquery')
        spellskwargs = {}

        spellnumsstart = (page - 1) * 50
        spellnumsend = (page * 50)

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