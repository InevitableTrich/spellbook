function sort_spells(list) {
    list.sort((spellX, spellY) => {
        if (spellX.name > spellY.name) return 1;
        return -1;
    })
}