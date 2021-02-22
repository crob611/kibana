/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { mockKibanaValues, setMockActions, setMockValues } from '../../../../__mocks__';
import '../../../__mocks__/engine_logic.mock';

import React from 'react';

import { shallow, mount, ReactWrapper } from 'enzyme';

import { EuiBasicTable, EuiEmptyPrompt } from '@elastic/eui';

import { Loading } from '../../../../shared/loading';

import { Curations, CurationsTable } from './curations';

describe('Curations', () => {
  const { navigateToUrl } = mockKibanaValues;

  const values = {
    dataLoading: false,
    curations: [
      {
        id: 'cur-id-1',
        last_updated: 'January 1, 1970 at 12:00PM',
        queries: ['hiking'],
      },
      {
        id: 'cur-id-2',
        last_updated: 'January 2, 1970 at 12:00PM',
        queries: ['mountains', 'valleys'],
      },
    ],
    meta: {
      page: {
        current: 1,
        size: 10,
        total_results: 2,
      },
    },
  };

  const actions = {
    loadCurations: jest.fn(),
    deleteCurationSet: jest.fn(),
    onPaginate: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    setMockValues(values);
    setMockActions(actions);
  });

  it('renders', () => {
    const wrapper = shallow(<Curations />);

    expect(wrapper.find('h1').text()).toEqual('Curated results');
    expect(wrapper.find(CurationsTable)).toHaveLength(1);
  });

  it('renders a loading component on page load', () => {
    setMockValues({ ...values, dataLoading: true, curations: [] });
    const wrapper = shallow(<Curations />);

    expect(wrapper.find(Loading)).toHaveLength(1);
  });

  it('calls loadCurations on page load', () => {
    mount(<Curations />);

    expect(actions.loadCurations).toHaveBeenCalledTimes(1);
  });

  describe('CurationsTable', () => {
    it('renders an EuiEmptyPrompt if curations is empty', () => {
      setMockValues({ ...values, curations: [] });
      const wrapper = shallow(<CurationsTable />);

      expect(wrapper.find(EuiBasicTable).prop('noItemsMessage').type).toEqual(EuiEmptyPrompt);
    });

    it('passes loading prop based on dataLoading', () => {
      setMockValues({ ...values, dataLoading: true });
      const wrapper = shallow(<CurationsTable />);

      expect(wrapper.find(EuiBasicTable).prop('loading')).toEqual(true);
    });

    describe('populated table render', () => {
      let wrapper: ReactWrapper;

      beforeAll(() => {
        wrapper = mount(<CurationsTable />);
      });

      it('renders queries and last updated columns', () => {
        const tableContent = wrapper.find(EuiBasicTable).text();

        expect(tableContent).toContain('Queries');
        expect(tableContent).toContain('hiking');
        expect(tableContent).toContain('mountains, valleys');

        expect(tableContent).toContain('Last updated');
        expect(tableContent).toContain('January 1, 1970 at 12:00PM');
        expect(tableContent).toContain('January 2, 1970 at 12:00PM');
      });

      it('renders queries with curation links', () => {
        expect(
          wrapper.find('EuiLinkTo[data-test-subj="CurationsTableQueriesLink"]').first().prop('to')
        ).toEqual('/engines/some-engine/curations/cur-id-1');

        expect(
          wrapper.find('EuiLinkTo[data-test-subj="CurationsTableQueriesLink"]').last().prop('to')
        ).toEqual('/engines/some-engine/curations/cur-id-2');
      });

      describe('action column', () => {
        it('edit action navigates to curation link', () => {
          wrapper.find('[data-test-subj="CurationsTableEditButton"]').first().simulate('click');
          expect(navigateToUrl).toHaveBeenCalledWith('/engines/some-engine/curations/cur-id-1');

          wrapper.find('[data-test-subj="CurationsTableEditButton"]').last().simulate('click');
          expect(navigateToUrl).toHaveBeenCalledWith('/engines/some-engine/curations/cur-id-2');
        });

        it('delete action calls deleteCurationSet', () => {
          wrapper.find('[data-test-subj="CurationsTableDeleteButton"]').first().simulate('click');
          expect(actions.deleteCurationSet).toHaveBeenCalledWith('cur-id-1');

          wrapper.find('[data-test-subj="CurationsTableDeleteButton"]').last().simulate('click');
          expect(actions.deleteCurationSet).toHaveBeenCalledWith('cur-id-2');
        });
      });
    });

    describe('pagination', () => {
      it('passes pagination props from meta.page', () => {
        setMockValues({
          ...values,
          meta: {
            page: {
              current: 5,
              size: 10,
              total_results: 50,
            },
          },
        });
        const wrapper = shallow(<CurationsTable />);

        expect(wrapper.find(EuiBasicTable).prop('pagination')).toEqual({
          pageIndex: 4,
          pageSize: 10,
          totalItemCount: 50,
          hidePerPageOptions: true,
        });
      });

      it('calls onPaginate on pagination change', () => {
        const wrapper = shallow(<CurationsTable />);
        wrapper.find(EuiBasicTable).simulate('change', { page: { index: 0 } });

        expect(actions.onPaginate).toHaveBeenCalledWith(1);
      });
    });
  });
});
