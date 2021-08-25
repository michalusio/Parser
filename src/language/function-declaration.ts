import { between, map, oneOrMany, opt, Parser, seq, spacesPlus, str } from '../parser/parser';
import { functionName, functionReturnType, parameterName, parameterType, wspacesOrComment } from './core';
import { FunctionDeclaration, Parameter } from './interfaces';
import { scope } from './statements/code-statements';

function parameter(): Parser<Parameter> {
  return map(seq(wspacesOrComment, parameterType, wspacesOrComment, parameterName, wspacesOrComment), ([, type, , name]) => ({ kind: 'parameter', name, type }));
}

const parameters = oneOrMany(parameter(), str(','));

export function functionDeclaration(): Parser<FunctionDeclaration> {
  return map(
      seq(
          functionReturnType,
          spacesPlus,
          functionName,
          wspacesOrComment,
          between(str('('), opt(parameters), str(')')),
          wspacesOrComment,
          scope()
      ),
      ([type, , name, , params, , scope]) => ({kind: 'function', type, name, params: params ?? [], body: scope})
  );
}