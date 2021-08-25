import { any, between, Context, exhaust, expect, map, opt, Parser, Result, seq, str } from '../../parser/parser';
import { variableName, variableType, wspacesOrComment } from '../core';
import { AssignmentStatement, IfElseStatement, LetStatement, Scope, Statement } from '../interfaces';
import { lStatement, methodCall, rStatement } from './statements';

function letStatement(): Parser<LetStatement> {
  return expect(
    map(
      seq(variableType, wspacesOrComment, variableName, opt(seq(wspacesOrComment, str('='), wspacesOrComment, rStatement()))),
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
    map(seq(lStatement(), wspacesOrComment, str('='), wspacesOrComment, rStatement()), ([ls,,,, rs]) => ({kind: 'assignment', to: ls, value: rs})),
    'assignment'
  );
}

function ifElseStatement(): Parser<IfElseStatement> {
  return expect(
    map(
      seq(
        str('if'),
        wspacesOrComment,
        between(str('('), rStatement(), str(')')),
        wspacesOrComment,
        statementOrScope(),
        opt(
          map(
            seq(
              between(wspacesOrComment, str('else'), wspacesOrComment),
              statementOrScope()
            ),
            ([, elseThen]) => elseThen
          )
        ),
        wspacesOrComment
      ),
      ([, , condition, , then, elseThen]) => ({ kind: 'if', condition, then, elseThen: elseThen ?? undefined })
    ),
    'If/Else statement'
  );
}

function statement(): Parser<Statement> {
  return expect(
    any(assignmentStatement(), letStatement(), methodCall()),
    'statement'
  );
}

function statementOrScope(): Parser<Statement> {
  return (ctx: Context): Result<Statement> => map(any(seq(statement(), str(';')), scope(), ifElseStatement()), (statement) => Array.isArray(statement) ? statement[0] : statement)(ctx);
}

const line = map(seq(wspacesOrComment, statementOrScope()), ([,statement,]) => statement);

const lines = expect(exhaust(line, seq(wspacesOrComment, str('}'))), 'function lines');

export function scope(): Parser<Scope> {
  return (ctx: Context): Result<Scope> => {
    const parser: Parser<Scope> = map(between(seq(wspacesOrComment, str('{')), lines, seq(wspacesOrComment, str('}'))), lines => ({ kind: 'scope', lines }));
    return parser(ctx)
  };
}