import { ICommandResult } from "../interfaces/ICommandResult";

export const wrapCall = (callback: (...args: any[]) => Promise<ICommandResult | any> | Promise<any> | any, commandName: string | undefined = undefined) => {
    return async (...args: any[]): Promise<ICommandResult> => {
        const result = {
            command: commandName || callback.prototype.name + '.' + callback.name,
            timestampStart: Date.now(),
            args: JSON.stringify(args)
        } as ICommandResult;

        console.log('Start Command: ' + result.command + ' ' + result.args);

        try {
            const callbackResult = await Promise.resolve(callback(...args)) as any;
            // check if callbackResult is ICommandResult
            if (callbackResult && callbackResult.hasOwnProperty('success') && callbackResult.hasOwnProperty('command')) {
                result.success = callbackResult.success;
                result.children = [callbackResult];
            } else {
                result.success = true;
                result.data = callbackResult;
            }
        } catch (error) {
            console.log('Error in Command: ' + result.command + ' ' + result.args, error);
            result.message = JSON.stringify(error);
            result.success = false;
        }

        result.timestampEnd = Date.now();

        console.log('End Command: ' + result.command + ' ' + result.args + ' ' + (result.success ? 'success' : 'error') + (result.message ? ' - ' + result.message : ''));

        return result;
    }
}

export const command = (commandName: string | undefined, args: any, callback: (...args: any[]) => Promise<ICommandResult | any> | Promise<any> | any) => {
    return wrapCall(callback, commandName)(args);
}