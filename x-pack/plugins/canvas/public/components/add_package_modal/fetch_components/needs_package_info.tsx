/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import React, { FC, ReactElement, useEffect } from 'react';
import { useGetPackageInfoByKey, sendGetFileByPath } from '../../../../../fleet/public/';
import {
  PackageInfoCacheContext,
  PackageInfoResponse,
  PackageInfoUpdateCacheContext,
  PackageReadmeCacheContext,
  PackageReadmeUpdaterContext,
} from '../package_info_cache_context';
import { PackageInfo } from '../';

interface InfoProps {
  packageKey: string;
  onReceivedPackageInfo: (packageKey: string, packageResponse: PackageInfoResponse) => void;
}

const NeedsPackageInfoFetch: FC<InfoProps> = ({ packageKey, onReceivedPackageInfo, children }) => {
  const response = useGetPackageInfoByKey(packageKey);

  if (!response.isLoading) {
    onReceivedPackageInfo(packageKey, response);
  }

  return null;
};

export const NeedsPackageInfo: FC<{ packageKey: string }> = ({ children, packageKey }) => {
  return (
    <PackageInfoUpdateCacheContext.Consumer>
      {(cacheUpdater) => (
        <PackageInfoCacheContext.Consumer>
          {(value) => {
            const cachedResponse = value.get(packageKey);
            let needsPackageInfo = null;

            if (!cachedResponse) {
              needsPackageInfo = (
                <NeedsPackageInfoFetch
                  key="fetch"
                  packageKey={packageKey}
                  onReceivedPackageInfo={cacheUpdater}
                />
              );
            }

            return [
              React.Children.map(children, (child) =>
                React.cloneElement(child as ReactElement, {
                  packageInfo: cachedResponse?.data?.response,
                  error: cachedResponse?.error,
                })
              ),
              needsPackageInfo,
            ];
          }}
        </PackageInfoCacheContext.Consumer>
      )}
    </PackageInfoUpdateCacheContext.Consumer>
  );
};
