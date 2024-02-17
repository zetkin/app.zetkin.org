const is3rdParty = require('./utils/is-3rd-party');

/**
 * @type {import('eslint').Rule.RuleModule}
 */
module.exports = {
  meta: {
    docs: {
      description: 'Enforce importing 3rd party code first',
      category: 'Possible Errors',
      recommended: false,
    },
    schema: [],
    fixable: 'code',
  },
  create: function (ctx) {
    return {
      Program: (node) => {
        const { body } = node;
        // ----- First we make sure that we don't mix code between imports ---
        const firstCodeIdx = body.findIndex(
          (n) => n.type !== 'ImportDeclaration'
        );
        if (firstCodeIdx !== -1) {
          const trailingImport = body
            .slice(firstCodeIdx)
            .find((n) => n.type === 'ImportDeclaration');
          if (trailingImport) {
            return ctx.report({
              node: body[firstCodeIdx],
              message: "Don't mix code between imports",
            });
          }
        }

        // ----- Next we ensure that the 3rd party imports come first ---

        const imports = body.filter((n) => n.type === 'ImportDeclaration');
        const firstLocalIdx = imports.findIndex(
          (n) => !is3rdParty(n.source.value)
        );
        if (firstLocalIdx !== -1) {
          const trailing3rd = imports
            .slice(firstLocalIdx)
            .find((n) => is3rdParty(n.source.value));
          if (trailing3rd) {
            return ctx.report({
              node: trailing3rd,
              message: "Don't do 3rd party imports after local imports",
              fix: (fixer) => {
                const code = ctx.getSourceCode().getText(trailing3rd);
                const priorNode = imports[imports.indexOf(trailing3rd) - 1];
                const blankLineBefore =
                  trailing3rd.range[0] - priorNode.range[1] > 1;
                const firstLocal = imports[firstLocalIdx];
                const lastLegal3rd = imports[firstLocalIdx - 1];
                const firstLocalHasPreceedingBlank =
                  lastLegal3rd &&
                  firstLocal.range[0] - lastLegal3rd.range[1] > 1;
                const fixes = [
                  fixer.removeRange([
                    trailing3rd.range[0] - (blankLineBefore ? 1 : 0),
                    trailing3rd.range[1] + 1, // assume there's a linebreak here
                  ]),
                  firstLocalIdx === 0
                    ? fixer.insertTextBefore(firstLocal, code + '\n\n')
                    : fixer.insertTextAfter(
                        lastLegal3rd,
                        '\n' + code + (firstLocalHasPreceedingBlank ? '' : '\n')
                      ),
                ];
                return fixes;
              },
            });
          }
        }

        // ----- Now we check that there is a blank line between 3rd party and local imports ---

        if (firstLocalIdx > 0) {
          const lastThirdParty = imports[firstLocalIdx - 1];
          const firstLocal = imports[firstLocalIdx];
          if (firstLocal.range[0] - lastThirdParty.range[1] === 1) {
            ctx.report({
              node: firstLocal,
              message:
                'No blank line between 3rd party imports and local imports',
              fix: (fixer) => fixer.insertTextAfter(lastThirdParty, '\n'),
            });
          }
        }
      },
    };
  },
};
