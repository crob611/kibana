/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import { PluginInitializerContext } from 'kibana/public';
/*import {
  CanvasPlugin,
  CanvasSetup,
  CanvasStart,
  CanvasSetupDeps,
  CanvasStartDeps,
} from '../../../legacy/plugins/canvas/public/plugin';*/
import { CanvasPlugin } from './plugin';

/*
export const plugin: PluginInitializer<
  CanvasSetup,
  CanvasStart,
  CanvasSetupDeps,
  CanvasStartDeps
> = () => new CanvasPlugin();
*/
export const plugin = (initializerContext: PluginInitializerContext) =>
  new CanvasPlugin(initializerContext);

//export const plugin: PluginInitializer<{}, {}, {}, {}> = () => new CanvasPlugin();
//export { MlPluginSetup, MlPluginStart };
