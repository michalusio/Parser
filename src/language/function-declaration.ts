import { between, map, oneOrMany, opt, Parser, seq, spacesPlus, str, wspaces } from '../parser/parser';
import { functionName, functionReturnType, parameterName, parameterType } from './core';
import { FunctionDeclaration, Parameter } from './interfaces';
import { lines } from './statements/code-statements';

function parameter(): Parser<Parameter> {
  return map(seq(wspaces, parameterType, wspaces, parameterName, wspaces), ([, type, , name]) => ({ kind: 'parameter', name, type }));
}

const parameters = oneOrMany(parameter(), str(','));

export function functionDeclaration(): Parser<FunctionDeclaration> {
  return map(
      seq(
          functionReturnType,
          spacesPlus,
          functionName,
          wspaces,
          between(str('('), opt(parameters), str(')')),
          wspaces,
          between(seq(wspaces, str('{')), lines, seq(wspaces, str('}')))
      ),
      ([type, , name, , params, , lines]) => ({kind: 'function', type, name, params: params ?? [], body: lines})
  );
}