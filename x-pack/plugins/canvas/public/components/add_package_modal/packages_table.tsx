/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import React, { FC, Children, ReactElement, useRef, useMemo } from 'react';
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

import { PackageIcon } from './package_icon';
import { ManagePackagesProps, RegistryPackageFunction, InstallStatus, PackageInfo } from '.';

import { NeedsPackageInfo, NeedsPackageReadme } from './fetch_components';

const PackageInfoAndReadme: React.FC<{ packageKey: string }> = ({ packageKey, children }) => {
  return (
    <NeedsPackageInfo packageKey={packageKey}>
      <NeedsPackageReadme key={'readme'} packageKey={packageKey}>
        {children}
      </NeedsPackageReadme>
    </NeedsPackageInfo>
  );
};

const getAssetCount = (packageInfo: PackageInfo) => {
  return Object.entries(packageInfo.assets).reduce(
    (acc, [serviceName, serviceNameValue]) =>
      acc +
      Object.entries(serviceNameValue || []).reduce(
        (acc2, [assetName, assetNameValue]) => acc2 + assetNameValue.length,
        0
      ),
    0
  );
};

const NeedsAssetCount: React.FC<{ packageInfo?: PackageInfo }> = ({ packageInfo, children }) => {
  const assetCount = packageInfo ? getAssetCount(packageInfo) : undefined;
  return (
    <>
      {Children.map(children, (child) => React.cloneElement(child as ReactElement, { assetCount }))}
    </>
  );
};

const PackageAssetCount: React.FC<{ packageKey: string }> = ({ packageKey, children }) => {
  return (
    <NeedsPackageInfo packageKey={packageKey}>
      <NeedsAssetCount key="asset-count">{children}</NeedsAssetCount>
    </NeedsPackageInfo>
  );
};

export const PackagesTable: FC<ManagePackagesProps> = ({ query, capabilities, ...restProps }) => {
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
        canWrite={capabilities.fleet.write as boolean}
        getPackageInstallStatus={getPackageInstallStatus}
        getPackageHref={getPackageHref}
        packages={allPackagesRes.response}
        iconComponent={PackageIcon}
        getPackageDetailsComponent={PackageInfoAndReadme}
        getPackageAssetCountComponent={PackageAssetCount}
        onInstallPackage={handleInstall}
        onUninstallPackage={handleUninstall}
      />
    );
  }

  return null;
};
