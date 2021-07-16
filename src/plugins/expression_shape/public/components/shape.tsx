/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

import React, { FC, useRef, useState, useEffect } from 'react';
import {
  ShapeAttributes,
  ShapeContentAttributes,
  ViewBoxParams,
} from '../../../presentation_util/public';

const Arrow = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
    <polygon points="0,40 60,40 60,20 95,50 60,80 60,60 0,60" />
  </svg>
);

const viewBoxToString = (viewBox) => {
  if (!viewBox) return;
  return `${viewBox?.minX} ${viewBox?.minY} ${viewBox?.width} ${viewBox?.height}`;
};

export const Shape: FC<{
  shapeAttributes: ShapeAttributes;
  contentAttributes: ShapeContentAttributes;
}> = ({ shapeAttributes, contentAttributes }) => {
  const svgRef = useRef<SVGElement>();
  const [hasMounted, setHasMounted] = useState(false);
  const [mountedViewbox, setMountedViewbox] = useState<ViewBoxParams | null>(null);

  const hasViewboxCallback =
    typeof shapeAttributes.viewBox === 'function' && mountedViewbox !== null;

  const myShapeAttributes: ShapeAttributes = {
    ...shapeAttributes,
    viewBox: hasViewboxCallback ? shapeAttributes.viewBox(mountedViewbox) : undefined,
  };

  useEffect(() => {
    if (!hasMounted && svgRef.current) {
      setHasMounted(true);
      const viewBoxArray = svgRef.current
        .getAttribute('viewBox')
        .split(' ')
        .map((v) => parseInt(v, 10));
      setMountedViewbox({
        minX: viewBoxArray[0] || 0,
        minY: viewBoxArray[1] || 0,
        width: viewBoxArray[2] || 0,
        height: viewBoxArray[3] || 0,
      });
    }
  }, [svgRef, hasMounted, setHasMounted, setMountedViewbox]);

  useEffect(() => {
    if (svgRef.current) {
      for (const [attr, value] of Object.entries(myShapeAttributes)) {
        if (attr === 'viewBox' && value) {
          console.log('setting view box', viewBoxToString(value));
          svgRef.current.setAttribute(attr, viewBoxToString(value));
        } else {
          svgRef.current.setAttribute(attr, value);
        }
      }

      const content = svgRef.current.firstElementChild;
      for (const [attr, value] of Object.entries(contentAttributes)) {
        if (attr === 'strokeWidth') {
          content?.setAttribute('stroke-width', value);
        } else if (attr === 'vectorEffect') {
          content?.setAttribute('vector-effect', value);
        } else if (attr === 'strokeMitrelimit') {
          content?.setAttribute('stroke-mitrelimit', value);
        } else {
          content?.setAttribute(attr, value);
        }
      }
    }
  }, [myShapeAttributes, contentAttributes]);

  return (
    <div ref={(element) => (svgRef.current = element?.firstChild)}>
      <Arrow />
    </div>
  );
};
