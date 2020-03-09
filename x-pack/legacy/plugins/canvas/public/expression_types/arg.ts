/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import { createElement } from 'react';
import { pick } from 'lodash';
import { ArgForm } from '../components/arg_form';
import { argumentUIRegistry, ArgumentUI } from './argument_ui';

export interface FunctionFormArgumentSpec {
  argType: string;
  multi: boolean;
  required: boolean;
  types: string[];
  default: any;
  options: Record<string, any>;
  resolve: () => Record<string, any>;

  name: string;
  displayName: string;
  help: string;
}

export class Arg {
  public name: string;
  public displayName: string;
  public help: string;
  public argType: ArgumentUI;
  public multi: boolean;
  public required: boolean;
  public types: string[];
  public default: any;
  public options: Record<string, any>;
  public resolve: () => Record<string, any>;

  constructor(props: FunctionFormArgumentSpec) {
    const argType = argumentUIRegistry.get(props.argType);
    if (!argType) {
      throw new Error(`Invalid arg type: ${props.argType}`);
    }
    if (!props.name) {
      throw new Error('Args must have a name property');
    }

    // properties that can be overridden
    const defaultProps = {
      multi: false,
      required: false,
      types: [],
      default: argType.default != null ? argType.default : null,
      options: {},
      resolve: () => ({}),
    };

    const viewOverrides = {
      argType,
      ...pick<Omit<FunctionFormArgumentSpec, 'argType'>, FunctionFormArgumentSpec>(props, [
        'name',
        'displayName',
        'help',
        'multi',
        'required',
        'types',
        'default',
        'resolve',
        'options',
      ]),
    };

    const initializerValues = Object.assign({}, defaultProps, argType, viewOverrides);

    this.name = initializerValues.name;
    this.displayName = initializerValues.displayName;
    this.help = initializerValues.help;
    this.multi = initializerValues.multi;
    this.required = initializerValues.required;
    this.types = initializerValues.types;
    this.default = initializerValues.default;
    this.resolve = initializerValues.resolve;
    this.options = initializerValues.options;
    this.argType = initializerValues.argType;
  }

  // TODO: Document what these otherProps are. Maybe make them named arguments?
  render({ onValueChange, onValueRemove, argValue, key, label, ...otherProps }) {
    // This is everything the arg_type template needs to render
    const templateProps = {
      ...otherProps,
      ...this.resolve(otherProps),
      onValueChange,
      argValue,
      typeInstance: this,
    };

    const formProps = {
      key,
      argTypeInstance: this,
      valueMissing: this.required && argValue == null,
      label,
      onValueChange,
      onValueRemove,
      templateProps,
      argId: key,
    };

    return createElement(ArgForm, formProps);
  }
}
