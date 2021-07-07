import unittest
from ilt.dal import mongodb


class TestMongodb(unittest.TestCase):
    def test_connection(self):
        self.assertEqual(('localhost', 27017), mongodb.connect().address)

    def test_dbname(self):
        self.assertEqual('spellsdb', mongodb._getdbname())

    def test_getdb(self):
        self.assertEqual('spellsdb', mongodb._getdatabase(mongodb.DB_CLIENT, mongodb.DB_NAME).name)

    def test_getcol(self):
        self.assertEqual('spells', mongodb.getcollection('spells').name)
        self.assertEqual('spellsdb', mongodb.getcollection('spells').database.name)
