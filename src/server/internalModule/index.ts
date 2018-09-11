import { IServiceDefinition } from "../../interfaces/IServiceDefinition";
import { ModuleController } from "./ModuleController";
import { ServiceController } from "./ServiceController";
import { SettingsController } from "./SettingsController";
import { WebComponentController } from "./WebComponentController";
import { WebPageController } from "./WebPageController";

export * from "./ModuleController";
export * from "./ServiceController";
export * from "./WebPageController";
export * from "./WebComponentController";
export * from "./SettingsController";

export const services: IServiceDefinition[] = [{
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
}];