"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDefaultFieldValue = function (field) {
    var defaultValue = field.defaultValue;
    if (field.isArray) {
        if (defaultValue && Array.isArray(defaultValue)) {
            return defaultValue;
        }
        return [];
    }
    switch (field.valueType) {
        case 'object':
            var result_1 = defaultValue;
            if (result_1 === undefined) {
                result_1 = {};
                if (field.fields) {
                    field.fields.forEach(function (f) {
                        result_1[f.name] = exports.getDefaultFieldValue(f);
                    });
                }
            }
            return result_1;
        case 'number':
            return defaultValue || 0;
        case 'boolean':
            return defaultValue || false;
        case 'string':
            return defaultValue || '';
        case 'style':
            return defaultValue || {};
        case 'webComponent':
            return undefined;
    }
    return undefined;
};
//# sourceMappingURL=getDefaultFieldValue.js.map