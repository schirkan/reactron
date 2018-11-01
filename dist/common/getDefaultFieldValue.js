"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDefaultFieldValue = function (field) {
    var value = field.defaultValue;
    if (field.isArray) {
        if (value && Array.isArray(value)) {
            return value;
        }
        return [];
    }
    switch (field.valueType) {
        case 'object':
            return value || {};
        case 'number':
            return value || 0;
        case 'boolean':
            return value || false;
        case 'string':
            return value || '';
        case 'style':
            return value || {};
        case 'webComponent':
            return undefined;
    }
    return undefined;
};
//# sourceMappingURL=getDefaultFieldValue.js.map