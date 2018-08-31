import { ICommandResult } from "../interfaces/ICommandResult";

export const wrapCall = (callback: (...args: any[]) => Promise<ICommandResult | any> | Promise<any> | any, commandName: string | undefined = undefined) => {
    return async (...args: any[]): Promise<ICommandResult> => {
        const result = {
            command: commandName || callback.prototype.name + '.' + callback.name,
            timestampStart: Date.now(),
            args: JSON.stringify(args)
        } as ICommandResult;

        try {
            const callbackResult = await callback(...args);
            // check if callbackResult is ICommandResult
            if (callbackResult && callbackResult.hasOwnProperty('success') && callbackResult.hasOwnProperty('command')) {
                result.success = callbackResult.success;
                result.children = [callbackResult];
            } else {
                result.success = true;
                result.data = callbackResult;
            }
        } catch (error) {
            result.message = JSON.stringify(error);
            result.success = false;
        }

        result.timestampEnd = Date.now();

        return result;
    }
}

export const command = (commandName: string | undefined, args: any, callback: (...args: any[]) => Promise<ICommandResult | any> | Promise<any> | any) => {
    return wrapCall(callback, commandName)(args);
}