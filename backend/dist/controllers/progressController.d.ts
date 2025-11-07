import { Response } from 'express';
import { AuthenticatedRequest } from '../types';
export declare class ProgressController {
    static createProgress(req: AuthenticatedRequest, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    static getUserProgress(req: AuthenticatedRequest, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    static getClassroomProgress(req: AuthenticatedRequest, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    static getUserStats(req: AuthenticatedRequest, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    static updateProgress(req: AuthenticatedRequest, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    static deleteProgress(req: AuthenticatedRequest, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
}
//# sourceMappingURL=progressController.d.ts.map