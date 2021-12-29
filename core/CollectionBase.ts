import {
  CollectionReference,
  DocumentData,
  getDocs,
  limit,
  limitToLast,
  query,
  QueryConstraint,
} from "firebase/firestore";
import { CollectionFactoryRegistry } from "./Factory";
import { Reference } from "./Reference";
import { SubCollection } from "./SubCollection";

export abstract class CollectionBase {
  static ref: CollectionReference<DocumentData>;
  static queryConstraints: QueryConstraint[] = [];

  static async get() {
    const docs = (await getDocs(query(this.ref, ...this.queryConstraints)))
      .docs;
    this.queryConstraints = [];

    const resultDocs = docs.map((_d) => {
      const d = _d.data();
      const factory = CollectionFactoryRegistry.get(this.name);
      const container = new factory();

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
        col.setRef(_d.ref);
        container[key] = col;
      });
      return container;
    });

    return resultDocs;
  }
  static limit(lim: number) {
    this.queryConstraints = [...this.queryConstraints, limit(lim)];
    return this;
  }
  static limitToLast(lim: number) {
    this.queryConstraints = [...this.queryConstraints, limitToLast(lim)];
    return this;
  }
}
