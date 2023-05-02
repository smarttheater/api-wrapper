/**
 * アプリケーション固有の型
 */
import * as cinerino from '@cinerino/sdk';

declare global {
    namespace Express {
        export interface Request {
            project: cinerino.factory.project.IProject;
            user: cinerino.factory.clientUser.IClientUser;
            authClient?: cinerino.auth.ClientCredentials;
        }
        export interface SessionData {
            [key: string]: any;
        }
    }
    namespace log {
        export interface data {
            params?: any;
            method?: string;
            url: string;
            project: string;
        }
    }
}
