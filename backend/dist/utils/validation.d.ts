export declare class ValidationError extends Error {
    constructor(message: string);
}
export declare function validateRequiredParam(value: string | undefined, paramName: string): string;
export declare function validateRequiredParams(params: Record<string, string | undefined>): Record<string, string>;
export declare function validateUUID(value: string | undefined, paramName: string): string;
//# sourceMappingURL=validation.d.ts.map