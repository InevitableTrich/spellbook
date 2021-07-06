import pymongo
from ilt.config import env

DB_CLIENT = None

def connect():
    config = env.globalconfig

def getdatabase(dbname):
    return DB_CLIENT[dbname]

DB_CLIENT = connect()
