/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import React, { FC, useMemo } from 'react';
import {
  EuiCallOut,
  EuiLoadingContent,
  EuiText,
  EuiFlexGroup,
  EuiFlexItem,
  EuiButton,
  EuiIcon,
} from '@elastic/eui';
import { PackageInfo, KibanaAssetType, AssetTitleMap, PackagesTableProps } from '.';
import { Markdown } from '../../../../../../src/plugins/kibana_react/public';
import './add_package.scss';
import { ComponentStrings } from '../../../i18n/components';

type Props = {
  packageInfo?: PackageInfo;
  error?: string;
  readme?: string;
  assetType?: KibanaAssetType;
} & Pick<PackagesTableProps, 'navigateToUrl' | 'getPackageHref'>;

const PackageDetailError: FC<{ error: string }> = ({ error }) => (
  <div>
    <EuiCallOut
      title="There was an error loading this package's details"
      color="danger"
      iconType="alert"
    >
      {error}
    </EuiCallOut>
  </div>
);

const PackageDetailLoading: FC = () => (
  <div style={{ width: '100%' }}>
    <EuiText>
      <p>
        <EuiLoadingContent />
      </p>
      <p>
        <EuiLoadingContent lines={5} />
      </p>
    </EuiText>
  </div>
);

type DetailProps = {
  assets: PackageInfo['assets'];
  assetType?: KibanaAssetType;
  readme: string;
  navigateToUrl: () => void;
} & Pick<PackagesTableProps, 'navigateToUrl'>;

const PackageDetailContent: FC<DetailProps> = ({ assets, readme, assetType, navigateToUrl }) => {
  const kibanaAssets = assets.kibana || [];
  const totalAssetCount = Object.values(kibanaAssets).reduce(
    (count, assetArray) => count + assetArray.length,
    0
  );
  let typeAssetCount = 0;
  if (assets.kibana && assetType && assets.kibana[assetType] !== undefined) {
    typeAssetCount = assets.kibana[assetType].length;
  }

  return (
    <div className={`packageDetail`}>
      {assetType ? (
        <EuiCallOut
          iconType="iInCircle"
          title={ComponentStrings.AddPackageFlyout.getAssetCountTitle(
            AssetTitleMap[assetType],
            typeAssetCount,
            totalAssetCount - typeAssetCount
          )}
        />
      ) : null}
      <div className="packageDetail-details">
        <EuiFlexGroup>
          <EuiFlexItem>
            <Markdown className="canvasMarkdown" markdown={readme} openLinksInNewTab={true} />
          </EuiFlexItem>
        </EuiFlexGroup>
      </div>

      <div className="bottomFade" />

      <div className="readMoreButton">
        <EuiText textAlign="center">
          <EuiButton color="primary" onClick={navigateToUrl}>
            {ComponentStrings.AddPackageFlyout.getLearnMoreButtonLabel()} <EuiIcon type="popout" />
          </EuiButton>
        </EuiText>
      </div>
    </div>
  );
};

export const PackageDetail: FC<Props> = ({
  packageInfo,
  error,
  readme,
  assetType,
  navigateToUrl,
  getPackageHref,
}) => {
  const packageHref = useMemo(
    () =>
      packageInfo !== undefined
        ? getPackageHref(`${packageInfo.name}-${packageInfo.version}`)
        : '#',
    [packageInfo, getPackageHref]
  );

  const onPackageLinkClick = useMemo(() => () => navigateToUrl(packageHref), [
    navigateToUrl,
    packageHref,
  ]);

  if (error) {
    return <PackageDetailError error={error} />;
  }

  if (packageInfo && readme) {
    return (
      <PackageDetailContent
        assets={packageInfo.assets}
        readme={readme}
        assetType={assetType}
        navigateToUrl={onPackageLinkClick}
      />
    );
  }

  return <PackageDetailLoading />;
};
