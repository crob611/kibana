/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import chrome from 'ui/chrome';
import { embeddableFactories } from '../../../../../../../src/legacy/core_plugins/embeddable_api/public';

function isNotUndefined<T>(obj: T | undefined): obj is T {
  return typeof obj !== 'undefined';
}

export const getAvailableEmbeddables = async (
  query: string,
  embeddableTypes: string | string[]
) => {
  if (!Array.isArray(embeddableTypes)) {
    embeddableTypes = [embeddableTypes];
  }

  const availableMetaData = Array.from(embeddableFactories.entries())
    .filter(([key]) => embeddableTypes.includes(key))
    .map(([_key, factory]) => factory.savedObjectMetaData)
    .filter(isNotUndefined);

  const resp = await chrome.getSavedObjectsClient().find({
    type: availableMetaData.map(metaData => metaData.type),
    fields: ['title', 'visState'],
    search: query ? `${query}*` : undefined,
    page: 1,
    perPage: chrome.getUiSettingsClient().get('savedObjects:listingLimit'),
    searchFields: ['title^3', 'description'],
    defaultSearchOperator: 'AND',
  });

  resp.savedObjects = resp.savedObjects.filter(savedObject => {
    const metaData = availableMetaData.find(m => m.type === savedObject.type);

    if (metaData && metaData.showSavedObject) {
      return metaData.showSavedObject(savedObject);
    } else {
      return true;
    }
  });

  return resp;
};
