import { ASTStatement } from '../language/interfaces';
import { visitTable } from '../visitor';
import { typeDeclarationCheckVisitor } from './type-declaration-check';

export function check(root: ASTStatement): ASTStatement {
  return visitTable(['object', 'let', 'function', 'parameter', 'property'], typeDeclarationCheckVisitor(), root, undefined);
}