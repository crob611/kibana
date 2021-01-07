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
  PackageReadmeCacheUpdater,
  PackageReadmeUpdaterContext,
} from '../package_info_cache_context';
import { PackageInfo } from '../';

const NeedsPackageReadmeFetch: FC<{
  packageKey: string;
  readmePath: string;
  onReceivedPackageReadme: PackageReadmeCacheUpdater;
}> = ({ packageKey, readmePath, children, onReceivedPackageReadme }) => {
  useEffect(() => {
    sendGetFileByPath(readmePath).then((response) => {
      onReceivedPackageReadme(packageKey, response.data || '');
    });
  }, [readmePath, onReceivedPackageReadme, packageKey]);

  return <>{children}</>;
};

export const NeedsPackageReadme: FC<{ packageKey: string; packageInfo?: PackageInfo }> = ({
  children,
  packageKey,
  packageInfo,
}) => {
  if (!packageInfo) {
    return <>{children}</>;
  }

  return (
    <PackageReadmeUpdaterContext.Consumer>
      {(readmeCacheUpdater) => (
        <PackageReadmeCacheContext.Consumer>
          {(readmeCache) => {
            const readme = readmeCache.get(packageKey);

            if (!readme) {
              return (
                <NeedsPackageReadmeFetch
                  packageKey={packageKey}
                  readmePath={packageInfo.readme || ''}
                  onReceivedPackageReadme={readmeCacheUpdater}
                >
                  {children}
                </NeedsPackageReadmeFetch>
              );
            }

            return React.Children.map(children, (child) =>
              React.cloneElement(child as ReactElement, { readme, packageInfo })
            );
          }}
        </PackageReadmeCacheContext.Consumer>
      )}
    </PackageReadmeUpdaterContext.Consumer>
  );
};
