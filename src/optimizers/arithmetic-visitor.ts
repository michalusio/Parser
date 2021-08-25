import { ArithmeticStatement, ASTStatement } from '../language/interfaces';

const operators = {
  '+': (x: number, y: number): number => x + y,
  '-': (x: number, y: number): number => x - y,
  '*': (x: number, y: number): number => x * y,
  '/': (x: number, y: number): number => x / y,
};

export function arithmeticVisitor(node: ArithmeticStatement): ASTStatement {
  if ((node.left.kind === 'intValue' || node.left.kind === 'realValue') && (node.right.kind === 'intValue' || node.right.kind === 'realValue')) {
    let kind: 'realValue' | 'intValue' = 'realValue';
    if (node.left.kind === 'intValue' && node.right.kind === 'intValue') {
      kind = node.operator === '/' ? 'realValue' : 'intValue';
    }
    return {
      kind,
      value: operators[node.operator](node.left.value, node.right.value),
    };
  }
  if (node.left.kind === 'stringValue' && node.right.kind === 'stringValue' && node.operator === '+') {
    return {
      kind: 'stringValue',
      value: node.left.value + node.right.value,
    };
  }
  return node;
}