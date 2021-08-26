import {
  anySmart,
  Context,
  exhaust,
  expect,
  isFailure,
  many,
  map,
  Parse,
  Parser,
  Result,
  seq,
  str,
  wspaces,
} from '../parser/parser';
import { wspacesOrComment } from './core';
import { functionDeclaration } from './function-declaration';
import { Declaration, ImportDeclaration, Program } from './interfaces';
import { objectDeclaration } from './object-declarations';
import { stringStatement } from './statements/statements';

const declaration = (): Parser<Declaration> => anySmart(
  expect(objectDeclaration(), 'object declaration'),
  expect(functionDeclaration(), 'function declaration')
  );

function importDeclaration(): Parser<ImportDeclaration> {
  return (ctx: Context): Result<ImportDeclaration> => {
    const res = map(
      seq(str('import'), wspaces, stringStatement, str(';'), wspacesOrComment),
      ([,, path]) => ({ kind: 'import', path: path.value, node: {} as Program })
    )(ctx);
    if (isFailure(res)) return res;
    let res2 = getFromCache(res.value.path);
    if (!res2) {
      console.log(`Parsing ${res.value.path}`);
      res2 = Parse(res.value.path, program());
    }
    else {
      console.log(`File ${res.value.path} found in cache`);
    }
    setToCache(res.value.path, res2);
    return { ...res, value: { ...res.value, kind: 'import', node: res2 } };
  }
}

const parseCache: Map<string, Program> = new Map();

export function clearParseCache(): void {
    parseCache.clear();
}

function getFromCache(path: string): Program | undefined {
    return parseCache.get(path);
}

function setToCache(path: string, program: Program): void {
    parseCache.set(path, program);
}

export function program(): Parser<Program> {
  return map(
    seq(
      wspacesOrComment,
      many(importDeclaration()),
      exhaust(map(seq(wspacesOrComment, declaration(), wspacesOrComment), ([, dec,])=> dec)),
    ),
    ([, imports, decs]) => ({ kind: 'program', imports, nodes: decs })
  );
}