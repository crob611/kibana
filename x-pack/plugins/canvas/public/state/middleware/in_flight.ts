/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import { loadingIndicator } from '../../lib/loading_indicator';
import { convert } from '../../lib/modify_path';
import { inFlightActive, inFlightComplete, setLoading, setValue } from '../actions/resolved_args';

export const inFlight = ({ dispatch }) => next => {
  const pendingCache = [];

  return action => {
    const isLoading = action.type === setLoading.toString();
    const isSetting = action.type === setValue.toString();
    const isInFlightActive = action.type === inFlightActive.toString();
    const isInFlightComplete = action.type === inFlightComplete.toString();

    if (isLoading || isSetting) {
      const cacheKey = convert(action.payload.path).join('/');

      if (isLoading) {
        pendingCache.push(cacheKey);
        dispatch(inFlightActive());
      } else if (isSetting) {
        const idx = pendingCache.indexOf(cacheKey);
        pendingCache.splice(idx, 1);
        if (pendingCache.length === 0) {
          dispatch(inFlightComplete());
        }
      }
    } else if (isInFlightActive) {
      loadingIndicator.show();
    } else if (isInFlightComplete) {
      loadingIndicator.hide();
    }

    // execute the action
    next(action);
  };
};
