"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidationError = void 0;
exports.validateRequiredParam = validateRequiredParam;
exports.validateRequiredParams = validateRequiredParams;
exports.validateUUID = validateUUID;
class ValidationError extends Error {
    constructor(message) {
        super(message);
        this.name = 'ValidationError';
    }
}
exports.ValidationError = ValidationError;
function validateRequiredParam(value, paramName) {
    if (!value) {
        throw new ValidationError(`Missing required parameter: ${paramName}`);
    }
    return value;
}
function validateRequiredParams(params) {
    const validated = {};
    for (const [key, value] of Object.entries(params)) {
        validated[key] = validateRequiredParam(value, key);
    }
    return validated;
}
function validateUUID(value, paramName) {
    const id = validateRequiredParam(value, paramName);
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(id)) {
        throw new ValidationError(`Invalid UUID format for parameter: ${paramName}`);
    }
    return id;
}
//# sourceMappingURL=validation.js.map