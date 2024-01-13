from ilt.managers import spellmgr


class SpellsViewImpl:
    def do_post(self, data, *args, **kwargs):
        return {"spells": spellmgr.get_spells()}