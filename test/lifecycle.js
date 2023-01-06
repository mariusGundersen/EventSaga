import { EventEmitter } from "events";
import { beforeEach, describe, it } from "node:test";
import sinon from "sinon";
import EventSaga from "../src/index.js";

describe("EventSaga", function () {
  describe("lifecycle", function () {
    var emitter, spy;

    beforeEach(function () {
      emitter = new EventEmitter();
    });

    describe("simple create", function () {
      beforeEach(function (done) {
        spy = sinon.spy();
        new EventSaga(emitter, (saga) => {
          saga.createOn("create", function (data) {
            this.data.name = data.name;
          });
          saga.on("something", function (data) {
            spy(this.data.name);
            done();
          });
        });

        because: {
          emitter.emit("create", { id: 1, name: "test" });
          emitter.emit("something", { id: 1 });
        }
      });

      it("should get the same data object the second time", function () {
        sinon.assert.calledWith(spy, "test");
      });
    });

    describe("replace entire data object", function () {
      beforeEach(function (done) {
        spy = sinon.spy();
        new EventSaga(emitter, (saga) => {
          saga.createOn("create", function (data) {
            this.data = data.name;
          });
          saga.on("something", function (data) {
            spy(this.data);
            done();
          });
        });

        because: {
          emitter.emit("create", { id: 1, name: "test" });
          emitter.emit("something", { id: 1 });
        }
      });

      it("should get the same data object the second time", function () {
        sinon.assert.calledWith(spy, "test");
      });
    });

    describe("separate sagas", function () {
      beforeEach(function (done) {
        spy = sinon.spy();
        new EventSaga(emitter, (saga) => {
          saga.createOn("create", function (data) {
            this.data.name = data.name;
          });
          saga.on("something", function (data) {
            spy(this.data.name);
            if (data.id == 2) done();
          });
        });

        because: {
          emitter.emit("create", { id: 1, name: "test" });
          emitter.emit("create", { id: 2, name: "whut" });
          emitter.emit("something", { id: 1 });
          emitter.emit("something", { id: 2 });
        }
      });

      it("should get the same data object the second time with the same id", function () {
        sinon.assert.calledWith(spy, "test");
      });

      it("should get the same data object the second time with the same id", function () {
        sinon.assert.calledWith(spy, "whut");
      });
    });

    describe("complete a saga", function () {
      beforeEach(function (done) {
        spy = sinon.spy();
        new EventSaga(emitter, (saga) => {
          saga.createOn("create", function (data) {
            this.data.name = data.name;
          });
          saga.on("something", function (data) {
            spy(this.data.name);
          });
          saga.on("done", function (data) {
            this.done();
            done();
          });
        });

        because: {
          emitter.emit("create", { id: 1, name: "test" });
          emitter.emit("something", { id: 1 });
          emitter.emit("done", { id: 1 });
          emitter.emit("something", { id: 1 });
        }
      });

      it("should not react when the saga is completed", function () {
        sinon.assert.calledOnce(spy);
      });
    });
  });
});
