import { IReactronServiceDefinition } from "@schirkan/reactron-interfaces";
import { AppController } from "./AppController";
import { ModuleController } from "./ModuleController";
import { ServiceController } from "./ServiceController";
import { SettingsController } from "./SettingsController";
import { WebComponentController } from "./WebComponentController";
import { WebPageController } from "./WebPageController";
import { RefreshController } from "./RefreshController";

export const services: IReactronServiceDefinition[] = [{
  name: 'ModuleController',
  displayName: 'Modules API',
  description: 'API Controller for Modules',
  service: ModuleController
}, {
  name: 'ServiceController',
  displayName: 'Service API',
  description: 'API Controller for Services',
  service: ServiceController
}, {
  name: 'WebPageController',
  displayName: 'WebPages API',
  description: 'API Controller for WebPages',
  service: WebPageController
}, {
  name: 'WebComponentController',
  displayName: 'WebComponents API',
  description: 'API Controller for WebComponents',
  service: WebComponentController
}, {
  name: 'SettingsController',
  displayName: 'SystemSettings API',
  description: 'API Controller for SystemSettings',
  service: SettingsController
}, {
  name: 'AppController',
  displayName: 'Application API',
  description: 'API Controller for Application',
  service: AppController
}, {
  name: 'RefreshController',
  displayName: 'Refresh Controller',
  description: 'Auto Refresh Controller',
  service: RefreshController
}];