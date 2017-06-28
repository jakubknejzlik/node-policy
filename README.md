# policy

[![Build Status](https://travis-ci.org/jakubknejzlik/node-policy.svg?branch=master)](https://travis-ci.org/jakubknejzlik/node-policy)

Library for controlling access to resources with policy documents. Inspired by AWS IAM policies.

# Installation

```
npm install --save policy
```

In your source code use:
```
const Policy = require('policy').Policy
const policyParser = require('policy').parser

let policy1 = new Policy()
let policy2 = policyParser.fromFile(...)
let policy3 = policyParser.fromString(...)
```

For example how to format policy document see [json example file](https://github.com/jakubknejzlik/node-policy/blob/master/test/example.policy.json)

# Example

```
let policy = new Policy()

policy.allow("customer", "cars", "buy")
policy.allow("seller", "cars", ["buy","sell"])

policy.isAllowed("customer", "cars", "buy") // true
policy.isAllowed("customer", "cars", "sell") // false
policy.isAllowed("seller", "cars", "buy") // true
policy.isAllowed("seller", "cars", "sell") // true
policy.isAllowed("seller", "cars", "destroy") // false
policy.isAllowed("seller", "vans", "buy") // false

```

## Wildcards
You can also use wildcards:
```
let policy = new Policy()

policy.allow("a_*", ["b_*","d_*"], "c_*")

policy.isAllowed("a_anything", "b_anything", "c_anything") // true
policy.isAllowed("a_anything", "c_anything", "c_anything") // false
policy.isAllowed("a_anything", "d_anything", "c_anything") // true
```

## Deny
Some resources/actions can be denied. Denial has preference before allowance:
```
let policy = new Policy();

policy.allow("*", "*", "*")
policy.deny("guest", "secret", "*")

policy.isAllowed("user", "blah", "read") // true
policy.isAllowed("guest", "blah", "write") // true
policy.isAllowed("guest", "secret", "any") // false
```
