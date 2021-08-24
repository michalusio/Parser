import { ASTStatement } from '../language/interfaces';

type Indexable = {
  [key: string]: unknown;
}

function isASTNode(obj: unknown): obj is ASTStatement {
  return obj !== null
      && obj !== undefined
      && (typeof obj === 'object')
      && (obj as ASTStatement).kind !== null
      && (obj as ASTStatement).kind !== undefined;
}

type ConcreteASTStatement<T extends ASTStatement['kind']> = Extract<ASTStatement, { kind: T }>;

export type Visitor<T extends ASTStatement['kind']> = (node: ConcreteASTStatement<T>, parent: ASTStatement | undefined) => ASTStatement;

export function visit<T extends ASTStatement['kind']>(kind: T, fn: Visitor<T>, node: ASTStatement, parent: ASTStatement | undefined): ASTStatement {
  for(const key in node) {
    const value = (node as Indexable)[key];
    if (Array.isArray(value) && value.length > 0) {
      const modifiedValue = value.map(v => isASTNode(v) ? visit(kind, fn, v, node) : v);
      (node as Indexable)[key] = modifiedValue;
    }
    if (isASTNode(value)) {
      const modifiedValue = visit(kind, fn, value, node);
      (node as Indexable)[key] = modifiedValue;
    }
  }
  if (node.kind === kind) return fn(node as ConcreteASTStatement<T>, parent);
  return node;
}