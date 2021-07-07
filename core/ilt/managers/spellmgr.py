import pymongo

from ilt.dal import mongodb


def getspellscollection():
    return mongodb.getcollection('spells')


def getspells(sort='name', sortby=pymongo.ASCENDING):
    col = getspellscollection()
    if not sort:
        sort = 'name'
    if not sortby:
        sortby = 1
    spells = [x for x in col.find(projection={'_id': False}).sort(sort, sortby)]
    return spells
