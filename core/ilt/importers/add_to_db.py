import acqinc_5e_importer
import egtw_5e_importer
import mini_importer
import phb_5e_importer
import tcoe_importer
import xgte_5e_importer
import add_subclasses
# import add_tags


if __name__ == "__main__":
    acq = acqinc_5e_importer.main()
    print("done updating acquisitions")
    egtw = egtw_5e_importer.main()
    print("done updating explorers")
    mini = mini_importer.main()
    print("done updating mini-books")
    phb = phb_5e_importer.main()
    print("done updating phb")
    tcoe = tcoe_importer.main()
    print("done updating tashas")
    xgte = xgte_5e_importer.main()
    print("done updating xanathars")

    print("\nadding subclasses")
    add_subclasses.main()
    print("done adding subclasses")
    # add_tags.main()
