import acqinc_5e_importer
import egtw_5e_importer
import mini_importer
import phb_5e_importer
import tcoe_importer
import xgte_5e_importer
import add_subclasses


if __name__ == "__main__":
    acq = acqinc_5e_importer.main()
    egtw = egtw_5e_importer.main()
    mini = mini_importer.main()
    phb = phb_5e_importer.main()
    tcoe = tcoe_importer.main()
    xgte = xgte_5e_importer.main()

    print("done updating, adding subclasses")
    add_subclasses.main()
