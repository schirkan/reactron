export interface IServerInfo {
    ip: string;
    cpu: { count: number, speed: number };
    memory: { free: number, total: number };
    version: string;
}