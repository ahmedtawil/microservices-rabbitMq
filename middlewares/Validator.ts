import Joi from 'joi';
import Validators from '../validators/user.validator';
import express, { Express, Request, Response, Application } from 'express';
export = function (validator: PropertyKey, msg: any) {
    if (!Validators.hasOwnProperty(validator))
        throw new Error(`'${validator.toString()}' validator is not exist`)

    return async function (req: Request, res: Response, next: any) {
        try {
            const validated = await Validators[validator].validateAsync(req.body)
            req.body = validated
            next()
        } catch (err: any) {
            if (err.isJoi) return res.json(msg)
        }
    }
}
