/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import expect from '@kbn/expect';
import { handleResponse } from '../custom_element_collector';
import { CUSTOM_ELEMENT_TYPE } from '../../../common/lib/constants';

const getMockResponse = (mocks = []) => ({
  hits: {
    hits: mocks.map(customElement => ({
      _source: {
        [CUSTOM_ELEMENT_TYPE]: customElement,
      },
    })),
  },
});

function mockCustomElement(...nodeExpressions) {
  return {
    content: JSON.stringify({
      selectedNodes: nodeExpressions.map(expression => ({
        expression,
      })),
    }),
  };
}

describe('custom_element_collector.handleResponse', () => {
  describe('invalid responses', () => {
    it('returns nothing if no valid hits', () => {
      const response = getMockResponse();
      expect(handleResponse(response)).to.eql({});
    });

    it('returns nothing if no valid elements', () => {
      const response = getMockResponse([
        {
          contents: 'invalid json',
        },
      ]);

      expect(handleResponse(response)).to.eql({});
    });
  });

  it('counts total custom elements', () => {
    const elements = [mockCustomElement(''), mockCustomElement('')];

    const response = getMockResponse(elements);

    expect(handleResponse(response).custom_elements.count).to.equal(elements.length);
  });

  it('reports all the functions used in custom elements', () => {
    const functions1 = ['a', 'b', 'c'];
    const functions2 = ['c', 'd', 'e', 'f'];
    const expectedFunctions = Array.from(new Set([...functions1, ...functions2]));

    const elements = [mockCustomElement(functions1.join('|')), mockCustomElement(...functions2)];
    const response = getMockResponse(elements);

    expect(handleResponse(response).custom_elements.functions_in_use).to.eql(expectedFunctions);
  });

  it('reports minimum, maximum, and avg elements in a custom element', () => {
    const functionsMin = ['a', 'b', 'c'];
    const functionsMax = ['d', 'e', 'f', 'g', 'h'];
    const functionsOther = ['i', 'j', 'k', 'l'];
    const avgFunctions = (functionsMin.length + functionsMax.length + functionsOther.length) / 3;

    const elements = [
      mockCustomElement(...functionsMin),
      mockCustomElement(...functionsMax),
      mockCustomElement(...functionsOther),
    ];

    const response = getMockResponse(elements);

    const result = handleResponse(response);

    expect(result.custom_elements.elements.max).to.equal(functionsMax.length);
    expect(result.custom_elements.elements.min).to.equal(functionsMin.length);
    expect(result.custom_elements.elements.avg).to.equal(avgFunctions);
  });
});
