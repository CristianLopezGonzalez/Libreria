import { StatusCodes } from "../types/StatusCodes";
import { Response } from "express";

export class ResponseHttp {

    constructor() {
        this.OK = this.OK.bind(this);
        this.CREATED = this.CREATED.bind(this);
        this.BAD_REQUEST = this.BAD_REQUEST.bind(this);
        this.UNAUTHORIZED = this.UNAUTHORIZED.bind(this);
        this.FORBIDDEN = this.FORBIDDEN.bind(this);
        this.NOT_FOUND = this.NOT_FOUND.bind(this);
        this.INTERNAL_SERVER_ERROR = this.INTERNAL_SERVER_ERROR.bind(this);
    }

    OK(res: Response, data?: any, message?: string) {
        return res.status(StatusCodes.OK).json({
            status: StatusCodes.OK,
            message: message || 'Success',
            data
        })
    }

    CREATED(res: Response, data?: any, message?: string) {
        return res.status(StatusCodes.CREATED).json({
            status: StatusCodes.CREATED,
            message: message || 'Resource created successfully',
            data
        })
    }

    BAD_REQUEST(res: Response, message?: string) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            status: StatusCodes.BAD_REQUEST,
            message: message || 'Bad Request'
        })
    }

    UNAUTHORIZED(res: Response, message?: string) {
        return res.status(StatusCodes.UNAUTHORIZED).json({
            status: StatusCodes.UNAUTHORIZED,
            message: message || 'Unauthorized'
        })
    }

    FORBIDDEN(res: Response, message?: string) {
        return res.status(StatusCodes.FORBIDDEN).json({
            status: StatusCodes.FORBIDDEN,
            message: message || 'Forbidden'
        })
    }

    NOT_FOUND(res: Response, message?: string) {
        return res.status(StatusCodes.NOT_FOUND).json({
            status: StatusCodes.NOT_FOUND,
            message: message || 'Resource not found'
        })
    }

    INTERNAL_SERVER_ERROR(res: Response, message?: string) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: StatusCodes.INTERNAL_SERVER_ERROR,
            message: message || 'Internal Server Error'
        })
    }

}