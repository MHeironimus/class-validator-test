import { log } from "./../../src/log";
import * as sinon from "sinon";
import { expect } from "chai";

describe("Log unit test", () => {

  it("log.debug should log as debug", () => {
    const debugSpy: sinon.SinonSpy = sinon.spy(log.logger, "debug");
    log.debug("Debug Test");

    sinon.assert.calledOnce(debugSpy);
    sinon.assert.calledWith(debugSpy, "Debug Test");
  });

  it("log.error should log string as error", () => {
    const errorSpy: sinon.SinonSpy = sinon.spy(log.logger, "error");
    log.error("Error Test");

    sinon.assert.calledOnce(errorSpy);
    sinon.assert.calledWith(errorSpy, "Error Test");
    errorSpy.restore();

  });

  it("log.error should log Error as error", () => {
    const errorObjectSpy: sinon.SinonSpy = sinon.spy(log.logger, "error");
    const expectedError: Error = new Error("An error");
    log.error(expectedError);

    sinon.assert.calledOnce(errorObjectSpy);
    sinon.assert.calledWith(errorObjectSpy, JSON.stringify(expectedError, Object.getOwnPropertyNames(expectedError)));
    errorObjectSpy.restore();
  });

  it("log.info should log as info", () => {
    const infoSpy: sinon.SinonSpy = sinon.spy(log.logger, "info");
    log.info("Info Test");

    sinon.assert.calledOnce(infoSpy);
    sinon.assert.calledWith(infoSpy, "Info Test");
  });

  it("log.trace should log as verbose", () => {
    const traceSpy: sinon.SinonSpy = sinon.spy(log.logger, "verbose");
    log.trace("Trace Test");

    sinon.assert.calledOnce(traceSpy);
    sinon.assert.calledWith(traceSpy, "Trace Test");
  });

  it("log.warn should log as warn", () => {
    const warnSpy: sinon.SinonSpy = sinon.spy(log.logger, "warn");
    log.warn("Warn Test");

    sinon.assert.calledOnce(warnSpy);
    sinon.assert.calledWith(warnSpy, "Warn Test");
  });

  it("log.formatter logs message in JSON format", () => {

    // Arrange
    const logMessage: {
      message: string;
      level: string;
    } = {
        message: "This is a test logging message",
        level: "DEBUG"
      };
    process.env.LOG_FORMAT = "json";

    // Act
    const actual: string = log.formatter(logMessage);

    // Assert
    expect(actual).to.contain(`"appName":"${process.env.APP_NAME}"`);
    expect(actual).to.contain('"appDeployment":"DEFAULT"');
    expect(actual).to.contain(`"message":"${logMessage.message}"`);
    expect(actual).to.contain(`"level":"${logMessage.level}"`);

  });

  it("log.formatter logs message in string format", () => {

    // Arrange
    const logMessage: {
      message: string;
      level: string;
    } = {
        message: "This is a test logging message",
        level: "DEBUG"
      };
    process.env.LOG_FORMAT = "string";

    // Act
    const actual: string = log.formatter(logMessage);

    // Assert
    expect(actual).to.contain(`${logMessage.level} ${logMessage.message}`);

  });

  it("log.formatter logs message in string that is missing a level", () => {

    // Arrange
    const logMessage: {
      message: string;
    } = {
        message: "This is a test logging message"
      };
    process.env.LOG_FORMAT = "string";

    // Act
    const actual: string = log.formatter(logMessage);

    // Assert
    expect(actual).to.contain(`${logMessage.message}`);

  });
});