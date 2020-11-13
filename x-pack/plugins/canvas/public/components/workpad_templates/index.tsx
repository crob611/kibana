/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import React, {
  useContext,
  useState,
  useEffect,
  useRef,
  FunctionComponent,
  useCallback,
} from 'react';
import { createPortal } from 'react-dom';
import { EuiLoadingSpinner, EuiFlyout, EuiFlyoutBody } from '@elastic/eui';
import { RouterContext } from '../router';
import { ComponentStrings } from '../../../i18n/components';
// @ts-expect-error
import * as workpadService from '../../lib/workpad_service';
import { WorkpadTemplates as Component } from './workpad_templates';
import { CanvasTemplate } from '../../../types';
import { list } from '../../lib/template_service';
import { applyTemplateStrings } from '../../../i18n/templates/apply_strings';
import { useNotifyService, usePlatformService } from '../../services';

import { PackagesTable } from '../add_package_modal';
interface WorkpadTemplatesProps {
  onClose: () => void;
}

const Creating: FunctionComponent<{ name: string }> = ({ name }) => (
  <div>
    <EuiLoadingSpinner size="l" />{' '}
    {ComponentStrings.WorkpadTemplates.getCreatingTemplateLabel(name)}
  </div>
);

const PortalThing = ({ onClose, onPackageInstalled }) => {
  const element = useRef<null | HTMLDivElement>(null);
  const platformService = usePlatformService();

  if (!element.current) {
    const container = document.createElement('div');
    const body = document.querySelector('body');
    body.append(container);

    element.current = container;
  }

  if (element.current) {
    return createPortal(
      <EuiFlyout onClose={onClose}>
        <EuiFlyoutBody>
          <PackagesTable
            onPackageInstalled={onPackageInstalled}
            navigateToUrl={platformService.navigateToUrl}
          />
        </EuiFlyoutBody>
      </EuiFlyout>,
      element.current
    );
  }

  return null;
};

export const WorkpadTemplates: FunctionComponent<WorkpadTemplatesProps> = ({ onClose }) => {
  const router = useContext(RouterContext);
  const [templates, setTemplates] = useState<CanvasTemplate[] | undefined>(undefined);
  const [creatingFromTemplateName, setCreatingFromTemplateName] = useState<string | undefined>(
    undefined
  );
  const [isPackagesVisible, setIsPackagesVisible] = useState<boolean>(false);
  const showPackages = useCallback(() => setIsPackagesVisible(true), [setIsPackagesVisible]);
  const hidePackages = useCallback(() => setIsPackagesVisible(false), [setIsPackagesVisible]);

  const fetchTemplates = useCallback(async () => {
    const fetchedTemplates = await list();
    setTemplates(applyTemplateStrings(fetchedTemplates));
  }, [setTemplates]);

  const { error } = useNotifyService();

  useEffect(() => {
    if (!templates) {
      fetchTemplates();
    }
  }, [templates, fetchTemplates]);

  let templateProp: Record<string, CanvasTemplate> = {};

  if (templates) {
    templateProp = templates.reduce<Record<string, any>>((reduction, template) => {
      reduction[template.name] = template;
      return reduction;
    }, {});
  }

  const createFromTemplate = async (template: CanvasTemplate) => {
    setCreatingFromTemplateName(template.name);
    try {
      const result = await workpadService.createFromTemplate(template.id);
      if (router) {
        router.navigateTo('loadWorkpad', { id: result.data.id, page: 1 });
      }
    } catch (e) {
      setCreatingFromTemplateName(undefined);
      error(e, {
        title: `Couldn't create workpad from template`,
      });
    }
  };

  if (creatingFromTemplateName) {
    return <Creating name={creatingFromTemplateName} />;
  }

  return [
    <Component
      key="component"
      onClose={onClose}
      templates={templateProp}
      onCreateFromTemplate={createFromTemplate}
      onInstallNew={showPackages}
    />,
    isPackagesVisible ? (
      <PortalThing key="portal" onClose={hidePackages} onPackageInstalled={fetchTemplates} />
    ) : null,
  ];
};
