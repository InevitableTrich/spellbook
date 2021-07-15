import unittest
from ilt.managers import spellmgr


class TestSpellmgr(unittest.TestCase):
    def test_getspellcol(self):
        self.assertEqual('spells', spellmgr.getspellscollection().name)
        self.assertEqual('spellsdb', spellmgr.getspellscollection().database.name)

    def test_filterspells(self):
        # level 0,3 ; school evo filter
        filter_v = {'level': ['0', '3'], 'school': ['Evocation']}
        spells = spellmgr.filter_spells(filter_v)
        self.assertEqual(2, len(spells))
        expectedspellids = {'fireball', 'booming_blade'}
        returnedspellids = set()

        for spelldict in spells:
            returnedspellids.add(spelldict['spellid'])

        self.assertEqual(expectedspellids, returnedspellids)

        # level 3 filter
        filter_v = {'level': ['3']}
        spells = spellmgr.filter_spells(filter_v)
        self.assertEqual(2, len(spells))
        expectedspellids = {'fireball', 'counterspell'}
        returnedspellids = set()

        for spelldict in spells:
            returnedspellids.add(spelldict['spellid'])

        self.assertEqual(expectedspellids, returnedspellids)

        # no concentration or ritual
        filter_v = {'concentration': [False], 'ritual': [False]}
        spells = spellmgr.filter_spells(filter_v)
        self.assertEqual(5, len(spells))
        expectedspellids = {'fireball', 'counterspell', 'acid_arrow', 'booming_blade', 'chaos_bolt'}
        returnedspellids = set()

        for spelldict in spells:
            returnedspellids.add(spelldict['spellid'])

        self.assertEqual(expectedspellids, returnedspellids)

        # fighter class
        filter_v = {'classes': ['Fighter (Eldritch Knight)']}
        spells = spellmgr.filter_spells(filter_v)
        self.assertEqual(4, len(spells))
        expectedspellids = {'fireball', 'counterspell', 'acid_arrow', 'booming_blade'}
        returnedspellids = set()

        for spelldict in spells:
            returnedspellids.add(spelldict['spellid'])

        self.assertEqual(expectedspellids, returnedspellids)

        # sorcerer class
        filter_v = {'classes': ['Sorcerer']}
        spells = spellmgr.filter_spells(filter_v)
        self.assertEqual(4, len(spells))
        expectedspellids = {'fireball', 'counterspell', 'chaos_bolt', 'booming_blade'}
        returnedspellids = set()

        for spelldict in spells:
            returnedspellids.add(spelldict['spellid'])

        self.assertEqual(expectedspellids, returnedspellids)

        # sorcerer l1,3 s: evo, no concentration
        filter_v = {'classes': ['Sorcerer'], 'level': ['1', '3'], 'school': ['Evocation'], 'concentration': [False]}
        spells = spellmgr.filter_spells(filter_v)
        self.assertEqual(2, len(spells))
        expectedspellids = {'fireball', 'chaos_bolt'}
        returnedspellids = set()

        for spelldict in spells:
            returnedspellids.add(spelldict['spellid'])

        self.assertEqual(expectedspellids, returnedspellids)

        # wizard l2,3 s: abj,evo, 1 action
        filter_v = {'classes': ['Wizard'], 'level': ['2', '3'], 'school': ['Abjuration', 'Evocation'], 'cast_time':
            ['1 action']}
        spells = spellmgr.filter_spells(filter_v)
        self.assertEqual(2, len(spells))
        expectedspellids = {'fireball', 'acid_arrow'}
        returnedspellids = set()

        for spelldict in spells:
            returnedspellids.add(spelldict['spellid'])

        self.assertEqual(expectedspellids, returnedspellids)

    def test_search_filter_spells(self):
        # q: 'fire'
        filter_v = {}
        searchquery = 'fire'
        spells = spellmgr.search_filter_spells(filter_v, searchquery)
        self.assertEqual(2, len(spells))
        expectedspellids = {'fireball', 'chaos_bolt'}
        returnedspellids = set()

        for spelldict in spells:
            returnedspellids.add(spelldict['spellid'])

        self.assertEqual(expectedspellids, returnedspellids)

        # q: 'fire', l1
        filter_v = {'level': ['1']}
        searchquery = 'fire'
        spells = spellmgr.search_filter_spells(filter_v, searchquery)
        self.assertEqual(1, len(spells))
        expectedspellids = {'chaos_bolt'}
        returnedspellids = set()

        for spelldict in spells:
            returnedspellids.add(spelldict['spellid'])

        self.assertEqual(expectedspellids, returnedspellids)

        # q: 'self', l0
        filter_v = {'level': ['0']}
        searchquery = 'self'
        spells = spellmgr.search_filter_spells(filter_v, searchquery)
        self.assertEqual(1, len(spells))
        expectedspellids = {'booming_blade'}
        returnedspellids = set()

        for spelldict in spells:
            returnedspellids.add(spelldict['spellid'])

        self.assertEqual(expectedspellids, returnedspellids)

        # q: '3', l1
        filter_v = {'level': ['1']}
        searchquery = '3'
        spells = spellmgr.search_filter_spells(filter_v, searchquery)
        self.assertEqual(1, len(spells))
        expectedspellids = {'chaos_bolt'}
        returnedspellids = set()

        for spelldict in spells:
            returnedspellids.add(spelldict['spellid'])

        self.assertEqual(expectedspellids, returnedspellids)

        # q: '3'
        filter_v = {}
        searchquery = '3'
        spells = spellmgr.search_filter_spells(filter_v, searchquery)
        self.assertEqual(3, len(spells))
        expectedspellids = {'chaos_bolt', 'fireball', 'counterspell'}
        returnedspellids = set()

        for spelldict in spells:
            returnedspellids.add(spelldict['spellid'])

        self.assertEqual(expectedspellids, returnedspellids)
