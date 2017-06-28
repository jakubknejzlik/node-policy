const assert = require("assert");

class Policy {
  constructor() {
    this.rules = [];
  }

  _regexFromPattern(pattern) {
    assert.equal(
      typeof pattern,
      "string",
      `pattern must be string (${typeof pattern} '${pattern}' provided)`
    );
    return new RegExp(`${pattern.replace(/\*/, ".*")}`);
  }

  _addRule(rule, participantPatterns, resourcePatterns, actionPatterns) {
    assert.ok(
      ["allow", "deny"].indexOf(rule) !== -1,
      `rule must be allow or deny ('${rule}' provided)`
    );
    assert.ok(
      participantPatterns,
      `participant pattern must be specified ('${participantPatterns}' provided)`
    );
    assert.ok(
      resourcePatterns,
      `resource pattern must be specified ('${resourcePatterns}' provided)`
    );
    assert.ok(
      actionPatterns,
      `action pattern must be specified ('${actionPatterns}' provided)`
    );

    if (!Array.isArray(participantPatterns))
      participantPatterns = [participantPatterns];
    if (!Array.isArray(resourcePatterns)) resourcePatterns = [resourcePatterns];
    if (!Array.isArray(actionPatterns)) actionPatterns = [actionPatterns];

    this.rules.push({
      rule: rule,
      participants: participantPatterns.map(pattern => {
        return this._regexFromPattern(pattern);
      }),
      resources: resourcePatterns.map(pattern => {
        return this._regexFromPattern(pattern);
      }),
      actions: actionPatterns.map(pattern => {
        return this._regexFromPattern(pattern);
      })
    });
  }

  _isMatch(tests, value) {
    for (let i in tests) {
      const test = tests[i];
      if (test.test(value)) return true;
    }
    return false;
  }

  /**
  * return: true for allow, false for deny and null if no rule is matched
  */

  _checkRule(rule, participant, resource, action) {
    const isMatch =
      this._isMatch(rule.participants, participant) &&
      this._isMatch(rule.resources, resource) &&
      this._isMatch(rule.actions, action);
    if (isMatch) {
      return rule.rule === "allow";
    }
    return null;
  }

  allow(participantPatterns, resourcePatterns, actionPatterns) {
    this._addRule(
      "allow",
      participantPatterns,
      resourcePatterns,
      actionPatterns
    );
  }

  deny(participantPatterns, resourcePatterns, actionPatterns) {
    this._addRule(
      "deny",
      participantPatterns,
      resourcePatterns,
      actionPatterns
    );
  }

  // note: denial has preference before allowance
  isAllowed(participant, resource, action) {
    let isAllowed = false;
    for (let ruleIndex in this.rules) {
      let rule = this.rules[ruleIndex];

      let match = this._checkRule(rule, participant, resource, action);
      if (match === true) {
        isAllowed = true;
      } else if (match === false) {
        return false;
      }
    }
    return isAllowed;
  }

  append(policy) {
    assert.ok(
      policy instanceof Policy,
      `appended policy must be instance of Policy ('${typeof policy}' provided)`
    );

    let newPolicy = new Policy();

    this.rules = this.rules.concat(policy.rules);
  }
}

module.exports = Policy;
