import pymongo
from ilt.dal import mongodb


def getspellscollection():
    return mongodb.getcollection('spells')

def get_book_spells(ids):
    col = getspellscollection()
    if len(ids) == 0:
        return []
    formatted_ids = {"$or": []}
    for id in ids:
        formatted_ids["$or"].append({"spellid": id})

    spells = [x for x in col.find(filter=formatted_ids, projection={'_id': False}).sort([("level", pymongo.ASCENDING),
                                                                                         ("name", pymongo.ASCENDING)])]
    return spells

def get_spells():
    col = getspellscollection()
    return [x for x in col.find(projection={'_id': False}).sort("spell_num", pymongo.ASCENDING)]
