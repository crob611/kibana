/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import { IRouter } from 'src/core/server';
import { initWorkpadRoutes } from './workpad';

export interface RouteInitializerDeps {
  router: IRouter;
}

export function initRoutes(deps: RouteInitializerDeps) {
  initWorkpadRoutes(deps);
}
