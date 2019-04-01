/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import { convert } from '../../lib/modify_path';
import {
  Action as AnyAction,
  inFlightActive,
  inFlightComplete,
  setLoadingActionType,
  setValueActionType,
  inFlightActiveActionType,
  inFlightCompleteActionType,
} from '../actions/resolved_args';

import {
  loadingIndicator as defaultLoadingIndicator,
  LoadingIndicatorInterface,
} from '../../lib/loading_indicator';

import { Dispatch, Middleware } from 'redux';

type InFlightMiddlewareOptions = {
  pendingCache: string[];
  loadingIndicator: LoadingIndicatorInterface;
};

const pathToKey = (path: any[]) => convert(path).join('/');

export const inFlightMiddlewareFactory = ({
  loadingIndicator,
  pendingCache,
}: InFlightMiddlewareOptions): Middleware => {
  return ({ dispatch }) => (next: Dispatch) => {
    return (action: AnyAction) => {
      switch (action.type) {
        case setLoadingActionType:
          pendingCache.push(pathToKey(action.payload.path));
          dispatch(inFlightActive());
          break;

        case setValueActionType:
          const cacheKey = pathToKey(action.payload.path);
          const idx = pendingCache.indexOf(cacheKey);
          if (idx >= 0) {
            pendingCache.splice(idx, 1);
          }
          if (pendingCache.length === 0) {
            dispatch(inFlightComplete());
          }
          break;

        case inFlightActiveActionType:
          loadingIndicator.show();
          break;

        case inFlightCompleteActionType:
          loadingIndicator.hide();
      }

      // execute the action
      next(action);
    };
  };
};

export const inFlight = inFlightMiddlewareFactory({
  loadingIndicator: defaultLoadingIndicator,
  pendingCache: [],
});
