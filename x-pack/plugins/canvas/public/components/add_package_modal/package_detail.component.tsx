/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import React, { FC, useState, useLayoutEffect, useRef } from 'react';
import {
  EuiCallOut,
  EuiLoadingContent,
  EuiText,
  EuiFlexGroup,
  EuiFlexItem,
  EuiButton,
  EuiIcon,
} from '@elastic/eui';
import { PackageInfo } from '.';
import { Markdown } from '../../../../../../src/plugins/kibana_react/public';
import './add_package.scss';

interface Props {
  packageInfo?: Pick<PackageInfo, 'assets'>;
  error?: string;
  readme?: string;
}

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

const OverflowHeight = 300;

const PackageDetailContent: FC<{ assets: PackageInfo['assets']; readme: string }> = ({
  assets,
  readme,
}) => {
  const [isContentOverflowing, setContentOverflowing] = useState(false);
  const contentElement = useRef<HTMLDivElement>(null);

  const assetType = 'canvas-workpad-template';
  const totalAssetCount = Object.values(assets.kibana).reduce(
    (count, assetArray) => count + assetArray.length,
    0
  );
  let typeAssetCount = 0;
  if (assets[assetType] !== undefined) {
    typeAssetCount = assets[assetType].length;
  }

  useLayoutEffect(() => {
    const element = contentElement.current;

    if (!isContentOverflowing && element && element.offsetHeight >= OverflowHeight) {
      setContentOverflowing(true);
    }
  }, [isContentOverflowing, setContentOverflowing]);

  return (
    <div className={`packageDetail ${isContentOverflowing ? 'packageDetail--overflowing' : ''}`}>
      <EuiCallOut
        iconType="iInCircle"
        title={`This package contains ${typeAssetCount} Canvas Template and ${
          totalAssetCount - typeAssetCount
        } other Kibana Assets`}
      />
      <div className="packageDetail-details" ref={contentElement}>
        <EuiFlexGroup>
          <EuiFlexItem>
            <Markdown className="canvasMarkdown" markdown={readme} openLinksInNewTab={true} />
          </EuiFlexItem>
        </EuiFlexGroup>
      </div>

      <div className="bottomFade" />

      <div className="readMoreButton">
        <EuiText textAlign="center">
          <EuiButton color="primary" href={'something'}>
            Learn More <EuiIcon type="popout" />
          </EuiButton>
        </EuiText>
      </div>
    </div>
  );
};

export const PackageDetail: FC<Props> = ({ packageInfo, error, readme }) => {
  if (error) {
    return <PackageDetailError error={error} />;
  }

  if (packageInfo && readme) {
    return <PackageDetailContent assets={packageInfo.assets} readme={readme} />;
  }

  return <PackageDetailLoading />;
};
