/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import React, { useState } from 'react';
import {
  EuiBasicTable,
  EuiIcon,
  EuiButtonIcon,
  EuiButton,
  EuiAccordion,
  EuiFlexGroup,
  EuiFlexItem,
  EuiTitle,
} from '@elastic/eui';
import ReactMarkdown from 'react-markdown';
import { elasticLogo } from '../../../canvas_plugin_src/lib/elastic_logo';
import { LEFT_ALIGNMENT, RIGHT_ALIGNMENT } from '@elastic/eui/lib/services';
import { markdownRenderers } from './markdown_renderers';

export const PackagesTable = (props) => {
  const [itemIdToExpandedRowMap, setItemIdToExpandedRowMap] = useState({});

  const toggleDetails = (item) => {
    const itemIdToExpandedRowMapValues = { ...itemIdToExpandedRowMap };
    if (itemIdToExpandedRowMapValues[item.id]) {
      delete itemIdToExpandedRowMapValues[item.id];
    } else {
      itemIdToExpandedRowMapValues[item.id] = (
        <div>
          <EuiTitle size="xxxs">
            <h6>This package will install 4 Canvas Templates and 50 other Kibana assets.</h6>
          </EuiTitle>
          <ReactMarkdown
            renderers={markdownRenderers}
            source={`
## This is some markdown. 
### It should be rendered as such`}
          />
        </div>
      );
    }
    setItemIdToExpandedRowMap(itemIdToExpandedRowMapValues);
  };

  const packages = [
    { id: 1, packageName: 'Package 1' },
    { id: 2, packageName: 'Package 2' },
  ];

  const columns = [
    {
      align: LEFT_ALIGNMENT,
      width: '40px',
      isExpander: true,
      render: (item) => (
        <EuiButtonIcon
          onClick={() => toggleDetails(item)}
          aria-label={itemIdToExpandedRowMap[item.id] ? 'Collapse' : 'Expand'}
          iconType={itemIdToExpandedRowMap[item.id] ? 'arrowUp' : 'arrowDown'}
        />
      ),
    },
    {
      field: 'packageName',
      name: 'Package',
      sortable: true,
      truncateText: true,
      render: (name: string) => (
        <span>
          <EuiIcon type={elasticLogo} size="m" /> {name}
        </span>
      ),
    },
    {
      align: RIGHT_ALIGNMENT,
      header: false,
      render: () => <EuiButton iconType={'importAction'}>Install</EuiButton>,
    },
  ];

  return (
    <EuiBasicTable
      columns={columns}
      items={packages}
      itemId="id"
      isExpandable={true}
      itemIdToExpandedRowMap={itemIdToExpandedRowMap}
    />
  );
};

const PackageRow = () => {
  return (
    <div>
      <EuiFlexGroup gutterSize="s" alignItems="center" responsive={false}>
        <EuiFlexItem grow={false}>
          <EuiIcon type={elasticLogo} size="m" /> {name}
        </EuiFlexItem>

        <EuiFlexItem grow={2}>
          <EuiTitle size="s" className="euiAccordionForm__title">
            <h3>Webhook</h3>
          </EuiTitle>
        </EuiFlexItem>

        <EuiFlexItem grow={false}>
          <EuiButton iconType={'importAction'} size="s">
            Install
          </EuiButton>
        </EuiFlexItem>
      </EuiFlexGroup>
    </div>
  );
};
