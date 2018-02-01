import "reflect-metadata"; // this shim is required for routing-controllers
import * as express from "express";
import * as winston from "winston";
import * as expressWinston from "express-winston";
import * as bodyParser from "body-parser";
import * as cookieParser from "cookie-parser";
import { log } from "./log";
import { Container } from "typedi";
import { useExpressServer, useContainer } from "routing-controllers";
import { ErrorHandler } from "./middlewares/errorHandler";
import { HealthController } from "./controllers/healthController";

export class App {
  public express: express.Application;

  constructor() {

    useContainer(Container);

    this.express = express();

    this.setHeaders();
    this.middleware();
    this.requestLogger();

    useExpressServer(this.express, {
      controllers: [HealthController],
      middlewares: [ErrorHandler],
      defaultErrorHandler: false
    });

    this.errorLogger();
  }

  private setHeaders(): void {
    this.express.get("/*", (req: express.Request, res: express.Response, next: express.NextFunction) => {
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.setHeader("Cache-Control", "must-revalidate");
      res.setHeader("Content-Type", "application/json; charset=utf-8");
      next(); // http://expressjs.com/guide.html#passing-route control
    });
  }

  private middleware(): void {
    this.express.use(bodyParser.json());
    this.express.use(bodyParser.urlencoded({ extended: false }));
    this.express.use(cookieParser());
  }

  private requestLogger(): void {

    expressWinston.requestWhitelist.push("body");
    expressWinston.responseWhitelist.push("body");

    /* tslint:disable:no-unsafe-any */
    this.express.use(expressWinston.logger({
      transports: [
        new winston.transports.Console({
          formatter: (options: {}): string => {
            return log.formatter(options);
          }
        })
      ],
      // optional: control whether you want to log the meta data about the request (default to true)
      meta: true,
			/**
			 * optional: customize the default logging message. 
			 * E.g. "{{res.statusCode}} {{req.method}} {{res.responseTime}}ms {{req.url}}"
			 */
      msg: "HTTP {{res.statusCode}} {{req.method}} {{req.url}}",
			/**
			 * Use the default Express/morgan request formatting. Enabling this will override any msg if true. 
			 * Will only output colors with colorize set to true
			 */
      expressFormat: false,
			/**
			 * optional: allows to skip some log messages based on request and/or response
			 */
      ignoreRoute: (req: Request, res: Response): boolean => { return false; }
    }));
    /* tslint:enable:no-unsafe-any */
  }

  private errorLogger(): void {
    /* tslint:disable:no-unsafe-any */
    this.express.use(expressWinston.errorLogger({
      transports: [
        new winston.transports.Console({
          formatter: (options: {}): string => {
            return log.formatter(options);
          }
        })
      ]
    }));
    /* tslint:enable:no-unsafe-any */
  }
}