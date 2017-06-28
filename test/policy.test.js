const assert = require("assert");
const policyicy = require("../").Policy;

describe("policy", () => {
  it("should validate simple rules", () => {
    let policyicy = new Policy();
    policy.allow("customer", "cars", "buy");
    policy.allow("seller", "cars", "buy");
    policy.allow("seller", "cars", "sell");

    assert.ok(policy.isAllowed("customer", "cars", "buy"));
    assert.ok(!policy.isAllowed("customer", "cars", "sell"));
    assert.ok(policy.isAllowed("seller", "cars", "buy"));
    assert.ok(policy.isAllowed("seller", "cars", "sell"));
    assert.ok(!policy.isAllowed("seller", "cars", "destroy"));
    assert.ok(!policy.isAllowed("seller", "vans", "buy"));
  });

  it("should validate array of rules", () => {
    let policyicy = new Policy();
    policy.allow("customer", "cars", ["buy"]);
    policy.allow("seller", ["cars", "vans"], ["buy", "sell"]);

    assert.ok(policy.isAllowed("customer", "cars", "buy"));
    assert.ok(!policy.isAllowed("customer", "cars", "sell"));
    assert.ok(policy.isAllowed("seller", "cars", "buy"));
    assert.ok(policy.isAllowed("seller", "cars", "sell"));
    assert.ok(!policy.isAllowed("seller", "cars", "destroy"));
    assert.ok(policy.isAllowed("seller", "vans", "buy"));
    assert.ok(!policy.isAllowed("seller", "trucks", "buy"));
  });

  it("should validate wildcards rules", () => {
    let policyicy = new Policy();

    policy.allow("seller", ["cars"], "*");
    policy.allow("seller", ["vans"], "hit-with-*");

    assert.ok(policy.isAllowed("seller", "cars", "buy"));
    assert.ok(policy.isAllowed("seller", "cars", "sell"));
    assert.ok(policy.isAllowed("seller", "cars", "destroy"));
    assert.ok(policy.isAllowed("seller", "vans", "hit-with-bat"));
    assert.ok(!policy.isAllowed("seller", "vans", "hit-without-bat"));
  });

  it("should validate allow all", () => {
    let policyicy = new Policy();

    policy.allow("*", "*", "*");

    assert.ok(policy.isAllowed("a", "b", "c"));
  });

  it("should validate allow all with prefixes", () => {
    let policyicy = new Policy();

    policy.allow("a_*", "b_*", "c_*");

    assert.ok(policy.isAllowed("a_anything", "b_anything", "c_anything"));
    assert.ok(!policy.isAllowed("a_anything", "c_anything", "c_anything"));
  });

  it("should validate various wildcards", () => {
    let policyicy = new Policy();

    policy.allow("admin_*", "something_*", "hold_*");
    policy.deny("admin_john", "something_*", "hold_it");

    assert.ok(policy.isAllowed("admin_john", "something_abc", "hold_aaa"));
    assert.ok(!policy.isAllowed("admin_john", "something_aaa", "hold_it"));
    assert.ok(!policy.isAllowed("aaa", "bbb", "ccc"));
  });

  it("should prefer deny", () => {
    let policyicy = new Policy();

    policy.allow("*", "*", "*");
    policy.deny("guest", "secret", "*");

    assert.ok(policy.isAllowed("user", "blah", "read"));
    assert.ok(policy.isAllowed("guest", "blah", "write"));
    assert.ok(!policy.isAllowed("guest", "secret", "any"));
  });

  it("should not allow invalid pattern", () => {
    let policyicy = new Policy();
    assert.throws(() => {
      policy.allow();
    });
    assert.throws(() => {
      policy.allow("seller", [1], "*");
    });
    assert.throws(() => {
      policy.allow("seller", [undefined], "*");
    });
    assert.throws(() => {
      policy.allow("seller", [null], "*");
    });
  });

  describe("append", () => {
    it("should append two policy", () => {
      let policyicy = new Policy();
      policy.allow("*", "*", "*");
      let policyicy2 = new Policy();
      policy2.deny("guest", "secret", "*");

      policy.append(policy2);

      assert.ok(policy.isAllowed("user", "blah", "read"));
      assert.ok(policy.isAllowed("guest", "blah", "write"));
      assert.ok(!policy.isAllowed("guest", "secret", "any"));
    });
  });
});
