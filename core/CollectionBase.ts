import {
  addDoc,
  CollectionReference,
  DocumentData,
  DocumentReference,
  getDocs,
  limit,
  limitToLast,
  orderBy,
  OrderByDirection,
  query,
  QueryConstraint,
  where,
  WhereFilterOp,
} from "firebase/firestore";
import { DataContainer } from "./DataContainer";

export class CollectionBase extends DataContainer {
  static queryConstraints: QueryConstraint[] = [];
  ref: DocumentReference;

  protected static async get(ref: CollectionReference<DocumentData>) {
    const docs = (await getDocs(query(ref, ...this.queryConstraints))).docs;
    this.queryConstraints = [];
    return docs.map((d) => this.createEntity(d, this.name));
  }

  static _where(q: unknown) {
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
  static _orderBy(field: unknown, direction: OrderByDirection) {
    this.queryConstraints = [
      ...this.queryConstraints,
      orderBy(field.toString(), direction),
    ];
    return this;
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
