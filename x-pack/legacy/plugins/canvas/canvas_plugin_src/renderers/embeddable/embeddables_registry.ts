/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import { IEmbeddable } from '../../../../../../../src/legacy/core_plugins/embeddable_api/public/np_ready/public';

type RegistryType = Map<IEmbeddable, number>;

/* 
  This is a registry for keeping track of the embeddables in use, and how many components they are 
  in use by. 

  When an embeddable is mounted we increment it's use count
  When a mounted embeddable's id is changed (it's switched from one embeddable to another), 
    then we decrment it's old id's use count and increment it's new one
  When an embeddable is unmounted, we decrement it's use count
*/
class EmbeddablesRegistry {
  private registry: RegistryType;

  constructor() {
    this.registry = new Map();
  }

  increment(embeddable: IEmbeddable) {
    const count = this.count(embeddable);
    this.registry.set(embeddable, count + 1);
  }

  decrement(embeddable: IEmbeddable) {
    const count = this.count(embeddable);

    if (count <= 1) {
      this.registry.delete(embeddable);
    } else {
      this.registry.set(embeddable, count - 1);
    }
  }

  count(embeddable: IEmbeddable) {
    return this.registry.get(embeddable) || 0;
  }
}

export { EmbeddablesRegistry };
