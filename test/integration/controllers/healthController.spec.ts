import * as mockRequest from "supertest";
import { server } from "./../../../src/server";
import { expect } from "chai";
import * as httpStatus from "http-status-codes";
import * as fs from "fs";
import { PackageJson } from "../../../src/models/packageJson";

/* tslint:disable:no-unsafe-any */
describe("/health Integration Tests ->", () => {

  describe("GET", () => {

    it("should return 200 for /health", (done: MochaDone) => {

      const expected: PackageJson = JSON.parse(fs.readFileSync("package.json", "utf8")) as PackageJson;

      mockRequest(server)
        .get("/health")
        .end((err: {}, response: mockRequest.Response) => {
          expect(response.status).to.equal(httpStatus.OK);
          expect(response.body._statusCode).to.equal(httpStatus.OK);
          expect(response.body._data.application.name).to.equal(expected.name);
          expect(response.body._data.application.description).to.equal(expected.description);
          expect(response.body._data.application.version).to.equal(expected.version);
          expect(response.body._data.application.nodeVersion).to.equal(process.version);
          done();
        });
    });

  });

  describe("Error Handling Integration Tests", () => {

    it("POST /health/BadRequestError should return 400 with an error message", (done: MochaDone) => {
      mockRequest(server)
        .post("/health/BadRequestError")
        .end((err: {}, response: mockRequest.Response) => {
          expect(response.status).to.equal(httpStatus.BAD_REQUEST);
          expect(response.body._statusCode).to.equal(httpStatus.BAD_REQUEST);
          expect(response.body._errors).to.be.an("array").and.to.deep.equal(["Test error message"]);
          done();
        });
    });

    it("PUT /health/ValidationError should return 400 with an error message for validation errors",
      (done: MochaDone) => {
        mockRequest(server)
          .put("/health/ValidationError").send({})
          .end((err: {}, response: mockRequest.Response) => {
            expect(response.status).to.equal(httpStatus.BAD_REQUEST);
            expect(response.body._statusCode).to.equal(httpStatus.BAD_REQUEST);
            expect(response.body._errors).to.be.an("array")
              .and.to.deep.equal(["name must be shorter than or equal to 10 characters"]);
            done();
          });
      });

    it("PUT /health/ValidationError should return 200 if all validation requirements are met", (done: MochaDone) => {
      mockRequest(server)
        .put("/health/ValidationError").send({ name: "12345" })
        .end((err: {}, response: mockRequest.Response) => {
          expect(response.status).to.equal(httpStatus.OK);
          expect(response.body._statusCode).to.equal(httpStatus.OK);
          done();
        });
    });

    it("POST /health/NotFoundError should return 404 without an error message", (done: MochaDone) => {
      mockRequest(server)
        .post("/health/NotFoundError")
        .end((err: {}, response: mockRequest.Response) => {
          expect(response.status).to.equal(httpStatus.NOT_FOUND);
          expect(response.body._statusCode).to.equal(httpStatus.NOT_FOUND);
          expect(response.body._errors).to.be.equal(undefined);
          done();
        });
    });

    it("POST /health/UnhandledError should return 500 with no message", (done: MochaDone) => {
      mockRequest(server)
        .post("/health/UnhandledError")
        .end((err: {}, response: mockRequest.Response) => {
          expect(response.status).to.equal(httpStatus.INTERNAL_SERVER_ERROR);
          expect(response.body).to.deep.equal({});
          done();
        });
    });

  });

});