const assert = require("assert");

let checklist = {};

try {
  checklist = require("../assets/js/checklist-progress.js");
} catch (error) {
  // The assertions below should fail until the helper exists.
}

assert.strictEqual(
  checklist.taskId("  确认   BRP 已成功注销  "),
  checklist.taskId("确认 BRP 已成功注销")
);

const ids = ["a1", "b2", "z9"];
assert.deepStrictEqual(checklist.decodeState(checklist.encodeState(ids)), ids);
assert.deepStrictEqual(checklist.decodeState("#checklist="), []);
assert.strictEqual(checklist.decodeState("#section-heading"), null);
assert.strictEqual(checklist.decodeState("#checklist=broken!"), null);

console.log("checklist-progress tests passed");
