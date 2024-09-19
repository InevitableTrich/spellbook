from spell_importer import import_spells
import mini_importer
from add_subclasses import add_subclasses


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
    import_spells('aag')
    import_spells('bomt')

    print("\nadding subclasses")
    add_subclasses()
    print("done adding subclasses")
