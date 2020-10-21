import React, { FC } from 'react';
import {
  EuiCallOut,
  EuiLoadingContent,
  EuiText,
  EuiFlexGroup,
  EuiFlexItem,
  EuiButton,
  EuiIcon,
} from '@elastic/eui';
import { PackageInfoResponse, PackageInfo } from '.';
import { Markdown } from '../../../../../../src/plugins/kibana_react/public';
import './add_package.scss';

interface Props {
  packageInfo?: Pick<PackageInfo, 'assets'>;
  //assets?: PackageInfo['assets'];
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

const PackageDetailContent: FC<{ assets: PackageInfo['assets']; readme: string }> = ({
  assets,
  readme,
}) => {
  const assetType = 'canvas-workpad-template';
  const totalAssetCount = Object.values(assets.kibana).reduce(
    (count, assetArray) => count + assetArray.length,
    0
  );
  let typeAssetCount = 0;
  if (assets[assetType] !== undefined) {
    typeAssetCount = assets[assetType].length;
  }

  return (
    <div className="packageDetail" style={{ position: 'relative' }}>
      <EuiCallOut
        iconType="iInCircle"
        title={`This package contains ${typeAssetCount} Canvas Template and ${
          totalAssetCount - typeAssetCount
        } other Kibana Assets`}
      />
      <div style={{ height: '300px', overflow: 'hidden' }}>
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
