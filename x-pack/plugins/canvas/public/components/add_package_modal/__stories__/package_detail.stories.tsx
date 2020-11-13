/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import React, { FC } from 'react';
import { storiesOf } from '@storybook/react';
import { PackageDetail } from '../package_detail.component';
import { KibanaAssetType } from '../';

const Wrapper: FC = ({ children }) => <div style={{ width: '400px' }}>{children}</div>;

const sampleInfo: any = {
  assets: {
    kibana: {
      [KibanaAssetType.indexPattern]: [{}, {}, {}],
      [KibanaAssetType.map]: [{}],
    },
  },
};

const shortReadme = `
  # This is a readme
  It's really short
`;

const longReadme = `
  # This is a really long readme and it should wrap on the container
  
  # Lots of content

  # Even more content

  # Wow this has so much content

  # It should trigger an overflow

  # And the overflow part should be hidden
`;

storiesOf('components/PackagesFlyout/package_details', module)
  .add('error', () => (
    <Wrapper>
      <PackageDetail error={'This is the error message'} />
    </Wrapper>
  ))
  .add('loading', () => (
    <Wrapper>
      <PackageDetail />
    </Wrapper>
  ))
  .add('loaded not overflowing', () => (
    <Wrapper>
      <PackageDetail packageInfo={sampleInfo} readme={shortReadme} />
    </Wrapper>
  ))
  .add('overflowing', () => (
    <Wrapper>
      <PackageDetail packageInfo={sampleInfo} readme={longReadme} />
    </Wrapper>
  ))
  .add('with asset type', () => (
    <Wrapper>
      <PackageDetail
        packageInfo={sampleInfo}
        readme={longReadme}
        assetType={'index_pattern' as any}
      />
    </Wrapper>
  ));
