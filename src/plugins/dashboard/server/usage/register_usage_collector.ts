/*
 * Licensed to Elasticsearch B.V. under one or more contributor
 * license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright
 * ownership. Elasticsearch B.V. licenses this file to you under
 * the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

import { ISavedObjectsRepository } from 'src/core/server';
import { UsageCollectionSetup, MakeSchemaFrom } from 'src/plugins/usage_collection/server';
import { EmbeddableSetup } from 'src/plugins/embeddable/server';
import { DashboardEmbeddableCollectorData } from '../embeddable/dashboard_embeddable_factory';

interface DashboardUsage {
  total: number;
  panels: number;
  embeddedPanels: number;
}

export function registerDashboardUsageCollector(
  usageCollection: UsageCollectionSetup,
  getSavedObjectsClient: () => ISavedObjectsRepository | undefined,
  collector: EmbeddableSetup['telemetryCollector']
) {
  const dashboardCollector = usageCollection.makeUsageCollector({
    type: 'dashboard-experimental',
    isReady: () => {
      return typeof getSavedObjectsClient() !== 'undefined';
    },
    fetch: async (): Promise<DashboardUsage> => {
      const embeddableData = await collector.run();
      const dashboardData = embeddableData.dashboard as DashboardEmbeddableCollectorData;

      return dashboardData;
    },
    schema: {
      total: { type: 'long' },
      panels: { type: 'long' },
      embeddedPanels: { type: 'long' },
    },
  });

  usageCollection.registerCollector(dashboardCollector);
}
