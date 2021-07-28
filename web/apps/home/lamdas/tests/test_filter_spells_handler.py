import unittest
from apps.home.lamdas.lambdamgr import filter_spells_handler


class TestLambdaMgr(unittest.TestCase):
    def test_filter_spells_handler(self):
        event = {}
        event["queryStringParameters"] = {"pagenum": "1", "field": "nameSort", "direction": "0", "searchquery": ""}
        event["body"] = b'{"filter": {"level": ["1"]}}'

        context = ""

        self.assertEqual(49, len(filter_spells_handler(event, context)['body']['spells']))
        self.assertEqual(49, filter_spells_handler(event, context)['body']['spellscount'])
