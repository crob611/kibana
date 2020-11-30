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
import { CollectorFetchContext, UsageCollectionSetup } from 'src/plugins/usage_collection/server';
import { EmbeddableSetup } from 'src/plugins/embeddable/server';
import { extractReferences } from '../common/saved_dashboard_references';

type EmbeddableContext = Promise<{}>;

export function registerDashboardUsageCollector(
  usageCollection: UsageCollectionSetup,
  getSavedObjectsClient: () => ISavedObjectsRepository | undefined,
  embeddableTelemetry: EmbeddableSetup['telemetry'],
  collector: EmbeddableSetup['collector']
) {
  const dashboardCollector = usageCollection.makeUsageCollector({
    type: 'dashboard-experimental',
    isReady: () => {
      return typeof getSavedObjectsClient() !== 'undefined';
    },
    fetch: async () => {
      const embeddableData = await collector.run();

      console.log('this is the embeddable data');
      console.log(embeddableData);
      //const embeddableResults = await collector.run();

      /*
      const savedObjectsClient = getSavedObjectsClient();

      // Should never hit this case, because of the isReady
      if (typeof savedObjectsClient === 'undefined') {
        return;
      }

      const dashboards = await savedObjectsClient.find({ type: 'dashboard' });
      const dashboardTelemetry = {
        total: 0,
      };

      return dashboards.saved_objects
        .map((d) => ({
          id: d.id,
          type: d.type,
        }))
        .reduce((reduction, d) => embeddableTelemetry(d, reduction), dashboardTelemetry);
        */
    },
    schema: { total: { type: 'long' } },
    extendFetchContext: {
      embeddable: true,
    },
  });

  // Register with embeddable collector
  collector.register({
    fetcher: async () => {
      const client = getSavedObjectsClient();
      if (client === undefined) {
        return Promise.resolve([]);
      }

      return await (await client.find({ type: 'dashboard' })).saved_objects.map((so) => ({
        id: so.id,
        type: so.type,
      }));
    },
    extractor: () => [],
    getBaseCollectorData: () => ({ total: 0 }),
    type: 'dashboard',
  });

  usageCollection.registerCollector(dashboardCollector);
}
