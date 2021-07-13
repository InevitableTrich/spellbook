import unittest
from ilt.managers import spellmgr


class TestSpellmgr(unittest.TestCase):
    def test_getspellcol(self):
        self.assertEqual('spells', spellmgr.getspellscollection().name)
        self.assertEqual('spellsdb', spellmgr.getspellscollection().database.name)

    def test_getspells(self):
        # self.assertEqual('not writing that', spellmgr.getspells())
        # essentially prints whole heckin thing
        pass
