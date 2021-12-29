import { WhereFilterOp } from "firebase/firestore";
import { Reference } from "./Reference";
import { RootCollection } from "./RootCollection";
import { SubCollection } from "./SubCollection";

export type WhereQuery<E> = {
  [key in KeysExcludeRef<E>]?: { [opKey in WhereFilterOp]?: E[key] };
};

export type SchemaExcludeRef<E> = {
  [key in keyof E]?: E[key] extends
    | typeof RootCollection
    | typeof SubCollection
    | typeof Reference
    | Function
    ? never
    : key;
};

type KeysExcludeRef<E> = Exclude<
  SchemaExcludeRef<E>[keyof SchemaExcludeRef<E>],
  undefined
>;
