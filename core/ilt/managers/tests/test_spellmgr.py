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

    def test_filterspells(self):
        filter = {"level": ["0", "3"], "school": ["Evocation"]}
        spells = spellmgr.filter_spells(filter)
        self.assertEqual(2, len(spells))
        expectedspellids = {'fireball', 'booming_blade'}
        returnedspellids = set()

        for spelldict in spells:
            returnedspellids.add(spelldict['spellid'])

        self.assertEqual(expectedspellids, returnedspellids)
