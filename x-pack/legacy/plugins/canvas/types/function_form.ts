/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import { ExpressionAstArgument, ExpressionAstExpression } from 'src/plugins/expressions/common';

export interface FunctionForm {
  args: Record<string, ExpressionAstArgument[]>;
  argType: string;
  argTypeDef: any; // This is is the View. We need to come up with a type for this
  argResolver: (argAst: ExpressionAstExpression) => Promise<any>;
  contextExpression: string;
  expressionIndex: number;
  nextArgType: string;
}
