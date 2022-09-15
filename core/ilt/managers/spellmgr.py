import pymongo
from ilt.dal import mongodb


def getspellscollection():
    return mongodb.getcollection('spells')


def getspells(sort='name', sortby=pymongo.ASCENDING):
    col = getspellscollection()

    if sort == "name":
        spells = [x for x in col.find(projection={"_id": False}).sort(sort, sortby)]
    else:
        spells = [x for x in col.find(projection={"_id": False}).sort([(sort, sortby), ("name", sortby)])]
    return spells


def filter_spells(filters, pagestart, sort='name', sortby=pymongo.ASCENDING):
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

    spells = [x for x in col.find(filter=formatted_filter, skip=pagestart, projection={'_id': False}).sort(
        [(sort, sortby), ("name", sortby)]).limit(30)]

    spellscount = col.count_documents(filter=formatted_filter)
    return spells, spellscount


def search_filter_spells(filters, searchquery, pagestart, sort='name', sortby=pymongo.ASCENDING):
    col = getspellscollection()

    formatted_filter = {}
    for field, values in filters.items():
        formatted_filter[field] = {"$in": values}
    formatted_filter["$text"] = {"$search": searchquery}

    if sort == "name":
        spells = [x for x in
                  col.find(filter=formatted_filter, projection={'_id': False}, skip=pagestart).sort(sort, sortby).limit(30)]
    else:
        spells = [x for x in col.find(filter=formatted_filter, projection={'_id': False}, skip=pagestart).sort(
            [(sort, sortby), ("name", sortby)]).limit(30)]

    spellscount = col.count_documents(filter=formatted_filter)
    return spells, spellscount


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
