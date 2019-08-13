/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import { Embeddable } from '../../../../../../../src/legacy/core_plugins/embeddable_api/public/np_ready/public';
import { EmbeddablesRegistry } from './embeddables_registry';

class TestEmbeddable extends Embeddable {
  public readonly type = 'test';

  reload() {}
}

const mockEmbeddable = new TestEmbeddable(
  {
    id: 'embeddable-id',
  },
  {}
);

describe('EmbeddablesRegistry', () => {
  describe('increment', () => {
    it('adds a new embeddable and initializes count to zero', () => {
      const registry = new EmbeddablesRegistry();

      registry.increment(mockEmbeddable);

      expect(registry.count(mockEmbeddable)).toBe(1);
    });

    it('increments count for existing embeddable', () => {
      const registry = new EmbeddablesRegistry();

      registry.increment(mockEmbeddable);
      registry.increment(mockEmbeddable);

      expect(registry.count(mockEmbeddable)).toBe(2);
    });
  });

  describe('decrement', () => {
    it('decrements the count for an existing embeddable', () => {
      const registry = new EmbeddablesRegistry();

      registry.increment(mockEmbeddable);

      expect(registry.count(mockEmbeddable)).toBe(1);

      registry.decrement(mockEmbeddable);
      expect(registry.count(mockEmbeddable)).toBe(0);
    });

    it('handles decrement embeddable not in the registry', () => {
      const registry = new EmbeddablesRegistry();

      registry.decrement(mockEmbeddable);

      expect(registry.count(mockEmbeddable)).toBe(0);
    });
  });
});
