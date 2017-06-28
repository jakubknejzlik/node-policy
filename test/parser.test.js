const assert = require("assert");
const path = require("path");
const parser = require("../").parser;

describe("parser", () => {
  it("should load and validate policy", () => {
    let policy = parser.fromFile(path.join(__dirname, "/example.policy.json"));
    assert.ok(policy.isAllowed("customer", "cars", "buy"));
  });
});
