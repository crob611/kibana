/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import React, { FC, useState } from 'react';
import { PackageInfo, PackageListItem } from '../../../../ingest_manager/common/';
import { PackageInstallProvider } from '../../../../ingest_manager/public';
import { PackagesGrid as PackagesGridComponent } from './packages_grid.component';
import { PackageDetails } from './package_details';
import { PackageDetails as PackageDetailsComponent } from './package_details.component';
import { PackagesGrid } from './packages_grid';
import { useKibana } from '../../../../../../src/plugins/kibana_react/public';
import { PackagesTable as PackagesTableComponent } from './packages_table.component';
import { PackagesTable as PackagesTableContainer } from './packages_table';
import { EuiThemeProvider } from '../../../../../legacy/common/eui_styled_components';

export {
  PackagesGridComponent,
  PackageDetailsComponent,
  PackagesGrid,
  PackagesTableContainer,
  PackagesTableComponent,
};

export { PackageListItem, PackageInfo };

export interface PackageSummary {
  package: PackageListItem;
}

export interface PackageDetails {
  package: PackageInfo;
  screenshots: string[];
}

export const PackagesTable: React.FC = () => {
  const kibana = useKibana();
  console.log('packages table');
  return (
    <EuiThemeProvider darkMode={false}>
      <PackageInstallProvider notifications={kibana.notifications}>
        <PackagesTableContainer />
      </PackageInstallProvider>
    </EuiThemeProvider>
  );
};

export const PackageManager: React.FC = () => {
  const kibana = useKibana();
  return (
    <PackageInstallProvider notifications={kibana.notifications}>
      <PackageManagerContent />
    </PackageInstallProvider>
  );
};

export const PackageManagerContent: React.FC<{}> = () => {
  const [selectedPackage, setSelectedPackage] = useState<PackageListItem | null>(null);

  if (selectedPackage) {
    const packageKey = `${selectedPackage.name}-${selectedPackage.version}`;
    return <PackageDetails packageKey={packageKey} />;
  }

  return <PackagesGrid onSelect={setSelectedPackage} />;
};
