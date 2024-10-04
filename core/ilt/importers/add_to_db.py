from spell_importer import import_spells, upload_spells, spell_list
from add_subclasses import add_subclasses


if __name__ == "__main__":
    # import all spells from each book. when adding new books,
    # always append to bottom to prevent re-indexing
    import_spells('acqinc')
    import_spells('egtw')
    import_spells('frost')
    import_spells('ftod')
    import_spells('kwalish')
    import_spells('strix')
    import_spells('phb')
    import_spells('tcoe')
    import_spells('xgte')
    import_spells('aag')
    import_spells('bomt')
    import_spells('phb24')
    print("\nLoaded all spells from json")

    add_subclasses()
    print("Added subclasses to spells")

    print("\nUploading spells...")
    upload_spells()
    print("Uploaded spells to MongoDB")
