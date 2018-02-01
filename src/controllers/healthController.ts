import {
  JsonController, Req, Res,
  Get, Post, Put, Param, BadRequestError,
  NotFoundError, Body
} from "routing-controllers";
import { Request, Response } from "express";
import { log } from "../log";
import { Result } from "../models/response/result";
import { HealthInfo } from "../models/healthInfo";
import { ApplicationInfoService } from "../services/applicationInfoService";
import { ValidationTestInfo } from "../models/validationTestInfo";

@JsonController()
export class HealthController {

  private readonly applicationInfoService: ApplicationInfoService;

  constructor(applicationInfoService: ApplicationInfoService) {
    this.applicationInfoService = applicationInfoService;
  }

  @Get("/health")
  getHealth( @Req() req: Request, @Res() res: Response): Result<HealthInfo> {
    log.info("Requesting health information.");

    const data: HealthInfo = {
      application: this.applicationInfoService.getApplicationInfo()
    };

    return Result.ok(data);
  }

  @Put("/health/ValidationError")
  postHealthWithValidationErrors(
    @Body() validationTestInfo: ValidationTestInfo,
    @Req() req: Request): Result<HealthInfo> {

    log.info("Testing model validation middleware.");

    const data: HealthInfo = {
      application: this.applicationInfoService.getApplicationInfo()
    };

    return Result.ok(data);
  }

  @Post("/health/:errorToRaise")
  postHealth( @Param("errorToRaise") errorToRaise: string): Result<HealthInfo> {
    log.info(`Raising error message: ${errorToRaise}`);

    switch (errorToRaise.toLowerCase()) {
      case "badrequesterror":
        throw new BadRequestError("Test error message");
      case "notfounderror":
        throw new NotFoundError();
      default:
        throw new Error(errorToRaise);
    }
  }
}
