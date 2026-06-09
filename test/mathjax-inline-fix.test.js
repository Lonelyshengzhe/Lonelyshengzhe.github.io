const assert = require("assert");

let mathFix = {
  protectTexIdentifierUnderscores: function (value) {
    return value;
  },
};

try {
  mathFix = require("../assets/js/mathjax-inline-fix.js");
} catch (error) {
  // The test should fail by assertion before the helper exists.
}

const fix = mathFix.protectTexIdentifierUnderscores;

assert.strictEqual(
  fix("$\\gamma_{\\mathrm{homogeneous_DOS_calibrated}}(K)$"),
  "$\\gamma_{\\mathrm{homogeneous\\_DOS\\_calibrated}}(K)$"
);

assert.strictEqual(
  fix("$x_i + \\gamma_{\\mathrm{homogeneous_DOS}}$"),
  "$x_i + \\gamma_{\\mathrm{homogeneous\\_DOS}}$"
);

assert.strictEqual(
  fix("$\\gamma_{\\mathrm{homogeneous\\_DOS\\_raw}}(K)$"),
  "$\\gamma_{\\mathrm{homogeneous\\_DOS\\_raw}}(K)$"
);

assert.strictEqual(
  fix("$s_{\\mathrm{rad}}$"),
  "$s_{\\mathrm{rad}}$"
);

console.log("mathjax-inline-fix tests passed");
