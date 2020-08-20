/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */
import { PluginInitializerContext } from 'src/core/public';
import { FleetPlugin } from './plugin';

export { FleetSetup, FleetStart } from './plugin';

export const plugin = (initializerContext: PluginInitializerContext) => {
  return new FleetPlugin(initializerContext);
};

export type { NewPackagePolicy } from './applications/fleet/types';
export * from './applications/fleet/types/intra_app_route_state';
export * from './applications/fleet/types/ui_extensions';

export { pagePathGetters } from './applications/fleet/constants';
export { pkgKeyFromPackageInfo } from './applications/fleet/services/pkg_key_from_package_info';
// Canvas export stuff
export * from './applications/fleet/sections/epm/components/release_badge';
export * from './applications/fleet/sections/epm/screens/detail/installation_button';
export * from './applications/fleet/hooks';
export * from './applications/fleet/sections/epm/hooks';
export * from './applications/fleet/sections/epm/screens/detail/readme';
export * from './applications/fleet/sections/epm/screens/detail/content_collapse';
