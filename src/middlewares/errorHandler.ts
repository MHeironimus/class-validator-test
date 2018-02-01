import { Middleware, ExpressErrorMiddlewareInterface, HttpError, BadRequestError } from "routing-controllers";
import { Result } from "../models/response/result";
import { Request, Response } from "express";
import { INTERNAL_SERVER_ERROR, UNAUTHORIZED } from "http-status-codes";
import { ValidationError } from "class-validator";

// The any related tslint rules are disable for this middleware class because
// this class deals with JavaScript errors, which can be any type.
// tslint:disable:no-any
// tslint:disable:no-unsafe-any

@Middleware({ type: "after" })
export class ErrorHandler implements ExpressErrorMiddlewareInterface {

	error(error: any, request: Request, response: Response, next: (err: any) => any): void {
		let result: Result<object>;

		// Check for Authentication Errors
		if (ErrorHandler.isAuthenticationError(error)) {
      result = Result.error(UNAUTHORIZED, ErrorHandler.getErrorMessage(error));
      response.status(UNAUTHORIZED).send(result);

    // Check for Validation Errors
    } else if (ErrorHandler.isValidationError(error)) {
			result = Result.error(error.httpCode, ErrorHandler.getConstraintErrors(error.errors));
			response.status(error.httpCode).send(result);

		// Check for other Know HttpError
		} else if (error instanceof HttpError) {
			result = Result.error(error.httpCode, ErrorHandler.getErrorMessage(error));
			response.status(error.httpCode).send(result);

		// Prevent error stack from being sent to the requestor.
		} else {
			response.status(INTERNAL_SERVER_ERROR).send("");
		}

		next(error);
	}

	private static getErrorMessage(error: any): string | undefined {
		return error.message === "" ? undefined : error.message;
	}

	private static isAuthenticationError(error: any): boolean {
	  return error.name === "UnauthorizedError";
  }

	private static isValidationError(error: any): boolean {
		return (error.errors && error.name === BadRequestError.name);
	}

	private static getConstraintErrors(modelConstraintViolations: Array<ValidationError>): Array<string> {
		const errorArray: string[] = [];

		modelConstraintViolations.forEach((element: ValidationError) => {
			Object.keys(element.constraints).forEach((k: string) => {
				errorArray.push(element.constraints[k]);
			});
		});

		return errorArray;
	}
}
