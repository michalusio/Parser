import { anySmart, exhaust, expect, map, Parser, seq, wspaces } from '../parser/parser';
import { functionDeclaration } from './function-declaration';
import { Declaration, Program } from './interfaces';
import { objectDeclaration } from './object-declarations';

const declaration = (): Parser<Declaration> => anySmart(
  expect(objectDeclaration(), 'object declaration'),
  expect(functionDeclaration(), 'function declaration')
  );

export function program(): Parser<Program> {
    return map(exhaust(map(seq(wspaces, declaration(), wspaces), ([, dec,])=> dec)), (decs) => ({ kind: 'program', nodes: decs }));
}

