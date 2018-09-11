"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createOptions = function (options, objectDefinition) {
    var result = {};
    Object.keys(options).forEach(function (key) {
        var parts = key.split('.');
        var current = result;
        for (var i = 0; i < parts.length; i++) {
            var part = parts[i];
            if (!current[part]) {
                if (i === parts.length - 1) {
                    var value = options[key];
                    // fix value Type
                    if (objectDefinition && objectDefinition.options) {
                        var optionDefinition = objectDefinition.options.find(function (x) { return x.name === key; });
                        if (optionDefinition && optionDefinition.valueType === 'number') {
                            value = Number.parseFloat(value);
                        }
                    }
                    current[part] = value;
                }
                else {
                    current[part] = {};
                }
            }
            current = current[part];
        }
    });
    return result;
};
//# sourceMappingURL=optionsHelper.js.map