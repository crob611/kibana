/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

import { Shape, ShapeHOC } from './shape';

export const SpeechBubble = ShapeHOC(Shape, {
  viewBox: {
    minX: 0,
    minY: 0,
    width: 100,
    height: 100,
  },
  shapeProps: {
    points: '0,0 100,0 100,70 40,70 20,85 25,70 0,70',
    strokeLinejoin: 'round',
  },
});
