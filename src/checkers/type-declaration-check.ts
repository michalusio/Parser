import { basicRuntimeTypes } from '../language/basic-runtime-types';
import {
  ASTStatement,
  FunctionDeclaration,
  LetStatement,
  ObjectDeclaration,
  Parameter,
  Property,
} from '../language/interfaces';



export function typeDeclarationCheckVisitor(): (node: ObjectDeclaration | LetStatement | FunctionDeclaration | Parameter | Property) => ASTStatement {
  const declaredTypes: string[] = [...basicRuntimeTypes];
  return (node: ObjectDeclaration | LetStatement | FunctionDeclaration | Parameter | Property): ASTStatement => {
      if (node.kind === 'object') {
        declaredTypes.push(node.name);
      }
      else if (!declaredTypes.includes(node.type)) throw new Error(`Type ${node.type} is not declared`);

      return node;
    }
}