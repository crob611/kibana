/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import React from 'react';
import { PackageDetailsComponent as PackageDetails } from '../';
import { InstallationStatus } from '../../../../../ingest_manager/common/types';
import { elasticLogo } from '../../../../canvas_plugin_src/lib/elastic_logo';
import { elasticOutline } from '../../../../canvas_plugin_src/lib/elastic_outline';
import { RegistryRelease } from '../../../../../ingest_manager/common/types';

const packageDetails = {
  package: {
    description: 'This is the description of the Elastic Package',
    name: 'Elastic Package',
    title: 'Elastic Package Title',
    release: 'beta' as 'beta',
    path: 'path',
    version: 'version',
    type: 'type',
    categories: [],
    requirement: {
      kibana: { versions: '0' },
      elasticsearch: { versions: '0' },
    },
    format_version: '',
    download: '',
    latestVersion: '',
    assets: {
      kibana: {
        dashboard: [],
        visualization: [],
        search: [],
        'index-type': [],
        'index-pattern': [],
        map: [],
      },
    },
    status: InstallationStatus.notInstalled as InstallationStatus.notInstalled,
  },
  screenshots: [],
};

const onInstall = action('onInstall');

/*
storiesOf('components/Packages/Details', module).add('default', () => (
  <PackageDetails packageDetails={packageDetails} onInstall={onInstall} />
));
*/
