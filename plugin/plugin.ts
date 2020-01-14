import noScrollTo from './rules/no-scrollTo';

export const rules = {
  'no-scrollTo': noScrollTo,
}

export const configs = {
  recommended: {
    rules: {
      'no-scrollTo': 'error',
    }
  }
}

const plugin = {
  rules,
  configs,
};

export default plugin

module.exports = plugin;
