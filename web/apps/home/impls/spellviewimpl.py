from ilt.managers import spellmgr


class SpellsViewImpl(object):
    def do_post(self, data, *args, **kwargs):
        return {"spells": spellmgr.get_spells()}
