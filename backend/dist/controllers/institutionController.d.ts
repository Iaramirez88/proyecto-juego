import { Response } from 'express';
import { AuthenticatedRequest } from '../types';
export declare class InstitutionController {
    static getAll(req: AuthenticatedRequest, res: Response): Promise<void>;
    static getById(req: AuthenticatedRequest, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    static create(req: AuthenticatedRequest, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    static update(req: AuthenticatedRequest, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    static delete(req: AuthenticatedRequest, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    static getStats(req: AuthenticatedRequest, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
}
//# sourceMappingURL=institutionController.d.ts.map