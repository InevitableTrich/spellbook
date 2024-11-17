from spell_importer import SpellImporter
from add_subclasses import add_subclasses


if __name__ == "__main__":
    # create importer
    importer = SpellImporter()

    # import all spells from each book. when adding new books,
    # always append to bottom to prevent re-indexing
    importer.from_json('acqinc')
    importer.from_json('egtw')
    importer.from_json('frost')
    importer.from_json('ftod')
    importer.from_json('kwalish')
    importer.from_json('strix')
    importer.from_json('phb')
    importer.from_json('tcoe')
    importer.from_json('xgte')
    importer.from_json('aag')
    importer.from_json('bomt')
    importer.from_json('phb24')
    importer.from_json('phb24noscrape')
    print("\nLoaded all spells from json")

    add_subclasses(importer)
    print("Added subclasses to spells")

    print("\nUploading spells...")
    importer.upload_spells()
    print("Uploaded spells to MongoDB")
