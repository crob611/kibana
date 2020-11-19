/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import React, { useState, useMemo, FC, ReactNode } from 'react';
import { EuiBasicTable, EuiButtonIcon } from '@elastic/eui';
import { RIGHT_ALIGNMENT } from '@elastic/eui/lib/services';
import { PackageDetail } from './package_detail.component';
import { ManagePackagesProps, RegistryPackageFunction, RegistryPackage, InstallStatus } from '.';
import { InstallationButton } from './installation_button.component';

export type PackagesTableProps = {
  /*
    canWrite is a boolean of if the user is able to install/uninstall
  */
  canWrite: boolean;
  /*
    getAssetCountComponent should fetch the assed count for the given package and pass it on to it's children
  */
  getAssetCountComponent: React.FC<{
    packageKey: string;
  }>;

  /*
    Get a link to a page to display more information about the package
  */
  getPackageHref: (pkgKey: string) => string;

  /*
    get the Install Status of a package by it's name
  */
  getPackageInstallStatus: (packageName: string) => InstallStatus;

  /*
    getReadmeComponent should fetch the README for the given package and pass it on to it's children
  */
  getReadmeComponent: React.FC<{
    packageKey: string;
  }>;

  /*
    iconComponent is a wrapper that takes in a Package and displays an icon for that package
  */
  iconComponent: React.FC<{ package: RegistryPackage }>;

  /* 
    Array of packages to display
  */
  packages: RegistryPackage[];

  /*
    Function to call when a package is to be installed
  */
  onInstallPackage: RegistryPackageFunction;

  /*
    Function to call when a package is to be uninstalled
  */
  onUninstallPackage: RegistryPackageFunction;
} & Omit<ManagePackagesProps, 'query' | 'capabilities'>;

const InstallButtonWrapper: FC<{
  package: RegistryPackage;
  canWrite: boolean;
  getAssetCountComponent: React.FC<{ packageKey: string }>;
  onInstall: RegistryPackageFunction;
  onUninstall: RegistryPackageFunction;
  installStatus: InstallStatus;
}> = ({
  package: packageData,
  getAssetCountComponent,
  onInstall,
  onUninstall,
  installStatus,
  canWrite,
}) => {
  const handleInstall = useMemo(() => () => onInstall(packageData), [packageData, onInstall]);
  const handleUninstall = useMemo(() => () => onUninstall(packageData), [packageData, onUninstall]);

  return (
    <InstallationButton
      packageKey={`${packageData.name}-${packageData.version}`}
      canInstall={canWrite}
      modalWrapperComponent={getAssetCountComponent}
      title={packageData.title || ''}
      installationStatus={installStatus}
      onInstall={handleInstall}
      onUninstall={handleUninstall}
    />
  );
};

export const PackagesTable: FC<PackagesTableProps> = ({
  packages,
  iconComponent: IconComponent,
  getReadmeComponent: ReadmeWrapper,
  getAssetCountComponent,
  getPackageHref,
  navigateToUrl,
  onInstallPackage,
  onUninstallPackage,
  getPackageInstallStatus,
  canWrite,
}) => {
  const [itemIdToExpandedRowMap, setItemIdToExpandedRowMap] = useState<Record<string, ReactNode>>(
    {}
  );

  const toggleDetails = (item: RegistryPackage) => {
    const itemIdToExpandedRowMapValues = { ...itemIdToExpandedRowMap };
    if (itemIdToExpandedRowMapValues[item.name]) {
      delete itemIdToExpandedRowMapValues[item.name];
    } else {
      const packageKey = `${item.name}-${item.version}`;
      itemIdToExpandedRowMapValues[item.name] = (
        <ReadmeWrapper packageKey={packageKey}>
          <PackageDetail getPackageHref={getPackageHref} navigateToUrl={navigateToUrl} />
        </ReadmeWrapper>
      );
    }
    setItemIdToExpandedRowMap(itemIdToExpandedRowMapValues);
  };

  const columns = [
    {
      width: '40px',
      isExpander: true,
      render: (item: RegistryPackage) => {
        return (
          <EuiButtonIcon
            onClick={() => toggleDetails(item)}
            aria-label={itemIdToExpandedRowMap[item.name] ? 'Collapse' : 'Expand'}
            iconType={itemIdToExpandedRowMap[item.name] ? 'arrowUp' : 'arrowDown'}
          />
        );
      },
    },
    {
      truncateText: true,
      render: (packageData: RegistryPackage) => {
        return (
          <span>
            <IconComponent package={packageData} /> {packageData.title}
          </span>
        );
      },
    },
    {
      align: RIGHT_ALIGNMENT,
      header: false,
      render: (packageData: RegistryPackage) => {
        return (
          <InstallButtonWrapper
            canWrite={canWrite}
            installStatus={getPackageInstallStatus(packageData.name)}
            onInstall={onInstallPackage}
            onUninstall={onUninstallPackage}
            package={packageData}
            getAssetCountComponent={getAssetCountComponent}
          />
        );
      },
    },
  ];

  return (
    <EuiBasicTable
      columns={columns}
      items={packages}
      itemId="name"
      isExpandable={true}
      itemIdToExpandedRowMap={itemIdToExpandedRowMap}
    />
  );
};
