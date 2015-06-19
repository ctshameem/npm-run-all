import assert from "power-assert";
import {result, removeResult} from "./lib/util";

// Test targets.
import runAll from "../src/index";
import command from "../src/command";

describe("npm-run-all", () => {
  beforeEach(removeResult);
  after(removeResult);

  describe("should run tasks on parallel when was given --parallel option:", () => {
    it("lib version", () => {
      return runAll(["test-task:append a", "test-task:append b"], {parallel: true})
        .then(() => {
          assert(
            result() === "abab" ||
            result() === "baba" ||
            result() === "abba" ||
            result() === "baab");
        });
    });

    it("command version", () => {
      return command(["--parallel", "test-task:append a", "test-task:append b"])
        .then(() => {
          assert(
            result() === "abab" ||
            result() === "baba" ||
            result() === "abba" ||
            result() === "baab");
        });
    });
  });

  describe("should kill all tasks when was given --parallel option if a task exited with non-zero code:", () => {
    it("lib version", () => {
      return runAll(["test-task:append2 a", "test-task:error"], {parallel: true})
        .then(
          () => {
            assert(false, "should fail");
          },
          () => {
            assert(result() == null || result() === "a");
          });
    });

    it("command version", () => {
      return command(["--parallel", "test-task:append2 a", "test-task:error"])
        .then(
          () => {
            assert(false, "should fail");
          },
          () => {
            assert(result() == null || result() === "a");
          });
    });
  });
});
