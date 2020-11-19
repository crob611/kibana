/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import React, { FC, Children, cloneElement, ReactElement } from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import {
  InstallationButton,
  InstallStatus,
  InstallationButtonModal,
} from '../installation_button.component';

const ModalWrapper: FC = ({ children }) => (
  <>{Children.map(children, (child) => cloneElement(child as ReactElement, { assetCount: 20 }))}</>
);
const baseButtonProps = {
  title: 'Package',
  installationStatus: InstallStatus.notInstalled,
  canInstall: true,
  onInstall: action('onInstall'),
  onUninstall: action('onUninstall'),
  packageKey: 'package-key',
};

storiesOf('components/PackagesFlyout/installation_button', module)
  .add('not installed', () => (
    <InstallationButton {...baseButtonProps} installationStatus={InstallStatus.notInstalled} />
  ))
  .add('not installed with asset count', () => (
    <InstallationButton
      {...baseButtonProps}
      installationStatus={InstallStatus.notInstalled}
      modalWrapperComponent={ModalWrapper}
    />
  ))
  .add('not installed without write permission', () => (
    <InstallationButton
      {...baseButtonProps}
      installationStatus={InstallStatus.notInstalled}
      canInstall={false}
      modalWrapperComponent={ModalWrapper}
    />
  ))
  .add('installed', () => (
    <InstallationButton {...baseButtonProps} installationStatus={InstallStatus.installed} />
  ))
  .add('installing', () => (
    <InstallationButton {...baseButtonProps} installationStatus={InstallStatus.installing} />
  ))
  .add('uninstalling', () => (
    <InstallationButton {...baseButtonProps} installationStatus={InstallStatus.uninstalling} />
  ));

const baseModalProps = {
  onClose: action('onClose'),
  onInstall: action('onInstall'),
  onUninstall: action('onUninstall'),
  packageName: 'My Package',
};

storiesOf('components/PackagesFlyout/installation_modal', module)
  .add('loading', () => <InstallationButtonModal {...baseModalProps} isInstalled={false} />)
  .add('install', () => (
    <InstallationButtonModal {...baseModalProps} isInstalled={false} assetCount={20} />
  ))
  .add('uninstall', () => (
    <InstallationButtonModal {...baseModalProps} isInstalled={true} assetCount={20} />
  ));
