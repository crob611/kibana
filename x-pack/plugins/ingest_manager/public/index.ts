/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */
import { PluginInitializerContext } from 'src/core/public';
import { IngestManagerPlugin } from './plugin';

export { IngestManagerSetup, IngestManagerStart } from './plugin';

export const plugin = (initializerContext: PluginInitializerContext) => {
  return new IngestManagerPlugin(initializerContext);
};

export {
  CustomConfigurePackagePolicyContent,
  CustomConfigurePackagePolicyProps,
  registerPackagePolicyComponent,
} from './applications/ingest_manager/sections/agent_policy/create_package_policy_page/components/custom_package_policy';

export { NewPackagePolicy } from './applications/ingest_manager/types';
export * from './applications/ingest_manager/types/intra_app_route_state';

export { pagePathGetters } from './applications/ingest_manager/constants';
// Canvas export stuff
export * from './applications/ingest_manager/sections/epm/components/release_badge';
export * from './applications/ingest_manager/sections/epm/screens/detail/installation_button';
export * from './applications/ingest_manager/sections/epm/screens/detail/readme';
export * from './applications/ingest_manager/hooks';
export * from './applications/ingest_manager/sections/epm/hooks';
export * from './applications/ingest_manager/sections/epm/screens/detail/content_collapse';
