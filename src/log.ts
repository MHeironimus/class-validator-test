import { LoggerInstance, Logger, transports } from "winston";

class Log {
	logger: LoggerInstance;

	constructor() {
		this.logger = new Logger({
			transports: [
				new transports.Console({
					json: false,
					formatter: (options: {}): string => {
						return this.formatter(options);
					}
				})
			]
		});
	}

	public debug(msg: string): void {
		this.logger.debug(msg);
	}

	// tslint:disable-next-line:no-any
	public error(msg: string | {}): void {
		if (typeof msg === "string") {
			this.logger.error(msg);
		} else {
			this.logger.error(JSON.stringify(msg, Object.getOwnPropertyNames(msg)));
		}
	}

	public info(msg: string): void {
		this.logger.info(msg);
	}

	public trace(msg: string): void {
		this.logger.verbose(msg);
	}

	public warn(msg: string): void {
		this.logger.warn(msg);
	}

	public formatter(options: {}): string {

		let formattedResult: string;

		const logFields: {
			appName: string | undefined;
			appEnv: string | undefined;
			appDeployment: string;
			pid: number;
			"@timestamp": string;
			message?: string;
			level?: string;
		} = {
				"@timestamp": (new Date()).toISOString(),
				appName: process.env.APP_NAME,
				appEnv: process.env.NODE_ENV,
				appDeployment: "DEFAULT",
				pid: process.pid
			};

		const excludeFields: {
			prettyPrint: undefined;
			showLevel: undefined;
			label: undefined;
			logstash: undefined;
			humanReadableUnhandledException: undefined;
			depth: undefined;
			colorize: undefined;
			align: undefined;
			json: undefined;
			timestamp: undefined;
			raw: undefined;
		} = {
				prettyPrint: undefined,
				showLevel: undefined,
				label: undefined,
				logstash: undefined,
				humanReadableUnhandledException: undefined,
				depth: undefined,
				colorize: undefined,
				align: undefined,
				json: undefined,
				timestamp: undefined,
				raw: undefined
			};

		Object.assign(logFields, options, excludeFields);

		if (process.env.LOG_FORMAT === "string") {

			const timestampStart: number = 11;
			const timestampEnd: number = 23;
			formattedResult = `${logFields["@timestamp"].substring(timestampStart, timestampEnd)} `;
			formattedResult += `${(logFields.level === undefined ? "" : logFields.level.toUpperCase())} `;
			formattedResult += `${logFields.message}`;

		} else {
			formattedResult = JSON.stringify(logFields);
		}

		return formattedResult;
	}

}

export const log: Log = new Log();