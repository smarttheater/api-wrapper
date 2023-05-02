import { factory } from '@cinerino/sdk';
import { NextFunction, Request, Response } from 'express';

/**
 * プロジェクト設定
 */
export async function setProject(
    req: Request,
    _res: Response,
    next: NextFunction
) {
    req.project = {
        typeOf: factory.organizationType.Project,
        id: req.params.id,
    };

    next();
}

/**
 * プロジェクト確認
 */
export async function checkProject(
    req: Request,
    _res: Response,
    next: NextFunction
) {
    // プロジェクト未指定は拒否
    if (typeof req.project?.id !== 'string') {
        next(new Error('project not specified'));
    }

    next();
}
