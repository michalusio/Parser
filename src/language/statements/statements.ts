import {
  any,
  between,
  Context,
  expect,
  intP,
  map,
  oneOrManyRed,
  opt,
  Parser,
  realP,
  Result,
  seq,
  str,
  wspaces,
  zeroOrMany,
} from '../../parser/parser';
import { parameterName } from '../core';
import {
  ArithmeticStatement,
  IndexingStatement,
  IntValueStatement,
  LStatement,
  MethodCallStatement,
  RealValueStatement,
  RStatement,
  VariableStatement,
} from '../interfaces';

function variableAccess(): Parser<VariableStatement> {
  return map(parameterName, (name)=> ({kind: 'variable', name}));
}

type LStatementSeparator = '.' | RStatement | RStatement[];

function lStatementSeparator(): Parser<LStatementSeparator> {
  return (ctx: Context): Result<LStatementSeparator> => any(
    str('.'),
    between(str('['), rStatement(), str('].')),
    between(str('('), zeroOrMany(rStatement(), seq(wspaces, str(','), wspaces)), str(').'))
  )(ctx);
}

function processLStatement(left: LStatement, right: VariableStatement, separator: LStatementSeparator): LStatement {
  if (separator === '.') {
    return ({ kind: 'property', to: right, from: left });
  }
  else if (Array.isArray(separator)) {
    const call: MethodCallStatement = ({ kind: 'methodCall', from: left, args: separator });
    return ({ kind: 'property', to: right, from: call });
  }
  else {
    const index: IndexingStatement = ({ kind: 'indexing', from: left, index: separator });
    return ({ kind: 'property', to: right, from: index });
  }
}

export function lStatement(): Parser<LStatement> {
  return map(seq(
    oneOrManyRed(variableAccess(), lStatementSeparator(), processLStatement),
    opt(between(str('['), rStatement(), str(']')))
    ), ([statement, indexing]) => indexing ? ({ kind: 'indexing', from: statement, index: indexing }) : statement
  );
}

export function methodCall(): Parser<MethodCallStatement> {
  return (ctx: Context): Result<MethodCallStatement> => {
    return expect(
      map(
        seq(lStatement(), between(str('('), zeroOrMany(rStatement(), seq(wspaces, str(','), wspaces)), str(')'))),
        ([from, args]) => <MethodCallStatement>({ kind: 'methodCall', from, args })
      ),
      'method call'
    )(ctx);
  }
}

const intStatement: Parser<IntValueStatement> = map(intP, i => ({ kind: 'intValue', value: i }));
const realStatement: Parser<RealValueStatement> = map(realP, i => ({ kind: 'realValue', value: i }));

function operator<T extends string>(op: T): Parser<T> {
  return between(wspaces, str(op), wspaces);
}

const addSubSeparator = any(operator('+'), operator('-'));
const mulDivSeparator = any(operator('*'), operator('/'));

const anyNormalRStatement = any(realStatement, intStatement, methodCall(), lStatement());

export function rStatement(): Parser<RStatement> {
  return expect(expr(), 'R statement');
}

function expr(): Parser<RStatement> {
  return oneOrManyRed(multExpr(), addSubSeparator, (left, right, operator) => <ArithmeticStatement>({kind: "arithmetic", operator, left, right}));
}

function multExpr(): Parser<RStatement> {
  return (ctx: Context): Result<RStatement> =>
    oneOrManyRed(primaryExpr(), mulDivSeparator, (left, right, operator) => <ArithmeticStatement>({kind: "arithmetic", operator, left, right}))(ctx);
}

function primaryExpr(): Parser<RStatement> {
  return any(anyNormalRStatement, between(str('('), expr(), str(')')));
}
