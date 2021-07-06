from ilt.dal import mongodb


def getspellscollection():
    return mongodb.getcollection('spells')


def getspells():
    col = getspellscollection()
    spells = [x for x in col.find(projection={'_id': False})]
    return spells
