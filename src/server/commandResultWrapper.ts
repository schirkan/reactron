import { ICommandResultWithData } from "../interfaces/ICommandResult";

export const command = async <T = void>(commandName: string | undefined, args: any,
    callback: (result: ICommandResultWithData<T>) => Promise<T> | T | Promise<ICommandResultWithData<T>> | ICommandResultWithData<T>)
    : Promise<ICommandResultWithData<T>> => {
    const result = {
        args: args ? JSON.stringify(args) : '',
        children: [],
        log: [],
        command: commandName || callback.prototype.name + '.' + callback.name,
        success: undefined,
        timestampStart: Date.now(),
        timestampEnd: 0,
        data: undefined as any
    } as ICommandResultWithData<T>;

    console.log('Start Command: ' + result.command + ' ' + result.args);

    try {
        const callbackResult = await Promise.resolve(callback(result) as any);
        // check if callbackResult is ICommandResult
        if (callbackResult && callbackResult.hasOwnProperty('success') && callbackResult.hasOwnProperty('command')) {
            const innerResult = callbackResult as any as ICommandResultWithData<T>;
            result.success = innerResult.success;
            result.children.push(innerResult);
            result.data = innerResult.data;
        } else if (callbackResult) {
            result.data = callbackResult;
        }

        // evaluate success
        if (result.success === undefined) {
            if (result.children.length) {
                result.success = result.children.every(x => x.success === true || x.success === undefined);
            } else {
                result.success = true;
            }
        }
    } catch (error) {
        console.log('Error in Command: ' + result.command + ' ' + result.args, error);
        const message = error && error.message || JSON.stringify(error);
        result.log.push(message);
        result.success = false;
    }

    result.timestampEnd = Date.now();

    console.log('End Command: ' + result.command + ' ' + result.args + ' ' + (result.success ? 'success' : 'error'));

    return result;
}