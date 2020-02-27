/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */
import React from 'react';
import PropTypes from 'prop-types';
// @ts-ignore Untyped Library
import { EuiFilePicker } from '@elastic/eui';
import { Loading } from '../../../../../public/components/loading/loading';
import { ArgumentStrings } from '../../../../../i18n';

const { ImageUpload: strings } = ArgumentStrings;

interface FileFormProps {
  loading: boolean;
  onChange: (files: FileList) => void;
}

export const FileForm: React.FunctionComponent<FileFormProps> = ({ loading, onChange }) =>
  loading ? (
    <Loading animated text={strings.getImageUploading()} />
  ) : (
    <EuiFilePicker
      initialPromptText={strings.getFileUploadPrompt()}
      onChange={onChange}
      compressed
      display="default"
      className="canvasImageUpload"
      accept="image/*"
    />
  );

FileForm.propTypes = {
  loading: PropTypes.bool,
  onChange: PropTypes.func,
};
