import { any, exhaust, expect, map, opt, Parser, seq, str, wspaces } from '../../parser/parser';
import { variableName, variableType } from '../core';
import { AssignmentStatement, LetStatement, Statement } from '../interfaces';
import { lStatement, methodCall, rStatement } from './statements';

function letStatement(): Parser<LetStatement> {
  return expect(
    map(
      seq(variableType, wspaces, variableName, opt(seq(wspaces, str('='), wspaces, rStatement()))),
      ([type, , name, assignment]) => ({
        kind: 'let',
        name,
        type,
        assignment: assignment ? assignment[3] : undefined
      })
    ),
    'let statement'
  );
}

function assignmentStatement(): Parser<AssignmentStatement> {
  return expect(
    map(seq(lStatement(), wspaces, str('='), wspaces, rStatement()), ([ls,,,, rs]) => ({kind: 'assignment', to: ls, value: rs})),
    'assignment'
  );
}

function statement(): Parser<Statement> {
  return expect(
    any(assignmentStatement(), letStatement(), methodCall()),
    'statement'
  );
}

const line = map(seq(wspaces, statement(), str(';')), ([,statement,]) => statement);

export const lines = expect(exhaust(line, seq(wspaces, str('}'))), 'function lines');
