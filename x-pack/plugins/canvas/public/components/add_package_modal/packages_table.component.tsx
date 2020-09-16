/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import React, { useState, ReactElement, FC } from 'react';
import {
  EuiBasicTable,
  EuiCallOut,
  EuiIcon,
  EuiButtonIcon,
  EuiButton,
  EuiAccordion,
  EuiHorizontalRule,
  EuiFlexGroup,
  EuiFlexItem,
  EuiTitle,
  EuiSpacer,
} from '@elastic/eui';
import {
  InstallationButton,
  useGetPackageInstallStatus,
  useGetPackageInfoByKey,
  ContentCollapse,
  Readme,
} from '../../../../ingest_manager/public/';

import ReactMarkdown from 'react-markdown';
import { elasticLogo } from '../../../canvas_plugin_src/lib/elastic_logo';
import { LEFT_ALIGNMENT, RIGHT_ALIGNMENT } from '@elastic/eui/lib/services';
import { markdownRenderers } from './markdown_renderers';
import { PackageListItem } from '.';

interface Props {
  packages: PackageListItem[];
  iconComponent: (props: { package: PackageListItem }) => ReactElement;
}

const DetailsBody: FC<{ package: PackageListItem }> = ({ package: packageData }) => {
  const pkgkey = `${packageData.name}-${packageData.version}`;
  const { data: packageInfoData, error: packageInfoError, isLoading } = useGetPackageInfoByKey(
    pkgkey
  );

  if (isLoading) {
    return <div>Loading</div>;
  }

  return (
    <div>
      <EuiCallOut
        iconType="iInCircle"
        title="This package contains 1 Canvas Template and 27 other Kibana Assets"
      />

      <Readme
        readmePath={packageInfoData?.response.readme}
        packageName={packageInfoData?.response.name}
        version={packageInfoData?.response.version}
      />
    </div>
  );
};

const InstallButtonWrapper: FC<{ package: PackageListItem }> = ({ package: packageData }) => {
  const getPackageInstallStatus = useGetPackageInstallStatus();

  if (!getPackageInstallStatus(packageData.name)) {
    return null;
  }

  return (
    <InstallationButton
      name={packageData.name}
      version={packageData.version}
      title={packageData.title || ''}
      assets={{
        kibana: {},
      }}
    />
  );
};

export const PackagesTable: FC<Props> = ({ packages, iconComponent: IconComponent }) => {
  const [itemIdToExpandedRowMap, setItemIdToExpandedRowMap] = useState({});

  const toggleDetails = (item: PackageListItem) => {
    const itemIdToExpandedRowMapValues = { ...itemIdToExpandedRowMap };
    if (itemIdToExpandedRowMapValues[item.name]) {
      delete itemIdToExpandedRowMapValues[item.name];
    } else {
      itemIdToExpandedRowMapValues[item.name] = <DetailsBody package={item} />;

      /*
        <div>

          <EuiTitle size="xxxs">
            <h6>This package will install 4 Canvas Templates and 50 other Kibana assets.</h6>
          </EuiTitle>
          <EuiHorizontalRule margin="xs" />
          <EuiSpacer />
          <ReactMarkdown
            renderers={markdownRenderers}
            source={`
## This is some markdown. 
### It should be rendered as such`}
          />
        </div>
      );
      */
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
        return <InstallButtonWrapper package={packageData} />;
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
