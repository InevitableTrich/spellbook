import pymongo
from ilt.dal import mongodb


def getspellscollection():
    return mongodb.getcollection('spells')

def get_spells():
    col = getspellscollection()
    return [x for x in col.find(projection={'_id': False}).sort("spell_num", pymongo.ASCENDING)]

def get_spell_count():
    col = getspellscollection()
    return col.count_documents({})

def get_spells_from(index: int):
    col = getspellscollection()
    return [x for x in col.find(projection={'_id': False}).sort("name", pymongo.ASCENDING).skip(index * 30).limit(30)]
