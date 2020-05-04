/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import { Storage } from '../../../../../src/plugins/kibana_utils/public';
import { LOCALSTORAGE_CLIPBOARD } from '../../common/lib/constants';
import { getWindow } from './get_window';

let storage: Storage;

const getStorage = (): Storage => {
  if (!storage) {
    storage = new Storage(getWindow().localStorage);
  }

  return storage;
};

export const setClipboardData = (data: any) => {
  getStorage().set(LOCALSTORAGE_CLIPBOARD, JSON.stringify(data));
};

export const getClipboardData = () => getStorage().get(LOCALSTORAGE_CLIPBOARD);
