import {
  TSESTree, AST_NODE_TYPES,
} from '@typescript-eslint/experimental-utils';
import { Scope } from '@typescript-eslint/experimental-utils/dist/ts-eslint';

import * as util from '../util';

export default util.createRule({
  name: 'no-scrollTo',
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Discourage scrollTo function due to incompatitability in browsers',
      category: 'Possible Errors' as const,
      recommended: 'error' as const,
    },
    schema: [],
    messages: {
      'scrollTo-found': 'scrollTo is not well supported, use scrollTop instead'
    }
  },
  defaultOptions: [],
  create(context) {
    const globalScope = context.getScope();
    const windowVariable = util.getVariableByName(globalScope, 'window');

    // Only enforce under browser environment
    if (!windowVariable) {
        return {};
    }

    function report(node: TSESTree.Node) {
        const parent = node.parent!;
        const locationNode = node.type === AST_NODE_TYPES.MemberExpression
            ? node.property
            : node;

        const reportNode = parent.type === AST_NODE_TYPES.CallExpression && parent.callee === node
            ? parent
            : node;

        context.report({
            node: reportNode,
            loc: locationNode.loc.start,
            messageId: 'scrollTo-found',
        });
    }

    // window.scrollTo()
    function reportWindowScrollTo(windowVariable: Scope.Variable) {
        for (const reference of windowVariable.references) {
            const identifier = reference.identifier;
            let node = identifier.parent!;

            while (util.isMember(node, 'window')) {
                node = node.parent!;
            }

            if (util.isMember(node, 'scrollTo')) {
                report(node);
            }
        }
    }

    // assigning scrollTo to other variables
    function reportGlobalScrollTo(globalScope: Scope.Scope) {
        const variable = util.getVariableByName(globalScope, 'scrollTo');

        if (!variable) {
            return;
        }

        for (const reference of variable.references) {
            const id = reference.identifier;

            if (id.name === 'scrollTo' && !util.isCallee(id)) {
                report(id);
            }
        }
    }

    return {
        // scrollTo()
        CallExpression(node: TSESTree.CallExpression) {
            const callee = node.callee;

            if (util.isIdentifier(callee, 'scrollTo')) {
                report(callee);
            }
        },

        Program() {
            reportGlobalScrollTo(globalScope);
            reportWindowScrollTo(windowVariable);
        },
    };

} 
})
