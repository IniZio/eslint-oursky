// https://github.com/eslint/eslint/issues/3458#issuecomment-516716165
/* eslint-disable */
const path = require('path');

let currentModule = module;
while (!/[\\/]eslint[\\/]lib[\\/]cli-engine[\\/]config-array-factory\.js/i.test(currentModule.filename)) {
  if (!currentModule.parent) {
    // This was tested with ESLint 6.1.0; other versions may not work
    throw new Error('Failed to patch ESLint because the calling module was not recognized');
  }
  currentModule = currentModule.parent;
}
const eslintFolder = path.join(path.dirname(currentModule.filename), '../..');

const configArrayFactoryPath = path.join(eslintFolder, "lib/cli-engine/config-array-factory");
const configArrayFactoryModule = require(configArrayFactoryPath);

const moduleResolverPath = path.join(eslintFolder, "lib/shared/relative-module-resolver");
const ModuleResolver = require(moduleResolverPath);

const originalLoadPlugin = configArrayFactoryModule.ConfigArrayFactory.prototype._loadPlugin;
configArrayFactoryModule.ConfigArrayFactory.prototype._loadPlugin = function(name, importerPath, importerName) {
  const originalResolve = ModuleResolver.resolve;
  try {
    ModuleResolver.resolve = function (moduleName, relativeToPath) {
      // resolve using importerPath instead of relativeToPath
      return originalResolve.call(this, moduleName, importerPath);
    };
    return originalLoadPlugin.apply(this, arguments);
  } finally {
    ModuleResolver.resolve = originalResolve;
  }
}
/* eslint-enable */

module.exports = {
  parser: "@typescript-eslint/parser",
  parserOptions: {
    sourceType: "module",
    project: "./tsconfig.json",
  },
  plugins: [
    "@typescript-eslint",
    "react",
    "react-hooks",
    "react-native",
  ],
  env: {
    browser: true,
    node: true,
    commonjs: true,
    jest: true,
    es6: true,
  },
  settings: {
    react: {
      // <></> is available from 16.2
      version: "16.2",
    },
    linkComponents: [
      {
        name: "Link",
        linkAttribute: "to",
      },
    ],
  },
  rules: {
    // picked from recommended
    // https://github.com/eslint/eslint/blob/master/conf/eslint-recommended.js
    "constructor-super": "error",
    "for-direction": "error",
    "getter-return": "error",
    "no-async-promise-executor": "error",
    "no-case-declarations": "error",
    "no-class-assign": "error",
    "no-compare-neg-zero": "error",
    "no-cond-assign": "error",
    "no-const-assign": "error",
    "no-constant-condition": ["error", {
      checkLoops: false,
    }],
    "no-control-regex": "error",
    "no-debugger": "error",
    "no-delete-var": "error",
    "no-dupe-args": "error",
    "no-dupe-class-members": "error",
    "no-dupe-keys": "error",
    "no-duplicate-case": "error",
    "no-empty-character-class": "error",
    "no-empty-pattern": "error",
    "no-ex-assign": "error",
    "no-extra-boolean-cast": "error",
    "no-fallthrough": ["error", {
      commentPattern: "fallthrough",
    }],
    "no-func-assign": "error",
    "no-global-assign": "error",
    "no-inner-declarations": "error",
    "no-invalid-regexp": "error",
    "no-misleading-character-class": "error",
    "no-new-symbol": "error",
    "no-obj-calls": "error",
    "no-octal": "error",
    "no-prototype-builtins": "error",
    "no-redeclare": "error",
    "no-regex-spaces": "error",
    "no-self-assign": "error",
    "no-shadow-restricted-names": "error",
    "no-sparse-arrays": "error",
    "no-this-before-super": "error",
    "no-undef": "error",
    "no-unexpected-multiline": "error",
    "no-unreachable": "error",
    "no-unsafe-finally": "error",
    "no-unsafe-negation": "error",
    "no-unused-labels": "error",
    "no-useless-catch": "error",
    "no-useless-escape": "error",
    "no-with": "error",
    "require-atomic-updates": "error",
    "use-isnan": "error",
    "valid-typeof": "error",
    // not from recommended
    // TODO: enable this when ESLint >= 6.4.0
    // "no-import-assign": "error",
    "no-template-curly-in-string": "error",
    "complexity": "error",
    "default-case": "error",
    "guard-for-in": "error",
    "no-caller": "error",
    "no-else-return": "error",
    "no-eval": "error",
    "no-extend-native": "error",
    "no-extra-bind": "error",
    "no-extra-label": "error",
    "no-floating-decimal": "error",
    "no-implied-eval": "error",
    "no-iterator": "error",
    "no-lone-blocks": "error",
    "no-loop-func": "error",
    "no-multi-str": "error",
    "no-new": "error",
    "no-new-func": "error",
    "no-new-wrappers": "error",
    "no-proto": "error",
    "no-return-assign": "error",
    "no-return-await": "error",
    "no-script-url": "error",
    "no-self-compare": "error",
    "no-sequences": "error",
    "no-throw-literal": "error",
    "no-unmodified-loop-condition": "error",
    "no-unused-expressions": "error",
    "no-useless-call": "error",
    "no-useless-concat": "error",
    "no-useless-return": "error",
    "no-void": "error",
    "prefer-promise-reject-errors": "error",
    "radix": "error",
    "no-label-var": "error",
    "no-undef-init": "error",
    "handle-callback-err": "error",
    "no-buffer-constructor": "error",
    "no-mixed-requires": "error",
    "no-new-require": "error",
    "no-path-concat": "error",
    "no-duplicate-imports": "error",
    "no-var": "error",
    "prefer-const": "error",
    "prefer-rest-params": "error",
    "prefer-spread": "error",
    "eqeqeq": ["error", "always", {
      null: "ignore"
    }],
    // typescript
    // picked from recommended
    "@typescript-eslint/adjacent-overload-signatures": "error",
    "@typescript-eslint/consistent-type-assertions": "error",
    "@typescript-eslint/no-array-constructor": "error",
    "@typescript-eslint/no-inferrable-types": ["error", {
      ignoreParameters: true,
      ignoreProperties: true,
    }],
    "@typescript-eslint/no-misused-new": "error",
    "@typescript-eslint/no-namespace": "error",
    "@typescript-eslint/no-this-alias": "error",
    "@typescript-eslint/no-unused-vars": ["error", {
      args: "all",
      ignoreRestSiblings: true,
      argsIgnorePattern: "^_",
    }],
    "@typescript-eslint/no-use-before-define": ["error", {
      functions: false,
      classes: true,
      variables: true,
      typedefs: false,
    }],
    "@typescript-eslint/triple-slash-reference": "error",
    "@typescript-eslint/await-thenable": "error",
    "@typescript-eslint/no-for-in-array": "error",
    "@typescript-eslint/no-misused-promises": "error",
    "@typescript-eslint/no-unnecessary-type-assertion": "error",
    "@typescript-eslint/prefer-regexp-exec": "error",
    "@typescript-eslint/unbound-method": ["error", {
      ignoreStatic: true,
    }],
    // not from recommended
    "@typescript-eslint/no-extraneous-class": "error",
    "@typescript-eslint/no-parameter-properties": "error",
    "@typescript-eslint/no-unnecessary-condition": ["error", {
      ignoreRhs: true,
    }],
    "@typescript-eslint/no-unnecessary-qualifier": "error",
    "@typescript-eslint/no-useless-constructor": "error",
    "@typescript-eslint/unified-signatures": "error",
    "@typescript-eslint/consistent-type-definitions": ["error", "interface"],
    "@typescript-eslint/no-floating-promises": "error",
    // This rule violates javascript idiom.
    // "@typescript-eslint/strict-boolean-expressions": ["error", {
    //   allowNullable: true,
    //   ignoreRhs: true,
    // }],
    // react-hooks
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "error",
    // react
    // picked from recommended
    "react/jsx-key": "error",
    "react/jsx-no-comment-textnodes": "error",
    "react/jsx-no-duplicate-props": "error",
    "react/jsx-no-target-blank": "error",
    "react/jsx-uses-react": "error",
    "react/jsx-uses-vars": "error",
    "react/no-children-prop": "error",
    "react/no-danger-with-children": "error",
    "react/no-deprecated": "error",
    "react/no-direct-mutation-state": "error",
    "react/no-find-dom-node": "error",
    "react/no-is-mounted": "error",
    "react/no-render-return-value": "error",
    "react/no-string-refs": "error",
    "react/no-unknown-property": "error",
    "react/react-in-jsx-scope": "error",
    "react/require-render-return": "error",
    // not from recommended
    "react/no-access-state-in-setstate": "error",
    "react/no-did-mount-set-state": "error",
    "react/no-did-update-set-state": "error",
    "react/no-redundant-should-component-update": "error",
    "react/no-typos": "error",
    "react/no-this-in-sfc": "error",
    "react/no-unescaped-entities": "error",
    "react/no-unsafe": "error",
    "react/no-unused-state": "error",
    "react/no-will-update-set-state": "error",
    "react/prefer-es6-class": "error",
    "react/prefer-stateless-function": "error",
    "react/style-prop-object": "error",
    "react/void-dom-elements-no-children": "error",
    "react/jsx-boolean-value": ["error", "always"],
    "react/jsx-fragments": "error",
    // react-native
    "react-native/no-unused-styles": "error",
  },
};
