/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import React, { FC, useState, useMemo, useCallback } from 'react';
import { PackageInfo, PackageListItem } from '../../../../ingest_manager/common/';
import { PackageInstallProvider } from '../../../../ingest_manager/public';
import { useKibana } from '../../../../../../src/plugins/kibana_react/public';
import { PackagesTable as PackagesTableComponent } from './packages_table.component';
import { PackagesTable as PackagesTableContainer } from './packages_table';
import { EuiThemeProvider } from '../../../../xpack_legacy/common';
import { usePlatformService } from '../../services';

import {
  PackageInfoCacheContext,
  PackageInfoResponse,
  PackageInfoUpdateCacheContext,
  CacheContext,
} from './package_info_cache_context';

export { PackagesTableContainer, PackagesTableComponent, PackageInfoResponse };

export { PackageListItem, PackageInfo };

export interface PackageSummary {
  package: PackageListItem;
}

export interface PackageDetails {
  package: PackageInfo;
  screenshots: string[];
}

export const PackagesTable: FC = () => {
  const kibana = useKibana();
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
    [packageInfoCache, setPackageInfoCache]
  );

  return (
    <EuiThemeProvider darkMode={false}>
      <PackageInstallProvider notifications={platform.getNotifications()}>
        <CacheContext
          packageInfoCache={packageInfoCache}
          packageInfoUpdater={cacheUpdater}
          packageReadmeCache={packageReadmeCache}
          packageReadmeUpdater={readmeCacheUpdater}
        >
          <PackagesTableContainer />
        </CacheContext>
      </PackageInstallProvider>
    </EuiThemeProvider>
  );
};
