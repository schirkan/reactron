export declare class ServiceOptionsRepository {
    private repository;
    get(moduleName: string, serviceName: string): any;
    set(moduleName: string, serviceName: string, options: any): void;
}
