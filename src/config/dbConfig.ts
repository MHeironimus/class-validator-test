import * as dotenv from "dotenv";

dotenv.config();

export const dbConfig: {} = {
	client: "pg",
	connection: {
		host: process.env.DB_HOST,
		user: process.env.DB_USER,
		password: process.env.DB_PASSWORD,
		database: process.env.DB_NAME,
		application_name: process.env.APP_NAME,
		ssl: (process.env.DB_SSL === "true")
	},
	pool: { min: 0, max: 7 }
};