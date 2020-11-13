/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import React, { FC, useRef, useMemo } from 'react';
import { EuiLoadingContent } from '@elastic/eui';
import { PackagesTable as PackagesTableComponent } from './packages_table.component';
import {
  useGetPackages,
  useSetPackageInstallStatus,
  useLink,
  useInstallPackage,
  useUninstallPackage,
  useGetPackageInstallStatus,
} from '../../../../fleet/public/';
import { InstallStatus } from '../../../../fleet/common';
import { PackageIcon } from './package_icon';
import { NeedsPackageInfoAndReadme, NeedsAssetCount } from './needs_package_info';
import { PackagesTableProps, PackageInfo, RegistryPackage } from '.';

export type QueryType = Parameters<typeof useGetPackages>[0];
export type RegistryPackageFunction = (
  packageInfo: Pick<RegistryPackage, 'name' | 'version' | 'title'>
) => void;

export const PackagesTable: FC<PackagesTableProps> = ({ query, ...restProps }) => {
  const hasSetInstallStatus = useRef<boolean>(false);
  const setPackageInstallStatus = useSetPackageInstallStatus();
  const { data: allPackagesRes, isLoading } = useGetPackages(query);
  const { getHref } = useLink();
  const getPackageHref = useMemo(
    () => (pkgkey: string) => getHref('integration_details', { pkgkey }),
    [getHref]
  );
  const installPackage = useInstallPackage();
  const uninstallPackage = useUninstallPackage();
  const getPackageInstallItem = useGetPackageInstallStatus();

  const handleInstall = useMemo<RegistryPackageFunction>(
    () => (packageData) =>
      installPackage({
        name: packageData.name,
        version: packageData.version,
        title: packageData.title || '',
      }),
    [installPackage]
  );

  const handleUninstall = useMemo<RegistryPackageFunction>(
    () => (packageData) =>
      uninstallPackage({
        name: packageData.name,
        version: packageData.version,
        title: packageData.title || '',
      }),
    [uninstallPackage]
  );

  const getPackageInstallStatus = useMemo(
    () => (pkgKey: string) => {
      const item = getPackageInstallItem(pkgKey);

      return item ? item.status : InstallStatus.notInstalled;
    },
    [getPackageInstallItem]
  );

  if (isLoading) {
    return (
      <div>
        <EuiLoadingContent lines={5} />
        <br />
        <EuiLoadingContent lines={5} />
      </div>
    );
  }

  if (allPackagesRes) {
    const installStatuses = allPackagesRes.response.map((packageInfo) => ({
      name: packageInfo.name,
      version: packageInfo.version,
      status: 'savedObject' in packageInfo ? InstallStatus.installed : InstallStatus.notInstalled,
    }));

    if (installStatuses.length > 0 && !hasSetInstallStatus.current) {
      hasSetInstallStatus.current = true;
      setPackageInstallStatus(installStatuses);
    }

    return (
      <PackagesTableComponent
        {...restProps}
        getPackageInstallStatus={getPackageInstallStatus}
        getPackageHref={getPackageHref}
        packages={allPackagesRes.response}
        iconComponent={PackageIcon}
        getAssetCountComponent={NeedsAssetCount}
        getReadmeComponent={NeedsPackageInfoAndReadme}
        onInstallPackage={handleInstall}
        onUninstallPackage={handleUninstall}
      />
    );
  }

  return null;
};
