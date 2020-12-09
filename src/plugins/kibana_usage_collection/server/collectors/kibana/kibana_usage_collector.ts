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

import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { SharedGlobalConfig } from 'kibana/server';
import { UsageCollectionSetup } from 'src/plugins/usage_collection/server';
import { EmbeddableSetup } from 'src/plugins/embeddable/server';
import { DashboardEmbeddableCollectorData } from 'src/plugins/dashboard/server';
import { getSavedObjectsCounts, KibanaSavedObjectCounts } from './get_saved_object_counts';

interface KibanaUsage extends KibanaSavedObjectCounts {
  index: string;
  dashboard: { total: number };
}

export function getKibanaUsageCollector(
  usageCollection: UsageCollectionSetup,
  legacyConfig$: Observable<SharedGlobalConfig>,
  embeddableCollector: EmbeddableSetup['telemetryCollector']
) {
  return usageCollection.makeUsageCollector<KibanaUsage>({
    type: 'kibana',
    isReady: () => true,
    schema: {
      index: { type: 'keyword' },
      dashboard: { total: { type: 'long' } },
      visualization: { total: { type: 'long' } },
      search: { total: { type: 'long' } },
      index_pattern: { total: { type: 'long' } },
      graph_workspace: { total: { type: 'long' } },
      timelion_sheet: { total: { type: 'long' } },
    },
    async fetch({ callCluster }) {
      const embeddableResults = (await embeddableCollector.run()) as {
        dashboard: DashboardEmbeddableCollectorData;
      };

      const {
        kibana: { index },
      } = await legacyConfig$.pipe(take(1)).toPromise();
      return {
        index,
        dashboard: {
          total: embeddableResults.dashboard.total,
        },
        ...(await getSavedObjectsCounts(callCluster, index)),
      };
    },
  });
}

export function registerKibanaUsageCollector(
  usageCollection: UsageCollectionSetup,
  legacyConfig$: Observable<SharedGlobalConfig>,
  embeddableCollector: EmbeddableSetup['telemetryCollector']
) {
  usageCollection.registerCollector(
    getKibanaUsageCollector(usageCollection, legacyConfig$, embeddableCollector)
  );
}
