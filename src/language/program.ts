import { anySmart, exhaust, expect, map, Parser, seq } from '../parser/parser';
import { wspacesOrComment } from './core';
import { functionDeclaration } from './function-declaration';
import { Declaration, Program } from './interfaces';
import { objectDeclaration } from './object-declarations';

const declaration = (): Parser<Declaration> => anySmart(
  expect(objectDeclaration(), 'object declaration'),
  expect(functionDeclaration(), 'function declaration')
  );

export function program(): Parser<Program> {
    return map(exhaust(map(seq(wspacesOrComment, declaration(), wspacesOrComment), ([, dec,])=> dec)), (decs) => ({ kind: 'program', nodes: decs }));
}

