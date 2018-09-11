import { IObjectDefinition } from "../interfaces/IObjectDefinition";

export const createOptions = (options: { [key: string]: any }, objectDefinition: IObjectDefinition) => {
    const result = {};

    Object.keys(options).forEach(key => {
        const parts = key.split('.');
        let current = result;

        for (let i = 0; i < parts.length; i++) {
            const part = parts[i];
            if (!current[part]) {
                if (i === parts.length - 1) {
                    let value = options[key];
                    // fix value Type
                    if (objectDefinition && objectDefinition.options) {
                        const optionDefinition = objectDefinition.options.find(x => x.name === key);
                        if (optionDefinition && optionDefinition.valueType === 'number') {
                            value = Number.parseFloat(value);
                        }
                    }
                    current[part] = value;
                } else {
                    current[part] = {};
                }
            }
            current = current[part];
        }
    });

    return result;
}