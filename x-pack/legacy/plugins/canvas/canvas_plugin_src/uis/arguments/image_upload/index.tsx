/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import React from 'react';
import PropTypes from 'prop-types';
import { EuiSpacer, EuiFormRow, EuiButtonGroup } from '@elastic/eui';
import { get } from 'lodash';
import { AssetPicker } from '../../../../public/components/asset_picker';
// @ts-ignore untyped local
import { elasticOutline } from '../../../lib/elastic_outline';
// @ts-ignore untyped local
import { resolveFromArgs } from '../../../../common/lib/resolve_dataurl';
import { isValidHttpUrl } from '../../../../common/lib/httpurl';
import { encode } from '../../../../common/lib/dataurl';
import { templateFromReactComponent } from '../../../../public/lib/template_from_react_component';
import { VALID_IMAGE_TYPES } from '../../../../common/lib/constants';
import { ArgumentStrings } from '../../../../i18n';
import { AssetType, ExpressionAstExpression } from '../../../../types';
import { FileForm, LinkForm } from './forms';

const { ImageUpload: strings } = ArgumentStrings;

interface ImageUploadProps {
  onAssetAdd: (type: string, content: string) => string;
  onValueChange: (value: ExpressionAstExpression) => void;
  typeInstance: any;
  resolvedArgValue: string;
  assets: Record<string, AssetType>;
}

interface ImageUploadState {
  loading: boolean;
  url: string | null;
  urlType: string;
}

class ImageUpload extends React.Component<ImageUploadProps, ImageUploadState> {
  static propTypes = {
    onAssetAdd: PropTypes.func.isRequired,
    onValueChange: PropTypes.func.isRequired,
    typeInstance: PropTypes.object.isRequired,
    resolvedArgValue: PropTypes.string,
    assets: PropTypes.object.isRequired,
  };

  private inputRefs = {
    srcUrlText: undefined as any,
  };
  private _isMounted = false;

  constructor(props: ImageUploadProps) {
    super(props);

    const url = props.resolvedArgValue || null;

    let urlType = Object.keys(props.assets).length ? 'asset' : 'file';
    // if not a valid base64 string, will show as missing asset icon
    if (isValidHttpUrl(url || '')) {
      urlType = 'link';
    }

    this.inputRefs = { srcUrlText: null };

    this.state = {
      loading: false,
      url, // what to show in preview / paste url text input
      urlType, // what panel to show, fileupload or paste url
    };
  }

  componentDidMount() {
    // keep track of whether or not the component is mounted, to prevent rogue setState calls
    this._isMounted = true;
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  updateAST = (assetId: string) => {
    this.props.onValueChange({
      type: 'expression',
      chain: [
        {
          type: 'function',
          function: 'asset',
          arguments: {
            _: [assetId],
          },
        },
      ],
    });
  };

  handleUpload = (files: FileList) => {
    const { onAssetAdd } = this.props;
    const file = files.item(0);
    if (file) {
      const [type, subtype] = get(file, 'type', '').split('/');
      if (type === 'image' && VALID_IMAGE_TYPES.indexOf(subtype) >= 0) {
        this.setState({ loading: true }); // start loading indicator

        encode(file)
          .then(dataurl => onAssetAdd('dataurl', dataurl))
          .then(assetId => {
            this.updateAST(assetId);

            // this component can go away when onValueChange is called, check for _isMounted'
            if (this._isMounted) {
              this.setState({ loading: false });
            }
          });
      }
    }
  };

  changeUrlType = (optionId: string) => {
    this.setState({ urlType: optionId });
  };

  setSrcUrl = () => {
    const { value: srcUrl } = this.inputRefs.srcUrlText;
    this.setState({ url: srcUrl });

    const { onValueChange } = this.props;
    onValueChange(srcUrl);
  };

  render() {
    const { loading, url, urlType } = this.state;
    const assets = Object.values(this.props.assets);

    let selectedAsset = {} as AssetType;

    const urlTypeOptions = [
      { id: 'file', label: strings.getFileUrlType() },
      { id: 'link', label: strings.getLinkUrlType() },
    ];
    if (assets.length) {
      urlTypeOptions.unshift({
        id: 'asset',
        label: strings.getAssetUrlType(),
      });
      selectedAsset = assets.find(({ value }) => value === url) || ({} as AssetType);
    }

    const selectUrlType = (
      <EuiFormRow display="rowCompressed">
        <EuiButtonGroup
          buttonSize="compressed"
          options={urlTypeOptions}
          idSelected={urlType}
          onChange={this.changeUrlType}
          isFullWidth
          className="canvasSidebar__buttonGroup"
        />
      </EuiFormRow>
    );

    const forms: Record<string, JSX.Element> = {
      file: <FileForm loading={loading} onChange={this.handleUpload} />,
      link: (
        <LinkForm
          url={url}
          inputRef={ref => (this.inputRefs.srcUrlText = ref)}
          onSubmit={this.setSrcUrl}
        />
      ),
      asset: (
        <AssetPicker
          assets={assets}
          selected={selectedAsset.id}
          onChange={({ id }) => this.updateAST(id)}
        />
      ),
    };

    const form = forms[urlType];

    return (
      <div className="canvasSidebar__panel-noMinWidth" style={{ position: 'relative' }}>
        {selectUrlType}
        <EuiSpacer size="s" />
        {form}
        <EuiSpacer size="s" />
      </div>
    );
  }
}

export const imageUpload = () => ({
  name: 'imageUpload',
  displayName: strings.getDisplayName(),
  help: strings.getHelp(),
  resolveArgValue: true,
  template: templateFromReactComponent(ImageUpload),
  // TODO: I don't think this resolve function is ever used.
  resolve({ args }: { args: any }) {
    return { dataurl: resolveFromArgs(args, elasticOutline) };
  },
});
