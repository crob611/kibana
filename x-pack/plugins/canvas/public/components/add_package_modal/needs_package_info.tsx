/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import React, { FC, ReactElement } from 'react';
import { useGetPackageInfoByKey } from '../../../../ingest_manager/public/';
import {
  PackageInfoCacheContext,
  PackageInfoResponse,
  PackageInfoUpdateCacheContext,
  PackageReadmeCacheContext,
  PackageReadmeUpdaterContext,
} from './package_info_cache_context';

interface Props {
  packageKey: string;
  onReceivedPackageInfo: (packageKey: string, packageResponse: PackageInfoResponse) => void;
}

const NeedsPackageInfoFetch: FC<Props> = ({ packageKey, onReceivedPackageInfo, children }) => {
  const response = useGetPackageInfoByKey(packageKey);

  if (!response.isLoading) {
    onReceivedPackageInfo(packageKey, response);
  }

  return children || null;
};

export const NeedsPackageInfo: FC<Props> = ({ children, packageKey }) => {
  return (
    <PackageInfoUpdateCacheContext.Consumer>
      {(cacheUpdater) => (
        <PackageInfoCacheContext.Consumer>
          {(value) => {
            const cachedResponse = value.get(packageKey);

            if (!cachedResponse) {
              return (
                <NeedsPackageInfoFetch
                  packageKey={packageKey}
                  onReceivedPackageInfo={cacheUpdater}
                />
              );
            }

            return React.Children.map(children, (child) =>
              React.cloneElement(child as ReactElement, { packageInfoResponse: cachedResponse })
            );
          }}
        </PackageInfoCacheContext.Consumer>
      )}
    </PackageInfoUpdateCacheContext.Consumer>
  );
};

export const NeedsPackageReadme: FC<Props> = ({ children }) => {
  return (
    <PackageReadmeUpdaterContext.Consumer>
      {(readmeCacheUpdater) => (
        <PackageReadmeCacheContext.Consumer>
          {(readmeCache) => {
            return <div>Readme</div>;
          }}
        </PackageReadmeCacheContext.Consumer>
      )}
    </PackageReadmeUpdaterContext.Consumer>
  );
};
