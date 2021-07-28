import pymongo
from ilt.dal import mongodb


def getspellscollection():
    return mongodb.getcollection('spells')


def getspells(sort='name', sortby=pymongo.ASCENDING):
    col = getspellscollection()

    spells = [x for x in col.find(projection={'_id': False}).sort(sort, sortby)]
    return spells


def filter_spells(filters, pagestart, pageend, sort='name', sortby=pymongo.ASCENDING):
    col = getspellscollection()

    formatted_filter = {}
    for field, values in filters.items():
        formatted_filter[field] = {"$in": values}

    # formatted_filter['level'] = {"$in":["0","1","2"]}

    spells = [x for x in col.find(filter=formatted_filter, projection={'_id': False}).sort(sort, sortby)[pagestart:pageend]]
    spellscount = col.count_documents(filter=formatted_filter)
    return spells, spellscount


def search_filter_spells(filters, searchquery, pagestart, pageend, sort='name', sortby=pymongo.ASCENDING):
    col = getspellscollection()

    formatted_filter = {}
    for field, values in filters.items():
        formatted_filter[field] = {"$in": values}
    formatted_filter["$text"] = {"$search": searchquery}

    spells = [x for x in col.find(filter=formatted_filter, projection={'_id': False}).sort(sort, sortby)[pagestart:pageend]]
    spellscount = col.count_documents(filter=formatted_filter)
    return spells, spellscount
