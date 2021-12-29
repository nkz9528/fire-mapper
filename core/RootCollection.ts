import {
  orderBy,
  OrderByDirection,
  where,
  WhereFilterOp,
  collection as firestoreCollection,
  getFirestore,
} from "firebase/firestore";
import { CollectionBase } from "./CollectionBase";
import { WhereQuery } from "./types";

export function RootCollection<T>(path: string) {
  abstract class _Collection extends CollectionBase {
    static async findMany(): Promise<T[]> {
      return (await this.get()) as any as T[];
    }
    static where(q: WhereQuery<T>) {
      Object.keys(q).forEach((key) => {
        const v = q[key as keyof typeof q];
        if (!v) {
          return this;
        }
        const opVal = Object.entries(v)[0];
        this.queryConstraints = [
          ...this.queryConstraints,
          where(key.toString(), opVal[0] as WhereFilterOp, opVal[1]),
        ];
      });
      return this;
    }
    static orderBy(field: keyof T, direction: OrderByDirection) {
      this.queryConstraints = [
        ...this.queryConstraints,
        orderBy(field.toString(), direction),
      ];
      return this;
    }
  }
  const db = getFirestore();
  _Collection.ref = firestoreCollection(db, path);

  return _Collection;
}
