/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import { npSetup, npStart } from 'ui/new_platform';
import { CanvasStartDeps, CanvasSetupDeps } from './plugin'; // eslint-disable-line import/order

import { CoreStart, CoreSetup } from 'src/core/public';

//import { absoluteToParsedUrl } from 'ui/url/absolute_to_parsed_url'; // eslint-disable-line import/order
// @ts-ignore Untyped Kibana Lib
//import { formatMsg } from '../../../../../src/plugins/kibana_legacy/public'; // eslint-disable-line import/order
//import chrome from 'ui/chrome'; // eslint-disable-line import/order

/*const shimCoreSetup = {
  ...npSetup.core,
};
const shimCoreStart = {
  ...npStart.core,
};

const shimSetupPlugins: CanvasSetupDeps = {
  expressions: npSetup.plugins.expressions,
  home: npSetup.plugins.home,
};
const shimStartPlugins: CanvasStartDeps = {
  ...npStart.plugins,
  expressions: npStart.plugins.expressions,
  __LEGACY: {
    // ToDo: Copy directly into canvas
    absoluteToParsedUrl,
    // ToDo: Copy directly into canvas
    formatMsg,
    // ToDo: Won't be a part of New Platform. Will need to handle internally
    trackSubUrlForApp: chrome.trackSubUrlForApp,
  },
};*/

let holding: {
  coreStart: CoreStart;
  coreSetup: CoreSetup;
  canvasStart: CanvasStartDeps;
  canvasSetup: CanvasSetupDeps;
} = {} as any;

export const init = (
  setup: CoreSetup,
  start: CoreStart,
  pluginSetup: CanvasSetupDeps,
  pluginStart: CanvasStartDeps
) => {
  holding = {
    coreStart: start,
    coreSetup: setup,
    canvasStart: pluginStart,
    canvasSetup: pluginSetup,
  };
};

// These methods are intended to be a replacement for import from 'ui/whatever'
// These will go away once all of this one plugin start/setup properly
// injects wherever these need to go.
export function getCoreSetup() {
  return holding.coreSetup;
}

export function getCoreStart() {
  return holding.coreStart;
}

export function getSetupPlugins() {
  return holding.canvasSetup;
}

export function getStartPlugins() {
  return {
    ...holding.canvasStart,
    __LEGACY: {
      // ToDo: Copy directly into canvas
      absoluteToParsedUrl: () => null,
      // ToDo: Copy directly into canvas
      formatMsg: () => null,
      // ToDo: Won't be a part of New Platform. Will need to handle internally
      trackSubUrlForApp: () => null,
    },
  };
}
