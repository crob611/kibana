/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import React, { useEffect, useRef, FunctionComponent } from 'react';
import { IEmbeddable } from '../../../../../../../src/legacy/core_plugins/embeddable_api/public/np_ready/public';
import { EmbeddablesRegistry } from './embeddables_registry';

interface Props {
  embeddable: IEmbeddable;
  registry: EmbeddablesRegistry;
  width: number;
  height: number;
}

export const EmbeddableComponent: FunctionComponent<Props> = props => {
  const embeddableRef = useRef<IEmbeddable | null>(null);

  useEffect(() => {
    const prevEmbeddable = embeddableRef.current;
    if (prevEmbeddable) {
      props.registry.decrement(prevEmbeddable);
    }
    props.registry.increment(props.embeddable);
  }, [props.embeddable]);

  return <div></div>;
};
