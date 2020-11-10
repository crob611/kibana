/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import React, { FC, ReactElement, useEffect } from 'react';
import { useGetPackageInfoByKey, sendGetFileByPath } from '../../../../ingest_manager/public/';
import {
  PackageInfoCacheContext,
  PackageInfoResponse,
  PackageInfoUpdateCacheContext,
  PackageReadmeCacheContext,
  PackageReadmeUpdaterContext,
} from './package_info_cache_context';
import { PackageInfo } from '.';

interface InfoProps {
  packageKey: string;
  onReceivedPackageInfo: (packageKey: string, packageResponse: PackageInfoResponse) => void;
}

interface NeedsPackageInfoFetchedProps {
  packageInfo?: PackageInfo;
  error?: PackageInfoResponse['error'];
}

const NeedsPackageInfoFetch: FC<InfoProps> = ({ packageKey, onReceivedPackageInfo, children }) => {
  const response = useGetPackageInfoByKey(packageKey);

  if (!response.isLoading) {
    onReceivedPackageInfo(packageKey, response);
  }

  return <>{children}</>;
};

export const NeedsPackageInfo: FC<Pick<InfoProps, 'packageKey'>> = ({ children, packageKey }) => {
  return (
    <PackageInfoUpdateCacheContext.Consumer>
      {(cacheUpdater) => (
        <PackageInfoCacheContext.Consumer>
          {(value) => {
            const cachedResponse = value.get(packageKey);
            let fetchComponent = null;

            if (!cachedResponse) {
              fetchComponent = (
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
              fetchComponent,
            ];
          }}
        </PackageInfoCacheContext.Consumer>
      )}
    </PackageInfoUpdateCacheContext.Consumer>
  );
};

interface Readme {
  packageKey: string;
  readmePath: string;
  onReceivedPackageReadme: (packageKey: string, readme: string) => void;
}

const NeedsPackageReadmeFetch: FC<Readme> = ({
  packageKey,
  readmePath,
  children,
  onReceivedPackageReadme,
}) => {
  useEffect(() => {
    sendGetFileByPath(readmePath).then((response) => {
      onReceivedPackageReadme(packageKey, response.data || '');
    });
  }, [readmePath, onReceivedPackageReadme, packageKey]);

  return <>{children}</>;
};

export const NeedsPackageReadme: FC<{ packageKey: string; readmePath: string }> = ({
  children,
  packageKey,
  readmePath,
}) => {
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
                  readmePath={readmePath}
                  onReceivedPackageReadme={readmeCacheUpdater}
                >
                  {children}
                </NeedsPackageReadmeFetch>
              );
            }

            return React.Children.map(children, (child) =>
              React.cloneElement(child as ReactElement, { readme })
            );
          }}
        </PackageReadmeCacheContext.Consumer>
      )}
    </PackageReadmeUpdaterContext.Consumer>
  );
};

const WaitForPackageInfo: FC<
  {
    packageKey: string;
  } & NeedsPackageInfoFetchedProps
> = ({ children, packageKey, packageInfo, error }) => {
  const childrenWithPackageInfo = React.Children.map(children, (child) =>
    React.cloneElement(child as ReactElement, { packageInfo, error })
  );

  if (!packageInfo) {
    return <>{childrenWithPackageInfo}</>;
  }

  return (
    <NeedsPackageReadme packageKey={packageKey} readmePath={packageInfo.readme || ''}>
      {childrenWithPackageInfo}
    </NeedsPackageReadme>
  );
};

export const NeedsPackageInfoAndReadme: FC<{ packageKey: string }> = ({ packageKey, children }) => {
  return (
    <NeedsPackageInfo packageKey={packageKey}>
      <WaitForPackageInfo packageKey={packageKey}>{children}</WaitForPackageInfo>
    </NeedsPackageInfo>
  );
};

const AssetCount: FC<{ packageInfo?: PackageInfo }> = ({ children, packageInfo }) => {
  const assetCount = packageInfo
    ? Object.entries(packageInfo.assets).reduce(
        (acc, [serviceName, serviceNameValue]) =>
          acc +
          Object.entries(serviceNameValue || []).reduce(
            (acc2, [assetName, assetNameValue]) => acc2 + assetNameValue.length,
            0
          ),
        0
      )
    : undefined;

  return (
    <>
      {React.Children.map(children, (child) =>
        React.cloneElement(child as ReactElement, { assetCount })
      )}
    </>
  );
};

export const NeedsAssetCount: FC<{ packageKey: string }> = ({ packageKey, children }) => {
  return (
    <NeedsPackageInfo packageKey={packageKey} key="needs-package-info">
      <AssetCount key="asset-count">{children}</AssetCount>
    </NeedsPackageInfo>
  );
};
