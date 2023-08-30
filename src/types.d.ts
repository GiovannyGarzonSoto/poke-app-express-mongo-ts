import { Request, Response } from 'express'

declare module 'express' {
    interface Request {
        user?: any; 
    }
}

// declare namespace Express {
//     export interface Request {
//         user: string | object
//     }
// }