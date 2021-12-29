import {
  DocumentData,
  DocumentReference,
  getDoc,
} from "firebase/firestore/lite";
import { RootCollection } from "..";
import { DataContainer } from "./DataContainer";

function IReference<T extends ReturnType<typeof RootCollection>>(
  constructor: T
) {
  abstract class _Reference extends DataContainer {
    static ref?: { [id: string]: DocumentReference };

    static async get(id: string): Promise<Partial<InstanceType<T>>> {
      const doc = await getDoc(this.ref[id]);
      return this.createEntity(doc, constructor.name) as InstanceType<T>;
    }
    static setRef(db: DocumentReference<DocumentData>) {
      this.ref = { ...this.ref, [db.id]: db };
    }
  }
  return _Reference;
}

export function Reference<T extends ReturnType<typeof RootCollection>>(
  constructor: T
) {
  class _Reference {
    public _type = "reference";
    private id: string;
    private _: ReturnType<typeof IReference>;

    constructor(cons: T) {
      this._ = IReference(cons);
    }
    async get(): Promise<InstanceType<T>> {
      return (await this._.get(this.id)) as InstanceType<T>;
    }
    setRef(db: DocumentReference<DocumentData>) {
      this.id = db.id;
      this._.setRef(db);
    }
  }

  return new _Reference(constructor);
}
