/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

import React from 'react';
import { viewBoxToString } from '../../common/lib';
import { ShapeProps, SvgConfig, SvgElementTypes } from './types';

export const getShapeComponent = (svgParams: SvgConfig) =>
  function Shape({ shapeAttributes, shapeContentAttributes }: ShapeProps) {
    const { viewBox: initialViewBox, shapeProps, shapeType } = svgParams;

    const viewBox = shapeAttributes?.viewBox
      ? viewBoxToString(shapeAttributes?.viewBox)
      : viewBoxToString(initialViewBox);

    const SvgContentElement = getShapeContentElement(shapeType);
    return (
      <svg xmlns="http://www.w3.org/2000/svg" {...{ ...(shapeAttributes || {}), viewBox }}>
        <SvgContentElement {...{ ...(shapeContentAttributes || {}), ...shapeProps }} />
      </svg>
    );
  };

function getShapeContentElement(type?: SvgElementTypes) {
  switch (type) {
    case SvgElementTypes.circle:
      return (props: SvgConfig['shapeProps']) => <circle {...props} />;
    case SvgElementTypes.rect:
      return (props: SvgConfig['shapeProps']) => <rect {...props} />;
    case SvgElementTypes.path:
      return (props: SvgConfig['shapeProps']) => <path {...props} />;
    default:
      return (props: SvgConfig['shapeProps']) => <polygon {...props} />;
  }
}

export const createShape = (props: SvgConfig) => {
  return {
    Component: getShapeComponent(props),
    data: props,
  };
};

export type ShapeType = ReturnType<typeof createShape>;
