/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */
import {
  EuiButton,
  EuiModal,
  EuiOverlayMask,
  EuiModalBody,
  EuiLoadingContent,
  EuiModalHeader,
} from '@elastic/eui';
import React, { FC, Fragment, useCallback, useState, useEffect } from 'react';
import { FormattedMessage } from '@kbn/i18n/react';
import { PackageInfo, InstallStatus } from '../../../../ingest_manager/common/';
import { ConfirmPackageInstall, ConfirmPackageUninstall } from '../../../../ingest_manager/public/';

type InstallationButtonProps = Pick<PackageInfo, 'title'> & {
  disabled?: boolean;
  isUpdate?: boolean;
  onInstallStateChange?: () => void;
  installationStatus: InstallStatus;
  onInstall: () => void;
  onUninstall: () => void;
  canInstall: boolean;
  modalWrapperComponent?: FC<{ packageKey: string }>;
  packageKey: string;
};

export { InstallStatus };

const ModalLoading: FC<{ onClose: () => void }> = ({ onClose }) => {
  return (
    <EuiOverlayMask>
      <EuiModal onClose={onClose}>
        <EuiModalHeader />
        <EuiModalBody className="packageDetail-loadingModal">
          <div>
            <EuiLoadingContent lines={4} />
            <br />
            <EuiLoadingContent lines={5} />
          </div>
        </EuiModalBody>
      </EuiModal>
    </EuiOverlayMask>
  );
};

export const InstallationButtonModal: FC<{
  onClose: () => void;
  isInstalled: boolean;
  assetCount?: number;
  onInstall: () => void;
  onUninstall: () => void;
  packageName: string;
}> = ({ isInstalled, assetCount, onClose, onInstall, onUninstall, packageName }) => {
  useEffect(() => {
    const disableTimeout = setTimeout(() => {
      document.querySelector('body')?.classList.add('disable-modal-animations');
    }, 0);

    return () => {
      clearTimeout(disableTimeout);
      document.querySelector('body')?.classList.remove('disable-modal-animations');
    };
  }, []);

  let modal = <ModalLoading onClose={onClose} />;

  if (assetCount) {
    modal = isInstalled ? (
      <ConfirmPackageUninstall
        numOfAssets={assetCount}
        onCancel={onClose}
        onConfirm={onUninstall}
        packageName={packageName}
      />
    ) : (
      <ConfirmPackageInstall
        packageName={packageName}
        numOfAssets={assetCount}
        onCancel={onClose}
        onConfirm={onInstall}
      />
    );
  }

  return <div>{modal}</div>;
};

const DefaultWrapper: FC = ({ children }) => {
  return <>{children}</>;
};

export const InstallationButton: FC<InstallationButtonProps> = ({
  installationStatus,
  title,
  onInstall,
  onUninstall,
  canInstall,
  modalWrapperComponent,
  packageKey,
}) => {
  const [isModalShowing, setIsModalShowing] = useState(false);
  const toggleModal = useCallback(() => {
    setIsModalShowing(!isModalShowing);
  }, [isModalShowing]);

  const disabled = false;
  const isInstalling = installationStatus === InstallStatus.installing;
  const isRemoving = installationStatus === InstallStatus.uninstalling;
  const isInstalled = installationStatus === InstallStatus.installed;
  const showUninstallButton = isInstalled || isRemoving;

  const installButton = (
    <EuiButton iconType={'importAction'} isLoading={isInstalling} onClick={toggleModal}>
      {isInstalling ? (
        <FormattedMessage
          id="xpack.ingestManager.integrations.installPackage.installingPackageButtonLabel"
          defaultMessage="Installing {title} assets"
          values={{
            title,
          }}
        />
      ) : (
        <FormattedMessage
          id="xpack.ingestManager.integrations.installPackage.installPackageButtonLabel"
          defaultMessage="Install {title} assets"
          values={{
            title,
          }}
        />
      )}
    </EuiButton>
  );

  const uninstallButton = (
    <EuiButton
      iconType={'trash'}
      isLoading={isRemoving}
      onClick={toggleModal}
      color="danger"
      disabled={disabled || isRemoving ? true : false}
    >
      {isRemoving ? (
        <FormattedMessage
          id="xpack.ingestManager.integrations.uninstallPackage.uninstallingPackageButtonLabel"
          defaultMessage="Uninstalling {title}"
          values={{
            title,
          }}
        />
      ) : (
        <FormattedMessage
          id="xpack.ingestManager.integrations.uninstallPackage.uninstallPackageButtonLabel"
          defaultMessage="Uninstall {title}"
          values={{
            title,
          }}
        />
      )}
    </EuiButton>
  );

  const Wrapper = modalWrapperComponent || DefaultWrapper;

  return canInstall ? (
    <Fragment>
      {showUninstallButton || isRemoving ? uninstallButton : installButton}
      {isModalShowing ? (
        <Wrapper packageKey={packageKey}>
          <InstallationButtonModal
            key="install-modal"
            onClose={toggleModal}
            onInstall={onInstall}
            onUninstall={onUninstall}
            isInstalled={isInstalled}
            packageName={title}
          />
        </Wrapper>
      ) : null}
    </Fragment>
  ) : null;
};
