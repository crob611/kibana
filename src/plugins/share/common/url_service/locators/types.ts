/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

import { PersistableState, SerializableState } from 'src/plugins/kibana_utils/common';

/**
 * URL locator registry.
 */
export interface ILocatorClient {
  /**
   * Create and register a new locator.
   *
   * @param urlGenerator Definition of the new locator.
   */
  create<P extends SerializableState>(locatorDefinition: LocatorDefinition<P>): LocatorPublic<P>;

  /**
   * Retrieve a previously registered locator.
   *
   * @param id Unique ID of the locator.
   */
  get<P>(id: string): undefined | LocatorPublic<P>;
}

/**
 * A convenience interface used to define and register a locator.
 */
export interface LocatorDefinition<P extends SerializableState>
  extends Partial<PersistableState<P>> {
  /**
   * Unique ID of the locator. Should be constant and unique across Kibana.
   */
  id: string;

  /**
   * Returns a deep link, including location state, which can be used for
   * navigation in Kibana.
   *
   * @param params Parameters from which to generate a Kibana location.
   */
  getLocation(params: P): Promise<KibanaLocation>;
}

/**
 * Public interface of a registered locator.
 */
export interface LocatorPublic<P> {
  /**
   * Returns a relative URL to the client-side redirect endpoint using this
   * locator. (This method is necessary for compatibility with URL generators.)
   */
  getLocation(params: P): Promise<KibanaLocation>;

  /**
   * Navigate using the `core.application.navigateToApp()` method to a Kibana
   * location generated by this locator. This method is available only on the
   * browser.
   */
  navigate(params: P, navigationParams?: LocatorNavigationParams): Promise<void>;
}

export interface LocatorNavigationParams {
  replace?: boolean;
}

/**
 * This interface represents a location in Kibana to which one can navigate
 * using the `core.application.navigateToApp()` method.
 */
export interface KibanaLocation<S = object> {
  /**
   * Kibana application ID.
   */
  app: string;

  /**
   * A URL route within a Kibana application.
   */
  route: string;

  /**
   * A serializable location state object, which the app can use to determine
   * what should be displayed on the screen.
   */
  state: S;
}
