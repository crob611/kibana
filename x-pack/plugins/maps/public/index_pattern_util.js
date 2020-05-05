/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import { getIndexPatternService } from './kibana_services';
import { indexPatterns } from '../../../../src/plugins/data/public';
import { ES_GEO_FIELD_TYPE } from '../common/constants';

export async function getIndexPatternsFromIds(indexPatternIds = []) {
  const promises = [];
  indexPatternIds.forEach(id => {
    const indexPatternPromise = getIndexPatternService().get(id);
    if (indexPatternPromise) {
      promises.push(indexPatternPromise);
    }
  });

  return await Promise.all(promises);
}

export function getTermsFields(fields) {
  return fields.filter(field => {
    return (
      field.aggregatable &&
      !indexPatterns.isNestedField(field) &&
      ['number', 'boolean', 'date', 'ip', 'string'].includes(field.type)
    );
  });
}

export const AGGREGATABLE_GEO_FIELD_TYPES = [ES_GEO_FIELD_TYPE.GEO_POINT];

export function getFieldsWithGeoTileAgg(fields) {
  return fields.filter(supportsGeoTileAgg);
}

export function supportsGeoTileAgg(field) {
  // TODO add geo_shape support with license check
  return (
    field &&
    field.aggregatable &&
    !indexPatterns.isNestedField(field) &&
    field.type === ES_GEO_FIELD_TYPE.GEO_POINT
  );
}

// Returns filtered fields list containing only fields that exist in _source.
export function getSourceFields(fields) {
  return fields.filter(field => {
    // Multi fields are not stored in _source and only exist in index.
    const isMultiField = field.subType && field.subType.multi;
    return !isMultiField && !indexPatterns.isNestedField(field);
  });
}
