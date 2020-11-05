/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import React, { useState, ReactElement, FC, useMemo } from 'react';
import { EuiBasicTable, EuiButtonIcon } from '@elastic/eui';
import { LEFT_ALIGNMENT, RIGHT_ALIGNMENT } from '@elastic/eui/lib/services';
import { PackageDetail } from './package_detail.component';
import { PackageListItem } from '.';
import { PackageInfoResponse } from './package_info_cache_context';
import { InstallationButton } from './installation_button.component';

interface Props {
  packages: PackageListItem[];
  iconComponent: (props: { package: PackageListItem }) => ReactElement;
  /*
    Package Details Component should be a wrapper component. 
    It should accept a packageKey prop and should transfer package info to it's child components
  */
  getReadmeComponent: React.FC<{
    packageKey: string;
  }>;
  getAssetCountComponent: React.FC<{
    packageKey: string;
  }>;
}

interface DetailsProps {
  packageInfoResponse?: PackageInfoResponse;
}

const InstallButtonWrapper: FC<{
  package: PackageListItem;
  getAssetCountComponent: React.FC<{ packageKey: string }>;
}> = ({ package: packageData, getAssetCountComponent }) => {
  const ModalWrapper: React.FC = ({ children }) => {
    const GetAssetCount = getAssetCountComponent;

    return (
      <GetAssetCount packageKey={`${packageData.name}-${packageData.version}`}>
        {children}
      </GetAssetCount>
    );
  };

  return (
    <InstallationButton
      canInstall={true}
      modalWrapperComponent={ModalWrapper}
      title={packageData.title || ''}
      installationStatus={packageData.status}
    />
  );
};

export const PackagesTable: FC<Props> = ({
  packages,
  iconComponent: IconComponent,
  getReadmeComponent: ReadmeWrapper,
  getAssetCountComponent,
}) => {
  const [itemIdToExpandedRowMap, setItemIdToExpandedRowMap] = useState({});

  const toggleDetails = (item: PackageListItem) => {
    const itemIdToExpandedRowMapValues = { ...itemIdToExpandedRowMap };
    if (itemIdToExpandedRowMapValues[item.name]) {
      delete itemIdToExpandedRowMapValues[item.name];
    } else {
      const packageKey = `${item.name}-${item.version}`;
      itemIdToExpandedRowMapValues[item.name] = (
        <ReadmeWrapper packageKey={packageKey}>
          <PackageDetail />
        </ReadmeWrapper>
      );
    }
    setItemIdToExpandedRowMap(itemIdToExpandedRowMapValues);
  };

  const columns = [
    {
      align: LEFT_ALIGNMENT,
      width: '40px',
      isExpander: true,
      render: (item: PackageListItem) => {
        return (
          <EuiButtonIcon
            onClick={() => toggleDetails(item)}
            aria-label={itemIdToExpandedRowMap[item.name] ? 'Collapse' : 'Expand'}
            iconType={itemIdToExpandedRowMap[item.name] ? 'arrowUp' : 'arrowDown'}
          />
        );
      },
    },
    {
      field: 'title',
      name: 'Package',
      sortable: true,
      truncateText: true,
      render: (title: string, packageData: PackageListItem) => {
        return (
          <span>
            <IconComponent package={packageData} /> {title}
          </span>
        );
      },
    },
    {
      align: RIGHT_ALIGNMENT,
      header: false,
      render: (packageData: PackageListItem) => {
        return (
          <InstallButtonWrapper
            package={packageData}
            getAssetCountComponent={getAssetCountComponent}
          />
        );
      },
    },
  ];

  return (
    <EuiBasicTable
      columns={columns}
      items={packages}
      itemId="name"
      isExpandable={true}
      itemIdToExpandedRowMap={itemIdToExpandedRowMap}
    />
  );
};
