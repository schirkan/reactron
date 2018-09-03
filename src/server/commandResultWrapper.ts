import { ICommandResult } from "../interfaces/ICommandResult";

export const wrapCall = (callback: (...args: any[]) => Promise<ICommandResult | any> | Promise<any> | any, commandName: string | undefined = undefined) => {
    commandName = commandName || callback.prototype.name + '.' + callback.name;
    return (...args: any[]): Promise<ICommandResult> => {
        return command(commandName, args, () => callback(...args));
    };
}

export const command = async <T = void>(commandName: string | undefined, args: any, callback: (result: ICommandResult<T>) => Promise<T> | T): Promise<ICommandResult<T>> => {
    const result = {
        args: args ? JSON.stringify(args) : '',
        children: [],
        log: [],
        command: commandName || callback.prototype.name + '.' + callback.name,
        success: true,
        timestampStart: Date.now(),
        timestampEnd: 0
    } as ICommandResult<T>;

    console.log('Start Command: ' + result.command + ' ' + result.args);

    try {
        const callbackResult = await Promise.resolve(callback(result)) as any;
        // check if callbackResult is ICommandResult
        if (callbackResult && callbackResult.hasOwnProperty('success') && callbackResult.hasOwnProperty('command')) {
            const innerResult = callbackResult as ICommandResult<T>
            result.success = callbackResult.success;
            result.children.push(callbackResult);
            result.data = innerResult.data;
        } else {
            result.data = callbackResult;
        }
    } catch (error) {
        console.log('Error in Command: ' + result.command + ' ' + result.args, error);
        result.log.push(error);
        result.success = false;
    }

    result.timestampEnd = Date.now();

    console.log('End Command: ' + result.command + ' ' + result.args + ' ' + (result.success ? 'success' : 'error'));

    return result;
}