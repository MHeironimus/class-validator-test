import { expect, assert } from "chai";
import * as httpsStatuses from "http-status-codes";
import { Result } from "./../../../../src/models/response/result";
import { Link } from "./../../../../src/models/response/link";

describe("Result model unit test", () => {
	function expectCreateResult(result: Result<object>, statusCode: number): void {
		expect(result._data).to.equal(undefined);
		expect(result._statusCode).to.equal(statusCode);
		expect(result._links).to.equal(undefined);
		expect(result._errors).to.equal(undefined);
	}

	function expectCreateResultWithData(result: Result<object>, statusCode: number): void {
		expect(result._data).to.deep.equal({
			test: "test"
		});
		expect(result._statusCode).to.equal(statusCode);
		expect(result._links).to.equal(undefined);
		expect(result._errors).to.equal(undefined);
	}

	function expectCreateResultWithLink(result: Result<object>, statusCode: number): void {
		expect(result._data).to.equal(undefined);
		expect(result._statusCode).to.equal(statusCode);
		expect(result._links).to.deep.equal({
			testRef: {
				href: "testHref"
			}
		});
		expect(result._errors).to.equal(undefined);
	}

	function expectCreateResultWithLinks(result: Result<object>, statusCode: number): void {
		expect(result._data).to.equal(undefined);
		expect(result._statusCode).to.equal(statusCode);
		expect(result._links).to.deep.equal({
			testRef: {
				href: "testHref"
			},
			testRef2: {
				href: "testHref2"
			}
		});
		expect(result._errors).to.equal(undefined);
	}

	describe("OK status code", () => {
		it("should create result", () => {
			const result: Result<object> = Result.ok();
			expectCreateResult(result, httpsStatuses.OK);
		});

		it("should create result with data", () => {
			const data: object = {
				test: "test"
			};
			const result: Result<object> = Result.ok(data);
			expectCreateResultWithData(result, httpsStatuses.OK);
		});

		it("should create result with link", () => {
			const result: Result<object> = Result.ok(undefined, new Link("testRef", "testHref"));
			expectCreateResultWithLink(result, httpsStatuses.OK);
		});

		it("should create result with multiple links", () => {
			const result: Result<object> = Result.ok(undefined,
				[new Link("testRef", "testHref"), new Link("testRef2", "testHref2")]);
			expectCreateResultWithLinks(result, httpsStatuses.OK);
		});
	});

	describe("CREATED status code", () => {
		it("should create result", () => {
			const result: Result<object> = Result.created();
			expectCreateResult(result, httpsStatuses.CREATED);
		});

		it("should create result with data", () => {
			const data: object = {
				test: "test"
			};
			const result: Result<object> = Result.created(data);
			expectCreateResultWithData(result, httpsStatuses.CREATED);
		});

		it("should create result with link", () => {
			const result: Result<object> = Result.created(undefined, new Link("testRef", "testHref"));
			expectCreateResultWithLink(result, httpsStatuses.CREATED);
		});

		it("should create result with multiple links", () => {
			const result: Result<object> = Result.created(undefined,
				[new Link("testRef", "testHref"), new Link("testRef2", "testHref2")]);
			expectCreateResultWithLinks(result, httpsStatuses.CREATED);
		});
	});

	describe("error factory method", () => {

		it("should not include errors if no errors are provided", () => {
			// Act
			const actual: Result<object> = Result.error(httpsStatuses.INTERNAL_SERVER_ERROR);
			// Assert
			expect(actual._statusCode).to.equal(httpsStatuses.INTERNAL_SERVER_ERROR);
			expect(actual._errors).to.be.equal(undefined);
			expect(actual._data).to.be.equal(undefined);
			expect(actual._links).to.be.equal(undefined);			
		});

		it("should include errors if a string error is provided", () => {
			// Act
			const expectedErrorMessage: string = "Expected error message";
			const actual: Result<object> = Result.error(
				httpsStatuses.INTERNAL_SERVER_ERROR,
				expectedErrorMessage
			);
			// Assert
			expect(actual._statusCode).to.equal(httpsStatuses.INTERNAL_SERVER_ERROR);
			assert.isArray(actual._errors);
			assert.equal(actual._errors[0], expectedErrorMessage);
			expect(actual._data).to.equal(undefined);
			expect(actual._links).to.equal(undefined);			
		});


		it("should include errors if an array of strings is provided", () => {
			// Act
			const expectedErrorMessages: Array<string> = [
				"Expected error message 1",
				"Expected error message 2",
				"Expected error message 3"
			];
			const actual: Result<object> = Result.error(
				httpsStatuses.INTERNAL_SERVER_ERROR,
				expectedErrorMessages
			);
			// Assert
			expect(actual._statusCode).to.equal(httpsStatuses.INTERNAL_SERVER_ERROR);
			assert.isArray(actual._errors);
			assert.equal(actual._errors, expectedErrorMessages);
			expect(actual._data).to.equal(undefined);
			expect(actual._links).to.equal(undefined);			
		});

	});
});