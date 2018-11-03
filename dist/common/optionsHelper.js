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
            var result = defaultValue;
            if (result === undefined) {
                result = exports.getDefaultObjectValue(field.fields);
            }
            return result;
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
exports.getDefaultObjectValue = function (fields) {
    var result = {};
    if (fields) {
        fields.forEach(function (f) {
            result[f.name] = exports.getDefaultFieldValue(f);
        });
    }
    return result;
};
//# sourceMappingURL=optionsHelper.js.map