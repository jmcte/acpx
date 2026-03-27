import assert from "node:assert/strict";
import test from "node:test";
import { coerceProtocolVersion } from "../src/session-runtime/lifecycle.js";

test("coerceProtocolVersion returns number as-is", () => {
  assert.equal(coerceProtocolVersion(1), 1);
  assert.equal(coerceProtocolVersion(2), 2);
  assert.equal(coerceProtocolVersion(1.5), 1.5);
});

test("coerceProtocolVersion parses string-encoded numbers", () => {
  assert.equal(coerceProtocolVersion("1"), 1);
  assert.equal(coerceProtocolVersion("1.0"), 1);
  assert.equal(coerceProtocolVersion("2"), 2);
});

test("coerceProtocolVersion returns undefined for non-numeric values", () => {
  assert.equal(coerceProtocolVersion(undefined), undefined);
  assert.equal(coerceProtocolVersion(null), undefined);
  assert.equal(coerceProtocolVersion(""), undefined);
  assert.equal(coerceProtocolVersion("abc"), undefined);
  assert.equal(coerceProtocolVersion(NaN), undefined);
  assert.equal(coerceProtocolVersion(Infinity), undefined);
  assert.equal(coerceProtocolVersion({}), undefined);
});
