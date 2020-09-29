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

const NeedPackagesWrapper: FC<{}> = ({}) => {};

export const PackagesTable: FC<{}> = ({}) => {
  const hasSetInstallStatus = useRef<boolean>(false);
  const [packageDataCache, setPackageDataCache] = useState({});
  const setPackageInstallStatus = useSetPackageInstallStatus();
  const getPackageInstallStatus = useGetPackageInstallStatus();
  const { data: allPackagesRes, isLoading } = useGetPackages();

  const onGetPackageData = (pkgKey, pkgData) => {
    if (!packageDataCache[pkgKey]) {
      const newCache = { ...packageDataCache, [pkgKey]: pkgData };
      setPackageDataCache(newCache);
    }
  };

  if (isLoading) {
    return null;
  }

  if (allPackagesRes) {
    const installStatuses = allPackagesRes.response
      //.filter((info) => info.savedObject !== undefined)
      .map((packageInfo) => ({
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
      <PackagesTableComponent packages={allPackagesRes.response} iconComponent={PackageIcon} />
    );
  }
  return <div>Packages</div>;
};
