/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import React, { FunctionComponent, ReactNode, useState, useEffect, useReducer } from 'react';
import {
  EuiComboBox,
  EuiComboBoxOption,
  EuiHighlight,
  EuiIcon,
  EuiComboBoxOptionProps,
} from '@elastic/eui';
import { templateFromReactComponent } from '../../../../public/lib/template_from_react_component';
import { SimpleSavedObject } from 'src/core/public';

interface OptionType {
  label: string;
  id: string;
  icon: string;
}

interface Props {
  argValue: string;
  onArgChange: (arg: string) => void;
  options: OptionType[];
}

const RenderOption = (
  option: EuiComboBoxOptionProps<OptionType>,
  searchValue: string,
  contentClassName: string
): ReactNode => {
  return (
    <div className={contentClassName}>
      <EuiIcon type={option.icon} />{' '}
      <EuiHighlight search={searchValue}>{`${option.label} (${option.id})`}</EuiHighlight>
    </div>
  );
};

export const SavedObjectInput: FunctionComponent<Props> = ({
  argValue,

  onValueChange,
  options,
  isLoading,
  onSearchChange,
  ...theRest
}) => {
  const selectedOptions = options.filter(option => option.id === argValue);

  return (
    <EuiComboBox
      async
      singleSelection={{ asPlainText: true }}
      options={options}
      renderOption={RenderOption}
      onChange={selected => onValueChange(selected[0].id)}
      onSearchChange={onSearchChange}
      isLoading={isLoading}
      selectedOptions={selectedOptions}
    />
  );
};

function reducer(state, action) {
  if (action.type === 'searchChange') {
    return { ...state, searchString: action.searchString, isLoading: true };
  } else if (action.type === 'searchResult' && action.searchString === state.searchString) {
    return { ...state, savedObjects: action.savedObjects, isLoading: false };
  }
}

const initialState = { isLoading: false, searchString: '', savedObjects: [] };

const savedObjectToListOption = function(savedObject: SimpleSavedObject<{ title: string }>) {
  return {
    label: savedObject.attributes.title,
    id: savedObject.id,
    icon: 'document',
  };
};

const SavedObjectFetchHook: FunctionComponent<Props> = props => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const { searchString, savedObjects, isLoading } = state;

  const onSearchChange = (newSearch: string) => {
    dispatch({
      type: 'searchChange',
      searchString: newSearch,
    });
  };

  const doSearch = async () => {
    const result = await props.getAvailableEmbeddables(searchString, 'visualization');
    dispatch({
      type: 'searchResult',
      searchString,
      savedObjects: result.savedObjects.map(savedObjectToListOption),
    });
  };

  useEffect(() => {
    doSearch();
  }, [searchString]);

  return (
    <SavedObjectInput
      {...props}
      options={savedObjects}
      onSearchChange={onSearchChange}
      loading={isLoading}
    />
  );
};

export const savedObject = () => ({
  name: 'savedObject',
  displayName: 'Saved Object',
  help: 'Create or select a filter group',
  simpleTemplate: templateFromReactComponent(SavedObjectFetchHook),
});
