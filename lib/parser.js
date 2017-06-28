const assert = require("assert");
const fs = require("fs");

const Policy = require("./policy");

const fromString = source => {
  const rules = JSON.parse(source);

  assert.ok(rules instanceof Array, "policy source must be array");

  let pol = new Policy();

  rules.forEach(rule => {
    let participants = rule.participants || [rule.participant];
    let resources = rule.resources || [rule.resource];
    let actions = rule.actions || [rule.action];
    pol._addRule(rule.rule, participants, resources, actions);
  });

  return pol;
};

const fromFile = filepath => {
  const content = fs.readFileSync(filepath, "utf-8");
  return fromString(content);
};

module.exports = {
  fromString,
  fromFile
};
