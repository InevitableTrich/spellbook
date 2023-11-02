from spell_importer import import_spells
import mini_importer
import add_subclasses


if __name__ == "__main__":
    import_spells('acqinc')
    print("done updating acquisitions")
    import_spells('egtw')
    print("done updating explorers")
    mini_importer.import_minis()
    print("done updating mini-books")
    import_spells('phb')
    print("done updating phb")
    import_spells('tcoe')
    print("done updating tashas")
    import_spells('xgte')
    print("done updating xanathars")

    print("\nadding subclasses")
    add_subclasses.main()
    print("done adding subclasses")
