import { BrowserModuleContext, initModuleContext, initSettings } from './BrowserModuleContext';

const obj = {
    init: async () => {
        await initModuleContext();
        // internal module
        obj.instance = new BrowserModuleContext('reactron');
        await initSettings();
    },
    instance: undefined as unknown as BrowserModuleContext
};

export default obj;