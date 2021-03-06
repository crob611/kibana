/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import React from 'react';
import { mount } from 'enzyme';
import { waitFor, act } from '@testing-library/react';

import { AddComment, AddCommentRefObject } from '.';
import { TestProviders } from '../../../common/mock';
import { Router, routeData, mockHistory, mockLocation } from '../__mock__/router';

import { CommentRequest, CommentType } from '../../../../../case/common/api';
import { useInsertTimeline } from '../use_insert_timeline';
import { usePostComment } from '../../containers/use_post_comment';

jest.mock('../../containers/use_post_comment');
jest.mock('../use_insert_timeline');

const usePostCommentMock = usePostComment as jest.Mock;
const useInsertTimelineMock = useInsertTimeline as jest.Mock;
const onCommentSaving = jest.fn();
const onCommentPosted = jest.fn();
const postComment = jest.fn();

const addCommentProps = {
  caseId: '1234',
  disabled: false,
  insertQuote: null,
  onCommentSaving,
  onCommentPosted,
  showLoading: false,
};

const defaultPostCommment = {
  isLoading: false,
  isError: false,
  postComment,
};

const sampleData: CommentRequest = {
  comment: 'what a cool comment',
  type: CommentType.user,
};

describe('AddComment ', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    usePostCommentMock.mockImplementation(() => defaultPostCommment);
    jest.spyOn(routeData, 'useLocation').mockReturnValue(mockLocation);
  });

  it('should post comment on submit click', async () => {
    const wrapper = mount(
      <TestProviders>
        <Router history={mockHistory}>
          <AddComment {...addCommentProps} />
        </Router>
      </TestProviders>
    );

    await act(async () => {
      wrapper
        .find(`[data-test-subj="add-comment"] textarea`)
        .first()
        .simulate('change', { target: { value: sampleData.comment } });
    });

    expect(wrapper.find(`[data-test-subj="add-comment"]`).exists()).toBeTruthy();
    expect(wrapper.find(`[data-test-subj="loading-spinner"]`).exists()).toBeFalsy();

    await act(async () => {
      wrapper.find(`[data-test-subj="submit-comment"]`).first().simulate('click');
    });

    await waitFor(() => {
      expect(onCommentSaving).toBeCalled();
      expect(postComment).toBeCalledWith(addCommentProps.caseId, sampleData, onCommentPosted);
      expect(wrapper.find(`[data-test-subj="add-comment"] textarea`).text()).toBe('');
    });
  });

  it('should render spinner and disable submit when loading', () => {
    usePostCommentMock.mockImplementation(() => ({ ...defaultPostCommment, isLoading: true }));
    const wrapper = mount(
      <TestProviders>
        <Router history={mockHistory}>
          <AddComment {...{ ...addCommentProps, showLoading: true }} />
        </Router>
      </TestProviders>
    );

    expect(wrapper.find(`[data-test-subj="loading-spinner"]`).exists()).toBeTruthy();
    expect(
      wrapper.find(`[data-test-subj="submit-comment"]`).first().prop('isDisabled')
    ).toBeTruthy();
  });

  it('should disable submit button when disabled prop passed', () => {
    usePostCommentMock.mockImplementation(() => ({ ...defaultPostCommment, isLoading: true }));
    const wrapper = mount(
      <TestProviders>
        <Router history={mockHistory}>
          <AddComment {...{ ...addCommentProps, disabled: true }} />
        </Router>
      </TestProviders>
    );

    expect(
      wrapper.find(`[data-test-subj="submit-comment"]`).first().prop('isDisabled')
    ).toBeTruthy();
  });

  it('should insert a quote', async () => {
    const sampleQuote = 'what a cool quote';
    const ref = React.createRef<AddCommentRefObject>();
    const wrapper = mount(
      <TestProviders>
        <Router history={mockHistory}>
          <AddComment {...{ ...addCommentProps }} ref={ref} />
        </Router>
      </TestProviders>
    );

    await act(async () => {
      wrapper
        .find(`[data-test-subj="add-comment"] textarea`)
        .first()
        .simulate('change', { target: { value: sampleData.comment } });
    });

    await act(async () => {
      ref.current!.addQuote(sampleQuote);
    });

    expect(wrapper.find(`[data-test-subj="add-comment"] textarea`).text()).toBe(
      `${sampleData.comment}\n\n${sampleQuote}`
    );
  });

  it('it should insert a timeline', async () => {
    useInsertTimelineMock.mockImplementation((comment, onTimelineAttached) => {
      onTimelineAttached(`[title](url)`);
    });

    const wrapper = mount(
      <TestProviders>
        <Router history={mockHistory}>
          <AddComment {...{ ...addCommentProps }} />
        </Router>
      </TestProviders>
    );

    await waitFor(() => {
      expect(wrapper.find(`[data-test-subj="add-comment"] textarea`).text()).toBe('[title](url)');
    });
  });
});
