/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import React, { Component } from 'react';
import { compose, withPropsOnChange, withHandlers } from 'recompose';
import PropTypes from 'prop-types';
import { EuiSelect, EuiFlexItem, EuiFlexGroup } from '@elastic/eui';
import { sortBy } from 'lodash';
import { getType } from '@kbn/interpreter/common';
// @ts-ignore Untyped Local
import { createStatefulPropHoc } from '../../../../public/components/enhance/stateful_prop';
import { templateFromReactComponent } from '../../../../public/lib/template_from_react_component';
import { ArgumentStrings } from '../../../../i18n';
import { SimpleMathFunction } from './simple_math_function';
import { getFormObject, FormObject } from './get_form_object';

import { DatatableColumn } from '../../../../types';

const { DataColumn: strings } = ArgumentStrings;
const maybeQuoteValue = (val: string) => (val.match(/\s/) ? `'${val}'` : val);

interface ErrorObject {
  error: string;
}
type MathValue = FormObject | ErrorObject;
type SetMathValue = (event: any) => void;

interface DatacolumnArgInputProps {
  argId: string;
  columns: DatatableColumn[];
  mathValue: MathValue;
  onValueChange: (value: string) => void;
  setMathFunction: (value: string) => void;
  renderError: () => void;
  typeInstance: any;
}

// TODO: Garbage, we could make a much nicer math form that can handle way more.
class DatacolumnArgInput extends Component<DatacolumnArgInputProps> {
  static propTypes = {
    columns: PropTypes.array.isRequired,
    onValueChange: PropTypes.func.isRequired,
    mathValue: PropTypes.object.isRequired,
    setMathFunction: PropTypes.func.isRequired,
    typeInstance: PropTypes.object.isRequired,
    renderError: PropTypes.func.isRequired,
    argId: PropTypes.string.isRequired,
  };

  inputRefs: {
    fn?: HTMLSelectElement;
    column?: HTMLSelectElement;
  } = {};

  render() {
    const {
      onValueChange,
      columns,
      mathValue,
      setMathFunction,
      renderError,
      argId,
      typeInstance,
    } = this.props;

    if ((mathValue as ErrorObject).error) {
      renderError();
      return null;
    }

    const allowedTypes = typeInstance.options.allowedTypes || false;
    const onlyShowMathFunctions = typeInstance.options.onlyMath || false;
    const valueNotSet = (val?: string) => !val || val.length === 0;

    const updateFunctionValue = () => {
      const fn = this.inputRefs.fn?.value;
      const column = this.inputRefs.column?.value;

      // if setting size, auto-select the first column if no column is already set
      if (fn === 'size') {
        const col = column || (columns[0] && columns[0].name);
        if (col) {
          return onValueChange(`${fn}(${maybeQuoteValue(col)})`);
        }
      }

      // this.inputRefs.column is the column selection, if there is no value, do nothing
      if (valueNotSet(column) && fn) {
        return setMathFunction(fn);
      }

      // this.inputRefs.fn is the math function to use, if it's not set, just use the value input
      if (valueNotSet(fn) && column) {
        return onValueChange(column);
      }

      // this.inputRefs.fn has a value, so use it as a math.js expression
      onValueChange(`${fn}(${maybeQuoteValue(column || '')})`);
    };

    const column =
      columns.map(col => col.name).find(colName => colName === (mathValue as FormObject).column) ||
      '';

    const options = [{ value: '', text: 'select column', disabled: true }];

    sortBy(columns, 'name').forEach(columnValue => {
      if (allowedTypes && !allowedTypes.includes(columnValue.type)) {
        return;
      }
      options.push({ value: columnValue.name, text: columnValue.name, disabled: false });
    });

    return (
      <EuiFlexGroup gutterSize="s" id={argId} direction="row">
        <EuiFlexItem grow={false}>
          <SimpleMathFunction
            key={argId}
            value={(mathValue as FormObject).fn}
            inputRef={(ref: HTMLSelectElement) => (this.inputRefs.fn = ref)}
            onlymath={onlyShowMathFunctions}
            onChange={updateFunctionValue}
          />
        </EuiFlexItem>
        <EuiFlexItem>
          <EuiSelect
            compressed
            options={options}
            value={column}
            inputRef={ref => (this.inputRefs.column = ref || undefined)}
            onChange={updateFunctionValue}
          />
        </EuiFlexItem>
      </EuiFlexGroup>
    );
  }
}

const EnhancedDatacolumnArgInput = compose<DatacolumnArgInputProps, any>(
  withPropsOnChange(
    ['argValue', 'columns'],
    ({ argValue, columns }: { argValue: any; columns: DatatableColumn[] }) => ({
      mathValue: (value => {
        if (getType(value) !== 'string') {
          return { error: 'argValue is not a string type' };
        }
        try {
          const matchedCol = columns.find(({ name }) => value === name);
          const val = matchedCol ? maybeQuoteValue(matchedCol.name) : value;
          return getFormObject(val);
        } catch (e) {
          return { error: e.message };
        }
      })(argValue),
    })
  ),
  createStatefulPropHoc('mathValue', 'setMathValue'),
  withHandlers({
    setMathFunction: ({
      mathValue,
      setMathValue,
    }: {
      mathValue: MathValue;
      setMathValue: SetMathValue;
    }) => (fn: string) => setMathValue({ ...mathValue, fn }),
  })
)(DatacolumnArgInput);

EnhancedDatacolumnArgInput.propTypes = {
  argValue: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
  columns: PropTypes.array.isRequired,
};

export const datacolumn = () => ({
  name: 'datacolumn',
  displayName: strings.getDisplayName(),
  help: strings.getHelp(),
  default: '""',
  simpleTemplate: templateFromReactComponent(EnhancedDatacolumnArgInput),
});
