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

import {
  EmbeddableStateWithType,
  PanelState,
  EmbeddableInput,
} from 'src/plugins/embeddable/common';
import { EmbeddableRegistryDefinition } from '../../../embeddable/server';

export interface DashboardEmbeddableCollectorData {
  total: number;
  panels: number;
  embeddedPanels: number;
}

export type DashboardEmbeddableInput = EmbeddableStateWithType & {
  panels: {
    [panelId: string]: PanelState<EmbeddableInput & { savedObjectId: string }>;
  };
};

export const DashboardEmbeddable: EmbeddableRegistryDefinition<DashboardEmbeddableInput> = {
  id: 'dashboard',

  telemetry: (state, rawCollectorData) => {
    const collectorData = rawCollectorData as DashboardEmbeddableCollectorData;
    const total = (collectorData.total || 0) + 1;
    const panels = (collectorData.panels || 0) + Object.values(state.panels).length;
    const embeddedPanels =
      (collectorData.embeddedPanels || 0) +
      Object.values(state.panels).filter((p) => p.explicitInput.savedObjectId === undefined).length;

    return { ...collectorData, total, panels, embeddedPanels };
  },
};
