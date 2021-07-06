from ilt.config import env
import unittest


class TestDefaultConfig(unittest.TestCase):
    def test_defaultconfig(self):
        config = env.getconfig()
        self.assertEqual('local', config['mongodb']['connectionid'])
        self.assertEqual('mongodb://localhost', config['mongodb']['connectionstring'])
        self.assertEqual('spellsdb', config['mongodb']['dbname'])
