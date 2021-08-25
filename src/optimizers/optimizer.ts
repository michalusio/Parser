import { ASTStatement } from '../language/interfaces';
import { visit } from '../visitor';
import { arithmeticVisitor } from './arithmetic-visitor';

export function optimize(root: ASTStatement): ASTStatement {
  return visit('arithmetic', arithmeticVisitor, root, undefined);
}