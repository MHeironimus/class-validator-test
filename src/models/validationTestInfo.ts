import { MaxLength } from "class-validator";

// tslint:disable:no-magic-numbers
export class ValidationTestInfo {

	@MaxLength(10)
	name: string;
}