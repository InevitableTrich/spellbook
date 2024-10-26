from ilt.managers import spellmgr


class SpellsViewImpl:
    def do_post(self, data, *args, **kwargs):
        init = 'init' in data.keys()
        index = int(data.get('index', -1))

        if init:
            count = spellmgr.get_spell_count()
            return {'spell_count': count}

        return {'spells': spellmgr.get_spells_from(index)}
