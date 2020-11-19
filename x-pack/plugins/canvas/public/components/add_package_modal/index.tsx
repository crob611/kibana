/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import React, { FC, useState, useCallback } from 'react';
import { EuiFlyout, EuiFlyoutBody, EuiFlyoutProps } from '@elastic/eui';
import { Capabilities } from 'src/core/public';
import {
  PackageInfo,
  KibanaAssetType,
  RegistryPackage as FullRegistryPackage,
  InstallStatus,
} from '../../../../fleet/common/';
import { PackageInstallProvider, AssetTitleMap, useGetPackages } from '../../../../fleet/public';
import {
  PackagesTable as PackagesTableComponent,
  PackagesTableProps,
} from './packages_table.component';
import { PackagesTable as PackagesTableContainer } from './packages_table';
import { usePlatformService } from '../../services';

import { PackageInfoResponse, CacheContext } from './package_info_cache_context';

export {
  PackagesTableContainer,
  PackagesTableComponent,
  PackageInfoResponse,
  PackageInfo,
  KibanaAssetType,
  AssetTitleMap,
  InstallStatus,
  PackagesTableProps,
};

export type RegistryPackage = Pick<FullRegistryPackage, 'name' | 'version' | 'title' | 'icons'>;

export type RegistryPackageFunction = (packageInfo: RegistryPackage) => void;

export type QueryType = Parameters<typeof useGetPackages>[0];
export interface ManagePackagesProps {
  query?: QueryType;
  navigateToUrl: (url: string) => void;
  onInstallationStatusChange: () => void;
  capabilities: Capabilities;
}

export const ManagePackages: FC<ManagePackagesProps> = (props) => {
  const platform = usePlatformService();
  const [packageInfoCache, setPackageInfoCache] = useState(new Map<string, PackageInfoResponse>());
  const [packageReadmeCache, setPackageReadmeCache] = useState(new Map<string, string>());

  const cacheUpdater = useCallback(
    (packageKey: string, response) => {
      if (!packageInfoCache.get(packageKey)) {
        const newCache = new Map(packageInfoCache);
        newCache.set(packageKey, response);
        setPackageInfoCache(newCache);
      }
    },
    [packageInfoCache, setPackageInfoCache]
  );

  const readmeCacheUpdater = useCallback(
    (packageKey: string, readme: string) => {
      if (!packageReadmeCache.get(packageKey)) {
        const newCache = new Map(packageReadmeCache);
        newCache.set(packageKey, readme);
        setPackageReadmeCache(newCache);
      }
    },
    [packageReadmeCache, setPackageReadmeCache]
  );

  return (
    <PackageInstallProvider notifications={platform.getNotifications()}>
      <CacheContext
        packageInfoCache={packageInfoCache}
        packageInfoUpdater={cacheUpdater}
        packageReadmeCache={packageReadmeCache}
        packageReadmeUpdater={readmeCacheUpdater}
      >
        <PackagesTableContainer {...props} />
      </CacheContext>
    </PackageInstallProvider>
  );
};

export type ManagePackagesFlyoutProps = ManagePackagesProps & EuiFlyoutProps;
export const ManagePackagesFlyout: React.FC<ManagePackagesFlyoutProps> = ({
  query,
  navigateToUrl,
  onInstallationStatusChange,
  capabilities,
  ...flyoutProps
}) => {
  return (
    <EuiFlyout {...flyoutProps}>
      <EuiFlyoutBody>
        <ManagePackages
          capabilities={capabilities}
          query={query}
          onInstallationStatusChange={onInstallationStatusChange}
          navigateToUrl={navigateToUrl}
        />
      </EuiFlyoutBody>
    </EuiFlyout>
  );
};
