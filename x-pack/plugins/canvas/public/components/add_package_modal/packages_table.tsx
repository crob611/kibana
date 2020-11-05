/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import React, { FC, useRef, useState } from 'react';
import { PackagesTable as PackagesTableComponent } from './packages_table.component';
import {
  useGetPackages,
  useSetPackageInstallStatus,
  useGetPackageInstallStatus,
} from '../../../../ingest_manager/public/';
import { InstallStatus } from '../../../../ingest_manager/common';
import { PackageIcon } from './package_icon';
import { PackageListItem } from '.';
import { NeedsPackageInfoAndReadme, NeedsAssetCount } from './needs_package_info';

export const PackagesTable: FC<{}> = ({}) => {
  const hasSetInstallStatus = useRef<boolean>(false);
  const setPackageInstallStatus = useSetPackageInstallStatus();
  const { data: allPackagesRes, isLoading } = useGetPackages();

  if (isLoading) {
    return null;
  }

  if (allPackagesRes) {
    const installStatuses = allPackagesRes.response.map((packageInfo) => ({
      name: packageInfo.name,
      version: packageInfo.version,
      status:
        packageInfo.savedObject !== undefined
          ? InstallStatus.installed
          : InstallStatus.notInstalled,
    }));

    if (installStatuses.length > 0 && !hasSetInstallStatus.current) {
      hasSetInstallStatus.current = true;
      setPackageInstallStatus(installStatuses);
    }

    return (
      <PackagesTableComponent
        packages={allPackagesRes.response}
        iconComponent={PackageIcon}
        getAssetCountComponent={NeedsAssetCount}
        getReadmeComponent={NeedsPackageInfoAndReadme}
      />
    );
  }

  return null;
};
