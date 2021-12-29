import {
  DocumentData,
  DocumentReference,
  OrderByDirection,
  collection as firestoreCollection,
  CollectionReference,
  addDoc,
} from "firebase/firestore/lite";
import { CollectionBase } from "./CollectionBase";
import { AddPayload, WhereQuery } from "./types";

export function SubCollection<T>(path: string) {
  abstract class _Collection extends CollectionBase {
    private static refs: { [id: string]: CollectionReference<DocumentData> };

    static async findMany(id: string): Promise<Partial<T>[]> {
      const ref = this.refs[id];
      return (await this.get(ref)) as any as T[];
    }
    static async add(id: string, value: AddPayload<T>) {
      await addDoc(this.refs[id], value);
    }
    static setRef(db: DocumentReference<DocumentData>) {
      this.refs = {
        ...this.refs,
        [db.id]: firestoreCollection(db, path),
      };
    }
  }

  return _Collection;
}

export function Collection<T extends ReturnType<typeof SubCollection>>(
  constructor: T
) {
  class _SubCollection {
    private id: string;
    public _type = "subcollection";
    private _: T;

    constructor(cons: T) {
      this._ = cons;
    }
    async findMany(): Promise<InstanceType<T>[]> {
      return this._.findMany(this.id) as any;
    }
    where(q: WhereQuery<InstanceType<T>>) {
      this._._where(q);
      return this;
    }
    orderBy(field: keyof InstanceType<T>, direction: OrderByDirection) {
      this._._orderBy(field, direction);
      return this;
    }
    add(value: AddPayload<InstanceType<T>>) {
      this._.add(this.id, value);
    }
    setRef(db: DocumentReference<DocumentData>) {
      this.id = db.id;
      this._.setRef(db);
    }
  }

  return new _SubCollection(constructor);
}
