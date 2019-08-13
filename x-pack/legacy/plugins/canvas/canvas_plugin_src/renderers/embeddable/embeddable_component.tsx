/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import React, { useEffect, FunctionComponent } from 'react';
import { IEmbeddable } from '../../../../../../../src/legacy/core_plugins/embeddable_api/public/np_ready/public';

interface Props {
  embeddable: IEmbeddable;
  width: number;
  height: number;
}

const EmbeddableComponen: FunctionComponent<Props> = () => {
  return <div></div>;
};
