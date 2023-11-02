import pymongo
from ilt.dal import mongodb


def getspellscollection():
    return mongodb.getcollection('spells')


def filter_spells(filters, searchquery, sort='name', sortby=pymongo.ASCENDING):
    col = getspellscollection()

    formatted_filter = {'$and': [{'$or': [{"classes": {"$in": []}}]}]}
    if filters == {}:
        formatted_filter = {}
    else:
        for field, values in filters.items():
            if field == "subs":
                formatted_filter["$and"][0]["$or"].append({"subclasses": {"$in": values}})
            elif field == "classes":
                formatted_filter["$and"][0]["$or"].append({"classes": {"$in": values}})
            else:
                formatted_filter["$and"].append({field: {"$in": values}})
        if formatted_filter["$and"][0]["$or"] == [{"classes": {"$in": []}}]:
            formatted_filter["$and"][0].pop("$or")

    if searchquery:
        formatted_filter["$text"] = {"$search": ""}

    return [x for x in col.find(filter=formatted_filter, projection={'_id': False})
                          .sort([(sort, sortby), ("name", sortby)])]


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
