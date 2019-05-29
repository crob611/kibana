/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import chroma from 'chroma-js';

interface Palette {
  type: string;
  colors: string[];
  gradient: boolean;
}

export const getColorsFromPalette = (palette: Palette, size: number) =>
  palette.gradient ? chroma.scale(palette.colors).colors(size) : palette.colors;
