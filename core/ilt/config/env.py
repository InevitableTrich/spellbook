import json
import ilt
import os


GLOBALCONFIG = {}

def getconfig(filelocation=None):
    """
    read config file from provided or default location. parse content into python dict
    :param filelocation: Optional absolute path to file
    :return dict:
    """
    if not filelocation:
        root_config_path = ilt.config.__path__[0]
        filelocation = os.path.join(root_config_path, "environments", "local.json")

    with open(filelocation) as fp:
        return json.load(fp)


def parseconfig(rawconfig):
    cookedconfig = rawconfig
    return cookedconfig


filelocation = None
envid = os.environ.get('SPELLBOOKENV')
if envid:
    root_config_path = ilt.config.__path__[0]
    filelocation = os.path.join(root_config_path, "environments", envid+'.json')
config = getconfig(filelocation)
GLOBALCONFIG = parseconfig(config)
