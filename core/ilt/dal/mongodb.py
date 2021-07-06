import pymongo
from pymongo import MongoClient
from ilt.config import env

DB_CLIENT = None
DB_NAME = None


def connect():
    config = env.GLOBALCONFIG
    return MongoClient(config['mongodb']['connectionstring'])


def _getdbname():
    return env.GLOBALCONFIG['mongodb']['dbname']


def _getdatabase(client, dbname):
    return client[dbname]


def getcollection(collection):
    return _getdatabase(DB_CLIENT, DB_NAME)[collection]


DB_CLIENT = connect()
DB_NAME = _getdbname()
