import { ASTStatement } from '../language/interfaces';
import { arithmeticVisitor } from './arithmetic-visitor';
import { visit } from './visitor';

export function optimize(root: ASTStatement): ASTStatement {
  return visit('arithmetic', arithmeticVisitor, root, undefined);
}