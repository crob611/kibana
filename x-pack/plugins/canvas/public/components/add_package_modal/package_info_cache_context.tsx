/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import React, { createContext, FC } from 'react';

import { useGetPackageInfoByKey } from '../../../../ingest_manager/public/';

export type PackageInfoResponse = ReturnType<typeof useGetPackageInfoByKey>;
export type PackageInfoCache = Map<string, PackageInfoResponse>;
export type PackageInfoCacheUpdater = (packageKey: string, response: PackageInfoResponse) => void;
export type PackageReadmeCache = Map<string, string>;
export type PackageReadmeCacheUpdater = (packageKey: string, readme: string) => void;

const defaultUpdater = (key: string, value: any) => undefined;

export const PackageInfoCacheContext = createContext<PackageInfoCache>(new Map());
export const PackageInfoUpdateCacheContext = createContext<PackageInfoCacheUpdater>(defaultUpdater);

export const PackageReadmeCacheContext = createContext<PackageReadmeCache>(new Map());
export const PackageReadmeUpdaterContext = createContext<PackageReadmeCacheUpdater>(defaultUpdater);

interface Props {
  packageInfoCache: PackageInfoCache;
  packageInfoUpdater: PackageInfoCacheUpdater;
  packageReadmeCache: PackageReadmeCache;
  packageReadmeUpdater: PackageReadmeCacheUpdater;
}

export const CacheContext: FC<Props> = ({
  packageInfoCache,
  packageInfoUpdater,
  packageReadmeCache,
  packageReadmeUpdater,
  children,
}) => (
  <PackageInfoCacheContext.Provider value={packageInfoCache}>
    <PackageInfoUpdateCacheContext.Provider value={packageInfoUpdater}>
      <PackageReadmeCacheContext.Provider value={packageReadmeCache}>
        <PackageReadmeUpdaterContext.Provider value={packageReadmeUpdater}>
          {children}
        </PackageReadmeUpdaterContext.Provider>
      </PackageReadmeCacheContext.Provider>
    </PackageInfoUpdateCacheContext.Provider>
  </PackageInfoCacheContext.Provider>
);
