// Run with yarn ts-node parseMessages.ts

import * as ts from 'typescript';

const fileName = 'src/features/tags/l10n/messageIds.ts';

const fullProgram = ts.createProgram([fileName], {});
const file = fullProgram.getSourceFile(fileName);

if (file) {
  // TODO: Look at identifiers and bail if unsafe

  const makeMessagesCallNode = findMakeMessages(file);

  if (makeMessagesCallNode) {
    const messageMap = evalMessages(makeMessagesCallNode, file);
    console.log(messageMap);
  }
}

function findMakeMessages(curNode: ts.Node): ts.CallExpression | undefined {
  if (curNode.kind == ts.SyntaxKind.CallExpression) {
    const callNode = curNode as ts.CallExpression;
    const expr = callNode.expression as ts.Identifier;
    if (expr.escapedText == 'makeMessages') {
      return callNode;
    }
  }

  let found: ts.CallExpression | undefined;

  curNode.forEachChild((child) => {
    if (!found) {
      found = findMakeMessages(child);
    }
  });

  return found;
}

function evalMessages(node: ts.Node, file: ts.SourceFile) {
  const printer = ts.createPrinter();
  // Create cleanCode that only uses allowed imports
  const cleanCode =
    `import { m, makeMessages } from 'core/i18n';` +
    printer.printNode(ts.EmitHint.Unspecified, node, file);
  const js = ts.transpile(cleanCode);
  return eval(js);
}
