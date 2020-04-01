/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

// TODO: These are legacy imports.  We should work to have all of these come from New Platform
// Import the uiExports that the application uses
// These will go away as these plugins are converted to NP
import 'ui/autoload/all';
import 'uiExports/savedObjectTypes';
import 'uiExports/spyModes';
import 'uiExports/embeddableFactories';
import 'uiExports/interpreter';

import './legacy_plugin_support';
// load application code
import 'uiExports/canvas';

import { npSetup, npStart } from 'ui/new_platform';

import { PluginInitializerContext } from '../../../../../src/core/public';
import { plugin } from './';
//import { getCoreStart, getStartPlugins, getSetupPlugins, getCoreSetup } from './legacy';
const pluginInstance = plugin({} as PluginInitializerContext);

// Setup and Startup the plugin

const shimSetupPlugins = {
  expressions: npSetup.plugins.expressions,
  home: npSetup.plugins.home,
};

const shimStartPlugins = {
  ...npStart.plugins,
  expressions: npStart.plugins.expressions,
  __LEGACY: {
    // ToDo: Copy directly into canvas
    absoluteToParsedUrl: () => null,
    // ToDo: Copy directly into canvas
    formatMsg: () => null,
    // ToDo: Won't be a part of New Platform. Will need to handle internally
    trackSubUrlForApp: () => null,
  },
};

export const setup = pluginInstance.setup(npSetup.core, shimSetupPlugins);
export const start = pluginInstance.start(npStart.core, shimStartPlugins);
