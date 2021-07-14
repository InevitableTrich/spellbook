import pymongo
import json
from ilt.dal import mongodb


def getspellscollection():
    return mongodb.getcollection('spells')


def getspells(sort='name', sortby=pymongo.ASCENDING):
    col = getspellscollection()

    spells = [x for x in col.find(projection={'_id': False}).sort(sort, sortby)]
    return spells


def filter_spells(filters, sort='name', sortby=pymongo.ASCENDING):
    col = getspellscollection()

    output = {}
    for field, values in filters.items():
        output[field] = {"$in": values}

    spells = [x for x in col.find(filter=output, projection={'_id': False}).sort(sort, sortby)]
    return spells
