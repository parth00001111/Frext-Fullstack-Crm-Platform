import { IResponse } from './../Response';
import { type Request, type Response, type NextFunction } from "express";


const authorize = (...roles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        if(!req.user) {
            return res.status(401).json({
                success: false, 
                message: "unauthorize",
                value: null

            } as IResponse)
        }
        if(!roles.includes(req.user.role)){
            return res.status(401).json({
                success: false,
                message: "Access Denied", 
                data: null
            })
        }
        next();
    }

}
export default authorize;