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
import { EmbeddableSetup } from 'src/plugins/embeddable/server';
import { PanelState } from 'src/plugins/embeddable/common';
import { ISavedObjectsRepository } from 'src/core/server';
import { convertSavedDashboardPanelToPanelState } from '../../common/embeddable/embeddable_saved_object_converters';
import { injectReferences } from '../../common/saved_dashboard_references';
import { DashboardEmbeddableInput } from '../embeddable/dashboard_embeddable_factory';

export const registerEmbeddableTelemetry = (
  embeddable: EmbeddableSetup,
  getSavedObjectsClient: () => ISavedObjectsRepository | undefined
) => {
  embeddable.telemetryCollector.register({
    fetcher: async () => {
      const client = getSavedObjectsClient();
      if (client === undefined) {
        return Promise.resolve([]);
      }

      const dashboards = await client.find<SavedObjectDashboard & { [key: string]: any }>({
        type: 'dashboard',
      });

      const injected = dashboards.saved_objects.map((so) => ({
        ...so,
        attributes: injectReferences(so, { embeddablePersistableStateService: embeddable }),
      }));

      const res = injected.map((so) => ({
        id: so.id,
        type: so.type,
        panels: (JSON.parse(so.attributes.panelsJSON as string) as SavedDashboardPanel[]).reduce<
          Record<string, PanelState>
        >((panelMap, panel) => {
          panelMap[panel.panelIndex] = convertSavedDashboardPanelToPanelState(panel);
          return panelMap;
        }, {}),
      }));

      return res;
    },
    extractor: (rawInput) => {
      const input = rawInput as DashboardEmbeddableInput;

      const embeddedPanels = Object.values(input.panels).filter(
        (p) => p.explicitInput.savedObjectId !== undefined
      );

      const embeddedPanelsConfigs = embeddedPanels.map((p) => ({
        ...p.explicitInput,
        type: p.type,
      }));

      return embeddedPanelsConfigs;
    },
    getBaseCollectorData: () => ({ total: 0 }),
    type: 'dashboard',
  });
};
