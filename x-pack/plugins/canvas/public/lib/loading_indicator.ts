/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

// @ts-ignore
import { loadingCount } from 'ui/chrome';

let isActive = false;

export const loadingIndicator = {
  show: () => {
    if (!isActive) {
      // Using setTimeout ensures the loadingCount observables don't change in the middle
      // of a render and cause the "can't set state during existing transition" warning
      setTimeout(loadingCount.increment, 0);
      isActive = true;
    }
  },
  hide: () => {
    if (isActive) {
      setTimeout(loadingCount.decrement, 0);
      isActive = false;
    }
  },
};
