/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { findExpressionType } from '../../lib/find_expression_type';
import { getId } from '../../lib/get_id';
import { createAsset } from '../../state/actions/assets';
import {
  fetchContext,
  setArgumentAtIndex,
  addArgumentValueAtIndex,
  deleteArgumentAtIndex,
} from '../../state/actions/elements';
import {
  getSelectedElement,
  getSelectedPage,
  getContextForIndex,
  getGlobalFilterGroups,
} from '../../state/selectors/workpad';
import { getAssets } from '../../state/selectors/assets';
import { findExistingAsset } from '../../lib/find_existing_asset';
import { FunctionForm as Component } from './function_form';

import { FunctionForm as FunctionFormType } from '../../expression_types/function_form';

import { State, FunctionForm as FunctionFormProps, CanvasElement } from '../../../types';

const mapStateToProps = (state: State, { expressionIndex }: FunctionFormProps) => ({
  context: getContextForIndex(state, expressionIndex),
  element: getSelectedElement(state),
  pageId: getSelectedPage(state),
  assets: getAssets(state),
  filterGroups: getGlobalFilterGroups(state),
});

const mapDispatchToProps = (dispatch, { expressionIndex }: FunctionFormProps) => ({
  addArgument: (element: CanvasElement, pageId: string) => (
    argName: string,
    argValue: any
  ) => () => {
    dispatch(
      addArgumentValueAtIndex({ index: expressionIndex, element, pageId, argName, value: argValue })
    );
  },
  updateContext: (element: CanvasElement) => () => dispatch(fetchContext(expressionIndex, element)),
  setArgument: (element: CanvasElement, pageId: string) => (
    argName: string,
    valueIndex: number
  ) => (value: any) => {
    dispatch(
      setArgumentAtIndex({
        index: expressionIndex,
        element,
        pageId,
        argName,
        value,
        valueIndex,
      })
    );
  },
  deleteArgument: (element: CanvasElement, pageId: string) => (
    argName: string,
    argIndex: number
  ) => () => {
    dispatch(
      deleteArgumentAtIndex({
        index: expressionIndex,
        element,
        pageId,
        argName,
        argIndex,
      })
    );
  },
  onAssetAdd: (type: string, content: string) => {
    // make the ID here and pass it into the action
    const assetId = getId('asset');
    dispatch(createAsset(type, content, assetId));

    // then return the id, so the caller knows the id that will be created
    return assetId;
  },
});

const mergeProps = (
  stateProps: ReturnType<typeof mapStateToProps>,
  dispatchProps: ReturnType<typeof mapDispatchToProps>,
  ownProps: FunctionFormProps
) => {
  const { element, pageId, assets } = stateProps;
  const { argType, nextArgType, argTypeDef } = ownProps;
  const {
    updateContext,
    setArgument,
    addArgument,
    deleteArgument,
    onAssetAdd,
    ...dispatchers
  } = dispatchProps;

  if (!element) {
    throw new Error('could not find element');
  }

  return {
    ...stateProps,
    ...dispatchers,
    ...ownProps,
    updateContext: updateContext(element),
    //expressionType: findExpressionType(argType),
    expressionType: argTypeDef as FunctionFormType,
    nextExpressionType: nextArgType ? findExpressionType(nextArgType) : nextArgType,
    onValueChange: setArgument(element, pageId),
    onValueAdd: addArgument(element, pageId),
    onValueRemove: deleteArgument(element, pageId),
    onAssetAdd: (type: string, content: string) => {
      const existingId = findExistingAsset(type, content, assets);
      if (existingId) {
        return existingId;
      }
      return onAssetAdd(type, content);
    },
  };
};

export const FunctionForm = connect(mapStateToProps, mapDispatchToProps, mergeProps)(Component);

export type FunctionFormOutgoingProps = ReturnType<typeof mergeProps>;

FunctionForm.propTypes = {
  expressionIndex: PropTypes.number,
  argType: PropTypes.string,
  nextArgType: PropTypes.string,
};
