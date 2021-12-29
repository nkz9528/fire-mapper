import {
  orderBy,
  OrderByDirection,
  where,
  WhereFilterOp,
  collection as firestoreCollection,
  getFirestore,
  CollectionReference,
  DocumentData,
  addDoc,
  updateDoc,
} from "firebase/firestore";
import { CollectionBase } from "./CollectionBase";
import { initAppIfNeeded } from "./initialize";
import { AddPayload, WhereQuery } from "./types";

export function RootCollection<T>(path: string) {
  class _Collection extends CollectionBase {
    static ref: CollectionReference<DocumentData>;

    static async findMany(): Promise<Partial<T>[]> {
      return (await this.get(this.ref)) as any as T[];
    }
    static where(q: WhereQuery<T>) {
      return this._where(q);
    }
    static orderBy(field: keyof T, direction: OrderByDirection) {
      return this._orderBy(field, direction);
    }
    static async add(value: AddPayload<T>) {
      await addDoc(this.ref, value);
    }
    async update(value: AddPayload<T>) {
      await updateDoc(this.ref, value as any);
    }
  }

  initAppIfNeeded();
  const db = getFirestore();
  _Collection.ref = firestoreCollection(db, path);

  return _Collection;
}
