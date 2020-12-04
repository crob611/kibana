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

import { EmbeddableRegistryDefinition } from '../../../embeddable/server';
import { PersistableState } from '../../../kibana_utils/common/persistable_state';
import { VisualizationUsage } from '../usage_collector/get_usage_collector';
import { VisualizeInput } from '../../public/embeddable/visualize_embeddable';

type UsageByType = VisualizationUsage[string];

export const getEmptyTypeData = (): UsageByType => ({
  total: 0,
  spaces_avg: 0,
  saved_7_days_total: 0,
  saved_30_days_total: 0,
  saved_90_days_total: 0,
});

export class VisualizationEmbeddableFactory implements EmbeddableRegistryDefinition {
  public id: string = 'visualization';

  public telemetry: PersistableState['telemetry'] = (
    state: VisualizeInput,
    collectorData: VisualizationUsage
  ) => {
    if (state.savedVis !== undefined) {
      if (!collectorData[state.savedVis.type]) {
        collectorData[state.savedVis.type] = getEmptyTypeData();
      }

      const typeData = collectorData[state.savedVis.type];

      typeData.total = typeData.total + 1;
    }

    return collectorData;
  };
}
