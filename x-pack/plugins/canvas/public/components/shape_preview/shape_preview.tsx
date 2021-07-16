/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import React, { FC, useCallback } from 'react';
import PropTypes from 'prop-types';
import { ViewBoxParams, ShapeType } from '../../../../../../src/plugins/presentation_util/public';
import { Shape as ShapeComponent } from '../../../../../../src/plugins/expression_shape/public';

interface Props {
  shape?: ShapeType;
}

function getViewBox(defaultWidth: number, defaultViewBox: ViewBoxParams): ViewBoxParams {
  const { minX, minY, width, height } = defaultViewBox;
  return {
    minX: minX - defaultWidth / 2,
    minY: minY - defaultWidth / 2,
    width: width + defaultWidth,
    height: height + defaultWidth,
  };
}

export const ShapePreview: FC<Props> = ({ shape: Shape }) => {
  const getViewBoxCallback = useCallback((viewbox) => getViewBox(5, viewbox), []);
  if (!Shape) return <div className="canvasShapePreview" />;

  return (
    <div className="canvasShapePreview">
      <ShapeComponent
        shapeAttributes={{
          fill: 'none',
          stroke: 'black',
          viewBox: getViewBoxCallback,
        }}
        contentAttributes={{}}
      />
    </div>
  );
};

ShapePreview.propTypes = {
  shape: PropTypes.func,
};
