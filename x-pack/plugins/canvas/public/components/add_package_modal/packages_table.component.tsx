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
import { PackageDetail } from './package_detail.component';

import ReactMarkdown from 'react-markdown';
import { elasticLogo } from '../../../canvas_plugin_src/lib/elastic_logo';
import { LEFT_ALIGNMENT, RIGHT_ALIGNMENT } from '@elastic/eui/lib/services';
import { markdownRenderers } from './markdown_renderers';
import { PackageListItem } from '.';
import { PackageInfoResponse } from './package_info_cache_context';
import { Markdown } from '../../../../../../src/plugins/kibana_react/public';

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
          <PackageDetail />
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

  // Markdown is used by the package_detail.component and we need to measure the resulting
  // markdown component. This Markdown component is wrapped in a Suspense, so likely the first time it
  // is used, it will initially have a height of ZERO which throws everything off.
  //
  // To get around this, we are going to create this here to force the lazy load of the markdown component
  // so that hopefully it's loaded when we actually need it further down the tree.
  const genericMarkdown = <Markdown markdown="" />;

  return [
    <EuiBasicTable
      columns={columns}
      items={packages}
      itemId="name"
      isExpandable={true}
      itemIdToExpandedRowMap={itemIdToExpandedRowMap}
    />,
    genericMarkdown,
  ];
};
