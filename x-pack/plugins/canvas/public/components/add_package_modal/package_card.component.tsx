/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */
import React, { FC, ReactElement } from 'react';
import { EuiCard, EuiIcon } from '@elastic/eui';
import { RELEASE_BADGE_LABEL, RELEASE_BADGE_DESCRIPTION } from '../../../../ingest_manager/public';
import { PackageListItem } from './';

export const PackageCard: FC<{
  packageData: PackageListItem;
  onSelect: (packageData: PackageListItem) => void;
  iconComponent: (props: { packageData: PackageListItem }) => ReactElement;
}> = ({ packageData, onSelect, iconComponent: Icon }) => {
  const { description, name, title, version, release, status, icons, ...restProps } = packageData;
  let urlVersion = version;
  // if this is an installed package, link to the version installed
  if ('savedObject' in restProps) {
    urlVersion = restProps.savedObject.attributes.version || version;
  }

  const icon = <Icon packageData={packageData} />;

  return (
    <EuiCard
      title={title || ''}
      description={description}
      icon={icon}
      onClick={() => onSelect(packageData)}
      betaBadgeLabel={release && release !== 'ga' ? RELEASE_BADGE_LABEL[release] : undefined}
      betaBadgeTooltipContent={
        release && release !== 'ga' ? RELEASE_BADGE_DESCRIPTION[release] : undefined
      }
    />
  );
};
