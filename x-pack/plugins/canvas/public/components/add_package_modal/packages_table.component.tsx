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
  EuiText,
  EuiLoadingContent,
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
import { PackageInfoResponse } from './package_info_cache_context';

interface Props {
  packages: PackageListItem[];
  iconComponent: (props: { package: PackageListItem }) => ReactElement;
  /*
    Package Details Component should be a wrapper component. 
    It should accept a packageKey prop and should transfer package info to it's child components
  */
  packageDetailsComponent: React.FC<{
    packageKey: string;
  }>;
}

interface DetailsProps {
  packageInfoResponse?: PackageInfoResponse;
}

const DetailsBody: FC<DetailsProps> = ({ packageInfoResponse }) => {
  if (!packageInfoResponse) {
    return (
      <div>
        <EuiText>
          {/* simulates a long page of text loading */}
          <p>
            <EuiLoadingContent lines={5} />
          </p>
          <p>
            <EuiLoadingContent lines={6} />
          </p>
          <p>
            <EuiLoadingContent lines={4} />
          </p>
        </EuiText>
      </div>
    );
  } else if (packageInfoResponse.data) {
    return (
      <div>
        <EuiCallOut
          iconType="iInCircle"
          title="This package contains 1 Canvas Template and 27 other Kibana Assets"
        />
        <Readme
          readmePath={packageInfoResponse.data.response.readme}
          packageName={packageInfoResponse.data.response.name}
          version={packageInfoResponse.data.response.version}
        />
      </div>
    );
  }

  return <div>Some kind of error</div>;
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

export const PackagesTable: FC<Props> = ({
  packages,
  iconComponent: IconComponent,
  packageDetailsComponent: Wrapper,
}) => {
  const [itemIdToExpandedRowMap, setItemIdToExpandedRowMap] = useState({});

  const toggleDetails = (item: PackageListItem) => {
    const itemIdToExpandedRowMapValues = { ...itemIdToExpandedRowMap };
    if (itemIdToExpandedRowMapValues[item.name]) {
      delete itemIdToExpandedRowMapValues[item.name];
    } else {
      const packageKey = `${item.name}-${item.version}`;
      itemIdToExpandedRowMapValues[item.name] = (
        <Wrapper packageKey={packageKey}>
          <DetailsBody />
        </Wrapper>
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
