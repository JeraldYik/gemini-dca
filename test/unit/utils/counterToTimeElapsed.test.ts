import counterToTimeElapsed from "../../../src/utils/counterToTimeElapsed";
import { expect } from "chai";

describe("UNIT TEST: counterToTimeElapsed method", async () => {
  const EXTERNAL_LOOP_COUNTERS = [0, 9];
  const EXTERNAL_LOOP_INTERVAL = 60; // 60 minutes
  const INTERNAL_LOOP_COUNTERS = [0, 1, 118, 119];
  const INTERNAL_LOOP_INTERVAL = 30; // 30 seconds
  const EXPECTED_RESULTS = [
    "00:00:00",
    "00:00:30",
    "00:59:00",
    "00:59:30",
    "09:00:00",
    "09:00:30",
    "09:59:00",
    "09:59:30",
  ];

  it("counterToTimeElapsed method should produce correct time string", async () => {
    EXTERNAL_LOOP_COUNTERS.forEach((externalLoopCounter, externalLoopIndex) => {
      INTERNAL_LOOP_COUNTERS.forEach(
        (internalLoopCounter, internalLoopIndex) => {
          const timeString = counterToTimeElapsed(
            externalLoopCounter,
            EXTERNAL_LOOP_INTERVAL,
            internalLoopCounter,
            INTERNAL_LOOP_INTERVAL
          );
          expect(timeString).to.be.eql(
            EXPECTED_RESULTS[externalLoopIndex * 4 + internalLoopIndex]
          );
        }
      );
    });
  });
});
