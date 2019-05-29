/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import { Legend, LegendConfig } from '../../canvas_plugin_src/functions/types';

export const getLegendConfig = (legend: Legend | boolean, size?: number): LegendConfig => {
  if (!legend || (size && size < 2)) {
    return { show: false };
  }

  const acceptedPositions = Object.values(Legend);

  const position =
    typeof legend === 'string' && acceptedPositions.includes(legend) ? legend : Legend.NORTH_EAST;

  return {
    position,
    show: true,
    backgroundOpacity: 0,
    labelBoxBorderColor: 'transparent',
  };
};
