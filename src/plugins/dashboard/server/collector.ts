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

import { CollectorFetchContext, UsageCollectionSetup } from 'src/plugins/usage_collection/server';

/*
  Register the canvas usage collector function

  This will call all of the defined collectors and combine the individual results into a single object
  to be returned to the caller.

  A usage collector function returns an object derived from current data in the ES Cluster.
*/
export function registerDashboardUsageCollector(
  usageCollection: UsageCollectionSetup | undefined,
  kibanaIndex: string
) {
  if (!usageCollection) {
    return;
  }

  const dashboardCollector = usageCollection.makeUsageCollector({
    type: 'dashboard-experimental',
    isReady: () => true,
    fetch: async ({ callCluster }: CollectorFetchContext) => {
      const response = await callCluster('search', {
        size: 10000, // elasticsearch index.max_result_window default value
        index: kibanaIndex,
        ignoreUnavailable: true,
        filterPath: [],
        body: { query: { bool: { filter: { term: { type: 'dashboard' } } } } },
      });

      response.hits.hits.map(console.log);

      return {
        total: 69,
      };
    },
    schema: { total: { type: 'long' } },
  });

  usageCollection.registerCollector(dashboardCollector);
}
