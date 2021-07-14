import pymongo
from ilt.dal import mongodb


def getspellscollection():
    return mongodb.getcollection('spells')


def getspells(sort='name', sortby=pymongo.ASCENDING):
    col = getspellscollection()

    spells = [x for x in col.find(projection={'_id': False}).sort(sort, sortby)]
    return spells


def filter_spells(filters, sort='name', sortby=pymongo.ASCENDING):
    col = getspellscollection()

    formatted_filter = {}
    for field, values in filters.items():
        formatted_filter[field] = {"$in": values}

    spells = [x for x in col.find(filter=formatted_filter, projection={'_id': False}).sort(sort, sortby)]
    return spells


def searchspells(query):
    col = getspellscollection()

    spells = [x for x in col.find({"$text": {"$search": query}}, projection={'_id': False})]
    return spells
