/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

/* eslint-disable max-classes-per-file */
import { Registry } from '@kbn/interpreter/common';
import { BaseForm } from './base_form';
import { ArgumentSpec, ArgumentRenderer } from '../../types/arguments';

export class ArgumentUI extends BaseForm {
  public simpleTemplate: ArgumentRenderer<any> | undefined;
  public template: ArgumentRenderer<any> | undefined;
  public default: string | undefined;
  public resolveArgValue: boolean;

  constructor(props: ArgumentSpec<any>) {
    super(props);

    this.simpleTemplate = props.simpleTemplate;
    this.template = props.template;
    this.default = props.default;
    this.resolveArgValue = Boolean(props.resolveArgValue);
  }
}

class ArgumentUIRegistry extends Registry<ArgumentSpec, ArgumentUI> {
  wrapper(obj: ArgumentSpec) {
    return new ArgumentUI(obj);
  }
}

export const argumentUIRegistry = new ArgumentUIRegistry();
