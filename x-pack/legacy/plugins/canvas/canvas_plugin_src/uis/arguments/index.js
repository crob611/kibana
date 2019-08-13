/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import { axisConfig } from './axis_config';
import { datacolumn } from './datacolumn';
import { filterGroup } from './filter_group';
import { imageUpload } from './image_upload';
import { number } from './number';
import { numberFormat } from './number_format';
import { palette } from './palette';
import { percentage } from './percentage';
import { range } from './range';
import { select } from './select';
import { shape } from './shape';
import { string } from './string';
import { textarea } from './textarea';
import { toggle } from './toggle';
import { savedObject } from './saved_object';

export const args = [
  axisConfig,
  datacolumn,
  filterGroup,
  imageUpload,
  number,
  numberFormat,
  palette,
  percentage,
  range,
  savedObject,
  select,
  shape,
  string,
  textarea,
  toggle,
];
