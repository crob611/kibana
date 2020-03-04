/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import { compose, withProps } from 'recompose';
import { get } from 'lodash';
import { toExpression } from '@kbn/interpreter/common';
import { interpretAst } from '../../lib/run_interpreter';
import { modelRegistry, viewRegistry, transformRegistry } from '../../expression_types';
import { FunctionFormList as Component } from './function_form_list';

import {
  PositionedElement,
  FunctionForm,
  ExpressionAstExpression,
  ExpressionAstFunction,
} from '../../../types';

import { FunctionForm as FunctionFormClass } from '../../expression_types/function_form';

function normalizeContext(chain: ExpressionAstFunction[]): ExpressionAstExpression | null {
  if (!Array.isArray(chain) || !chain.length) {
    return null;
  }
  return {
    type: 'expression',
    chain,
  };
}

function getExpression(ast: ExpressionAstExpression) {
  return toExpression(ast);
}

function getArgTypeDef(fn) {
  return modelRegistry.get(fn) || viewRegistry.get(fn) || transformRegistry.get(fn);
}

export interface IncomingFunctionFormListProps {
  element: PositionedElement;
  newProp: string;
}

export interface OutgoingFunctionFormListProps {
  functionFormItems: FunctionForm[];
}

const functionFormItems = withProps<OutgoingFunctionFormListProps, IncomingFunctionFormListProps>(
  props => {
    const selectedElement = props.element;
    const FunctionFormChain = get<PositionedElement, PositionedElement['ast']['chain']>(
      selectedElement,
      'ast.chain',
      []
    );

    // map argTypes from AST, attaching nextArgType if one exists
    const FunctionFormListItems = FunctionFormChain.reduce(
      (acc, argType, i) => {
        const argTypeDef = getArgTypeDef(argType.function) as FunctionFormClass;
        const prevContext = normalizeContext(acc.context);
        const nextArg = FunctionFormChain[i + 1] || null;

        // filter out argTypes that shouldn't be in the sidebar
        if (argTypeDef) {
          // wrap each part of the chain in ArgType, passing in the previous context
          const component = {
            args: argType.arguments,
            argType: argType.function,
            argTypeDef,
            argResolver: (argAst: ExpressionAstExpression) => interpretAst(argAst, prevContext),
            contextExpression: prevContext ? getExpression(prevContext) : undefined,
            expressionIndex: i, // preserve the index in the AST
            nextArgType: nextArg && nextArg.function,
          };

          acc.mapped.push(component);
        }

        acc.context = acc.context.concat(argType);
        return acc;
      },
      { mapped: [] as FunctionForm[], context: [] as ExpressionAstFunction[] }
    );

    return {
      functionFormItems: FunctionFormListItems.mapped,
    };
  }
);

export const FunctionFormList = functionFormItems(Component);
