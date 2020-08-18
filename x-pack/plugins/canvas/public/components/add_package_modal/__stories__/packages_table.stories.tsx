/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import { EuiModal, EuiFlyout, EuiFlyoutBody } from '@elastic/eui';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import React from 'react';
import { PackagesTable } from '../packages_table.component';
import { elasticLogo } from '../../../../canvas_plugin_src/lib/elastic_logo';
import { elasticOutline } from '../../../../canvas_plugin_src/lib/elastic_outline';

const packages = [
  {
    package: {
      description: 'This is the description of the Elastic Package',
      name: 'Elastic Package',
      title: 'Elastic Package Title',
      release: 'beta',
    },
    packageIcon: elasticLogo,
  },
  {
    package: {
      description: 'This is the description of the Elastic Outline Package',
      name: 'Outline Package',
      title: 'Outline Package Title',
      release: 'experimental',
    },
    packageIcon: elasticOutline,
  },
];

const onSelect = action('onSelect');

storiesOf('components/PackagesTable', module)
  .add('default', () => <PackagesTable />)
  .add('in a flyout', () => {
    return (
      <EuiFlyout onClose={() => null}>
        <EuiFlyoutBody>
          <PackagesTable />
        </EuiFlyoutBody>
      </EuiFlyout>
    );
  });
