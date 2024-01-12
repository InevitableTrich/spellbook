import pymongo
from ilt.dal import mongodb


def getspellscollection():
    return mongodb.getcollection('spells')

def get_spells():
    col = getspellscollection()
    return [x for x in col.find(projection={'_id': False}).sort("spell_num", pymongo.ASCENDING)]
