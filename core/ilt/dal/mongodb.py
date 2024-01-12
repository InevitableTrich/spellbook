import certifi
from pymongo import MongoClient
from ilt.config import env


def connect():
    config = env.GLOBALCONFIG
    mongodbconfig = config['mongodb']
    if mongodbconfig.get('username'):
        # auth
        username = mongodbconfig['username']
        password = mongodbconfig['password']
        mongodburl = mongodbconfig['connectionstring']
        return MongoClient('mongodb+srv://' + username + ':' + password + '@' + mongodburl, tlsCAFile=certifi.where())

    return MongoClient(config['mongodb']['connectionstring'])


def _getdbname():
    return env.GLOBALCONFIG['mongodb']['dbname']


def _getdatabase(client, dbname):
    return client[dbname]


def getcollection(collection):
    return _getdatabase(DB_CLIENT, DB_NAME)[collection]


DB_CLIENT = connect()
DB_NAME = _getdbname()
