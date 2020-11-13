/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import React, { FC } from 'react';
import { EuiIcon } from '@elastic/eui';
import { usePackageIconType } from '../../../../fleet/public/';
import { PackageListItem } from '.';

interface Props {
  package: PackageListItem;
}

export const PackageIcon: FC<Props> = ({ package: packageData }) => {
  const args = {
    icons: packageData.icons,
    packageName: packageData.name,
    version: packageData.version,
  };

  const type = usePackageIconType(args);

  return <EuiIcon type={type} size="l" />;
};
