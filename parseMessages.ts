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

    const ir = inspectMessages(makeMessagesCallNode);
    console.log(ir);
  }
}

type TypeID = string;

type MessageData = {
  id: string;
  defaultMessage: string;
  params: {
    name: string;
    types: TypeID[];
  }[];
};

function inspectMessages(node: ts.CallExpression): MessageData[] {
  function typeIdFromNode(typeNode?: ts.Node): string {
    if (typeNode?.kind == ts.SyntaxKind.BooleanKeyword) {
      return 'boolean';
    } else if (typeNode?.kind == ts.SyntaxKind.NumberKeyword) {
      return 'number';
    } else if (typeNode?.kind == ts.SyntaxKind.StringKeyword) {
      return 'string';
    } else if (typeNode?.kind == ts.SyntaxKind.NullKeyword) {
      return 'null';
    } else if (typeNode?.kind == ts.SyntaxKind.UndefinedKeyword) {
      return 'undefined';
    } else if (typeNode?.kind == ts.SyntaxKind.TypeReference) {
      const refNode = typeNode as ts.TypeReferenceNode;
      const idNode = refNode.typeName as ts.Identifier;
      return idNode.text;
    } else {
      return 'unknown';
    }
  }

  function traverse(
    prefix: string,
    curNode: ts.Node,
    output: MessageData[] = []
  ): MessageData[] {
    if (curNode.kind == ts.SyntaxKind.ObjectLiteralExpression) {
      const objNode = curNode as ts.ObjectLiteralExpression;
      objNode.properties.forEach((propNode) => {
        const assignmentNode = propNode as ts.PropertyAssignment;
        const nameNode = assignmentNode.name as ts.Identifier;
        const id = `${prefix}.${nameNode.escapedText}`;

        if (
          assignmentNode.initializer.kind ==
          ts.SyntaxKind.ObjectLiteralExpression
        ) {
          traverse(id, assignmentNode.initializer, output);
        } else if (
          assignmentNode.initializer.kind == ts.SyntaxKind.CallExpression
        ) {
          const callNode = assignmentNode.initializer as ts.CallExpression;
          const argNode = callNode.arguments[0] as ts.StringLiteral;

          output.push({
            defaultMessage: argNode.text,
            id: id,
            params:
              callNode.typeArguments?.map((typeArg) => {
                const typeNode = typeArg as ts.TypeLiteralNode;
                const memberNode = typeNode.members[0] as ts.PropertySignature;
                const typeIdNode = memberNode.name as ts.Identifier;
                if (memberNode.type?.kind == ts.SyntaxKind.UnionType) {
                  const unionNode = memberNode.type as ts.UnionTypeNode;
                  return {
                    name: typeIdNode.text,
                    types: unionNode.types.map((typeNode) =>
                      typeIdFromNode(typeNode)
                    ),
                  };
                } else {
                  return {
                    name: typeIdNode.text,
                    types: [typeIdFromNode(memberNode.type)],
                  };
                }
              }) ?? [],
          });
        }
      });
    }
    return output;
  }

  const prefixArg = node.arguments[0] as ts.StringLiteral;
  const output = traverse(prefixArg.text, node.arguments[1]);

  return output;
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
