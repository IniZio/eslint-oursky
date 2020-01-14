import { ESLintUtils } from '@typescript-eslint/experimental-utils';

export const createRule = ESLintUtils.RuleCreator(
  name =>
    `https://github.com/oursky/eslint-oursky/blob/master/docs/rules/${name}.md`,
);
