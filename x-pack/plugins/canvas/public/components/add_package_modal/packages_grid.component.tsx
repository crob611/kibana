/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import React, { FC, ReactElement } from 'react';
import {
  EuiAccordion,
  EuiFlexGroup,
  EuiFlexItem,
  EuiIcon,
  EuiTitle,
  EuiText,
  EuiFlexGrid,
} from '@elastic/eui';
import { FormattedMessage } from '@kbn/i18n/react';
import { PackageListItem } from '.';
import { PackageCard } from './package_card.component';

interface Props {
  packages: PackageListItem[];
  onSelect: (packageData: PackageListItem) => void;
  iconComponent: (props: { packageData: PackageListItem }) => ReactElement;
}

export const PackagesGrid: FC<Props> = ({ packages, onSelect, iconComponent }) => {
  return (
    <EuiFlexGroup alignItems="flexStart">
      <EuiFlexItem grow={3}>
        <EuiFlexGrid gutterSize="l" columns={3}>
          {packages.length ? (
            packages.map((packageData) => (
              <EuiFlexItem key={`${packageData.name}-${packageData.version}`}>
                <PackageCard
                  packageData={packageData}
                  iconComponent={iconComponent}
                  onSelect={onSelect}
                />
              </EuiFlexItem>
            ))
          ) : (
            <EuiFlexItem>
              <EuiText>
                <p>
                  <FormattedMessage
                    id="xpack.ingestManager.epmList.noPackagesFoundPlaceholder"
                    defaultMessage="No packages found"
                  />
                </p>
              </EuiText>
            </EuiFlexItem>
          )}
        </EuiFlexGrid>
      </EuiFlexItem>
    </EuiFlexGroup>
  );
};
