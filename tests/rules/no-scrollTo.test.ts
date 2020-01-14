import rule from '../../plugin/rules/no-scrollTo';
import { RuleTester } from '../RuleTester';
import { AST_NODE_TYPES } from '@typescript-eslint/experimental-utils';

const ruleTester = new RuleTester({
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './tsconfig.json',
  }
});

ruleTester.run('no-scrollTo', rule, {
  valid: [
    // Should be case-sensitive
    {
      code: 'ScrollTo();',
      env: { browser: true },
    },
    // Non-browser env
    'scrollTo();',
    {
      code: 'this.scrollTo()',
      env: { browser: false },
    },
  ],
  invalid: [
    // Apply/bind/call
    {
      code: 'scrollTo.call(this);',
      env: { browser: true },
      errors: [
        {
          messageId: 'scrollTo-found',
          type: AST_NODE_TYPES.Identifier,
          line: 1,
          column: 1,
        }
      ]
    }, 
    // Assign scrollTo to other variables
    {
      code: 'var SCROLLTO = scrollTo; SCROLLTO();',
      env: { browser: true },
      errors: [
        {
          messageId: 'scrollTo-found',
          type: AST_NODE_TYPES.Identifier,
          line: 1,
          column: 16,
        }
      ],
    },
    {
      code: 'window.scrollTo();',
      env: { browser: true },
      errors: [
        {
          messageId: 'scrollTo-found',
          data: { type: 'string' },
          line: 1,
          column: 8,
        },
      ]
    },
    {
      code: 'scrollTo();',
      env: { browser: true },
      errors: [
        {
          messageId: 'scrollTo-found',
          data: { type: 'string' },
          line: 1,
          column: 1,
        },
      ]
    }
  ],
});
