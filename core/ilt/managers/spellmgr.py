import pymongo

from ilt.dal import mongodb


def getspellscollection():
    return mongodb.getcollection('spells')


def getspells(sort='name', sortby=pymongo.ASCENDING):
    col = getspellscollection()

    spells = [x for x in col.find(projection={'_id': False}).sort(sort, sortby)]
    return spells
