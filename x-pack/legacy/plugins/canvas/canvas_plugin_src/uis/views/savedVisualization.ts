/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

export const savedVisualization = () => ({
  name: 'savedVisualization',
  displayName: 'Saved Visualization',
  help: '',
  modelArgs: [],
  args: [
    {
      name: 'id',
      displayName: 'Id',
      help: 'An image to reveal given the function input. Eg, a full glass',
      argType: 'savedObject',
    },
  ],
});
