/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import { EmbeddableInput } from '../../../../../src/legacy/core_plugins/embeddable_api/public';

export const EmbeddableExpressionType = 'embeddable';

export interface EmbeddableExpression<Input extends EmbeddableInput> {
  type: typeof EmbeddableExpressionType;
  input: Input;
  embeddableType: string;
}
