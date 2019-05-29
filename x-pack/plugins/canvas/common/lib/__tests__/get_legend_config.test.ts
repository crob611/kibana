/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import { getLegendConfig } from '../get_legend_config';
import { Legend } from '../../../canvas_plugin_src/functions/types';

describe('getLegendConfig', () => {
  describe('show', () => {
    it('hides the legend', () => {
      let legendConfig = getLegendConfig(false, 2);
      expect(Object.keys(legendConfig)).toHaveLength(1);
      expect(legendConfig).toHaveProperty('show', false);

      legendConfig = getLegendConfig(false, 10);
      expect(Object.keys(legendConfig)).toHaveLength(1);
      expect(legendConfig).toHaveProperty('show', false);
    });

    it('hides the legend when there are less than 2 series', () => {
      let legendConfig = getLegendConfig(false, 1);
      expect(Object.keys(legendConfig)).toHaveLength(1);
      expect(legendConfig).toHaveProperty('show', false);

      legendConfig = getLegendConfig(true, 1);
      expect(Object.keys(legendConfig)).toHaveLength(1);
      expect(legendConfig).toHaveProperty('show', false);
    });

    it('shows the legend when there are two or more series', () => {
      expect(getLegendConfig(Legend.SOUTH_WEST, 2)).toHaveProperty('show', true);
      expect(getLegendConfig(true, 5)).toHaveProperty('show', true);
    });
  });

  describe('position', () => {
    it('sets the position of the legend', () => {
      expect(getLegendConfig(Legend.NORTH_WEST)).toHaveProperty('position', Legend.NORTH_WEST);
      expect(getLegendConfig(Legend.NORTH_EAST)).toHaveProperty('position', Legend.NORTH_EAST);
      expect(getLegendConfig(Legend.SOUTH_WEST)).toHaveProperty('position', Legend.SOUTH_WEST);
      expect(getLegendConfig(Legend.SOUTH_EAST)).toHaveProperty('position', Legend.SOUTH_EAST);
    });

    it("defaults to 'ne'", () => {
      expect(getLegendConfig(true)).toHaveProperty('position', Legend.NORTH_EAST);
      // @ts-ignore Test in case legacy code is passing in non conforming values
      expect(getLegendConfig('foo')).toHaveProperty('position', Legend.NORTH_EAST);
    });
  });
});
