/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */
import React, { FC } from 'react';
import { EuiCard, EuiIcon, EuiButton } from '@elastic/eui';
import { InstallationButton } from '../../../../ingest_manager/public/';

import { PackageInfo } from './';

interface Props {
  packageDetails: PackageInfo;
  onInstall: (packageDetails: PackageInfo) => void;
}

export const PackageDetails: FC<Props> = ({ packageDetails, onInstall }) => {
  return (
    <div>
      Package: {packageDetails.name}{' '}
      <InstallationButton
        assets={packageDetails.assets}
        name={packageDetails.name}
        title={packageDetails.title}
        version={packageDetails.version}
      />
    </div>
  );
};
