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

interface CollectorData {
  total: number;
}

export class DashboardEmbeddableFactory implements EmbeddableRegistryDefinition {
  public id: string = 'dashboard';

  public extract = (state) => {};

  public telemetry = (state, collectorData: CollectorData) => {
    const newCollectorData = { ...collectorData, total: collectorData.total + 1 };
    return newCollectorData;
  };
}
