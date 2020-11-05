/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import { EuiModal, EuiFlyout, EuiFlyoutBody, EuiIcon } from '@elastic/eui';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import React, { FC } from 'react';
import { PackagesTable } from '../packages_table.component';
import { elasticLogo } from '../../../../canvas_plugin_src/lib/elastic_logo';
import { elasticOutline } from '../../../../canvas_plugin_src/lib/elastic_outline';
import { PackageListItem } from '../';

const packages = [
  {
    description: 'This is the description of the Elastic Package',
    name: 'Elastic Package',
    title: 'Elastic Package Title',
    release: 'beta',
  },
  {
    description: 'This is the description of the Elastic Outline Package',
    name: 'Outline Package',
    title: 'Outline Package Title',
    release: 'experimental',
  },
];

const packageIcons = {
  'Elastic Package': elasticLogo,
  'Outline Package': elasticOutline,
};

const onSelect = action('onSelect');

const Wrapper: FC = ({ children }) => <div style={{ width: '500px' }}>{children}</div>;
const IconComponent: FC<{ package: PackageListItem }> = ({ package: packageItem }) => {
  const icon = packageItem.name === 'Elastic Package' ? elasticLogo : elasticOutline;
  return <EuiIcon type={icon} size="l" />;
};
const sampleReadme = `
  # Readme

  This is the readme for this package

  It should describe the package
`;

const sampleAssets = {
  kibana: {
    dashboard: [{}, {}],
  },
};
const ReadmeComponent: FC = ({ children }) => (
  <>
    {React.Children.map(children, (child) =>
      React.cloneElement(child, { readme: sampleReadme, packageInfo: { assets: sampleAssets } })
    )}
  </>
);
const AssetCountComponent: FC = ({ children }) => (
  <>{React.Children.map(children, (child) => React.cloneElement(child, { assetCount: 20 }))}</>
);

storiesOf('components/PackagesTable', module).add('default', () => (
  <Wrapper>
    <PackagesTable
      packages={packages}
      iconComponent={IconComponent}
      getAssetCountComponent={AssetCountComponent}
      getReadmeComponent={ReadmeComponent}
    />
  </Wrapper>
));
