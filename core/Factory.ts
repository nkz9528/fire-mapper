import { CollectionBase } from "./CollectionBase";

export type Constructable = typeof CollectionBase;

export class CollectionFactoryRegistry {
  private static registry: { [key: string]: Constructable } = {};

  static add(key: string, factory: Constructable) {
    this.registry = {
      ...this.registry,
      [key]: factory,
    };
  }
  static get(name: string) {
    return this.registry[name];
  }
}

export function collection(constructor: Constructable) {
  CollectionFactoryRegistry.add(constructor.name, constructor);
}
