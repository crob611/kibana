/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import React, { FC, useEffect } from 'react';
import { PackagesGrid as PackagesGridComponent } from './packages_grid.component';
import {
  useGetPackageInfoByKey,
  useSetPackageInstallStatus,
  useGetPackageInstallStatus,
} from '../../../../ingest_manager/public/';
import { InstallStatus } from '../../../../ingest_manager/common/';
import { PackageIcon } from './package_icon';
import { PackageListItem } from '.';

import { PackageDetails as PackageDetailsComponent } from './package_details.component';

export const PackageDetails: FC<{ packageKey: string }> = ({ packageKey }) => {
  const { isLoading, data } = useGetPackageInfoByKey(packageKey);
  const setPackageInstallStatus = useSetPackageInstallStatus();
  const getPackageInstallStatus = useGetPackageInstallStatus();

  useEffect(() => {
    if (data) {
      const packageInfoResponse = data.response;

      let installedVersion;
      const { name } = packageInfoResponse;
      if ('savedObject' in packageInfoResponse) {
        installedVersion = packageInfoResponse.savedObject.attributes.version;
      }
      const status: InstallStatus = packageInfoResponse?.status as any;
      if (name) {
        setPackageInstallStatus({ name, status, version: installedVersion || null });
      }
    }
  }, [data, setPackageInstallStatus]);

  if (isLoading) {
    return null;
  }

  if (data && getPackageInstallStatus(data.response.name)) {
    return <PackageDetailsComponent packageDetails={data.response} />;
  }
  return <div>Packages</div>;
};
