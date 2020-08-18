/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import React, { FC } from 'react';
import { PackagesGrid as PackagesGridComponent } from './packages_grid.component';
import { useGetPackages } from '../../../../ingest_manager/public/';
import { PackageIcon } from './package_icon';
import { PackageListItem } from '.';

export const PackagesGrid: FC<{ onSelect: (packageData: PackageListItem) => void }> = ({
  onSelect,
}) => {
  const { data: allPackagesRes, isLoading } = useGetPackages();

  if (isLoading) {
    return null;
  }

  if (allPackagesRes) {
    return (
      <PackagesGridComponent
        packages={allPackagesRes.response}
        iconComponent={PackageIcon}
        onSelect={onSelect}
      />
    );
  }
  return <div>Packages</div>;
};
