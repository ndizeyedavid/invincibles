import { NextFunction, Request, Response } from "express";

const parseJsonRequest = (req: Request, res: Response, next: NextFunction): void => {
    try {
        Object.keys(req.body).forEach((key) => {
            const value = req.body[key];
            if (typeof value === "string") {
                try {
                    const parsedValue = JSON.parse(value);
                    req.body[key] = parsedValue;
                } catch (err) { }
            }
        });
        next();
    } catch (err) {
        console.error("Error in parseJsonRequest middleware:", err);
        next(err);
    }
};

export default parseJsonRequest;