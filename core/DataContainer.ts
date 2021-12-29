import { DocumentData, QueryDocumentSnapshot } from "firebase/firestore/lite";
import { CollectionFactoryRegistry } from "./Factory";
import { Reference } from "./Reference";
import { Collection } from "./SubCollection";

export class DataContainer {
  static createEntity(
    documentSnap: QueryDocumentSnapshot<DocumentData>,
    targetName: string
  ) {
    const factory = CollectionFactoryRegistry.get(targetName);
    const dataTemplate = new factory();
    const d = documentSnap.data();
    dataTemplate.ref = documentSnap.ref;
    Object.keys(dataTemplate).forEach((key) => {
      if (d[key]) {
        if (d[key]["type"] === "document") {
          const doc = dataTemplate[key] as ReturnType<typeof Reference>;
          doc.setRef(d[key]);
          return;
        }
        dataTemplate[key] = d[key];
        return;
      }
      if (key === "ref") {
        return;
      }
      const col = dataTemplate[key] as
        | ReturnType<typeof Collection>
        | ReturnType<typeof Reference>;

      // case subCollection
      if (col._type === "subcollection") {
        col.setRef(documentSnap.ref);
        dataTemplate[key] = col;
        return;
      }
      Reflect.deleteProperty(dataTemplate, key);
    });

    return dataTemplate;
  }
}
