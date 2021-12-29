import { DocumentData, DocumentReference, getDoc } from "firebase/firestore";
import { Constructable } from "./Factory";
import { SubCollection } from "./SubCollection";

export function Reference<T extends Constructable>(constructor: T) {
  abstract class _Reference {
    static ref?: DocumentReference;

    static async get(): Promise<InstanceType<T>> {
      const snap = await getDoc(this.ref);
      const d = snap.data();
      const container = new constructor();

      Object.keys(container).forEach((key) => {
        if (d[key]) {
          if (d[key]["type"] === "document") {
            const doc = container[key] as ReturnType<typeof Reference>;
            doc.setRef(d[key]);
            return;
          }
          container[key] = d[key];
          return;
        }
        // case subCollection
        const col = container[key] as ReturnType<typeof SubCollection>;
        col.setRef(snap.ref);
        container[key] = col;
      });
      return container;
    }
    static setRef(db: DocumentReference<DocumentData>) {
      this.ref = db;
    }
  }
  return _Reference;
}
