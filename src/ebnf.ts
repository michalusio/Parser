import { any, between, exhaust, expect, expectErase, many, map, oneOrMany, oneOrManyRed, regex, seq, str, surely, wspaces } from './parsers';
import { Context, Parser, Result } from './types';

export type Identifier = Readonly<{
  kind: 'identifier',
  name: string;
}>;

export type Terminal = Readonly<{
  kind: 'terminal',
  value: string;
}>;

export type Optional = Readonly<{
  kind: 'optional',
  value: RuleResult;
}>;

export type Many = Readonly<{
  kind: 'many',
  value: RuleResult;
}>;

export type Group = Readonly<{
  kind: 'group',
  value: RuleResult;
}>;

export type Alternation = Readonly<{
  kind: 'alternation',
  values: RuleResult[];
}>;

export type Concatenation = Readonly<{
  kind: 'concatenation',
  values: RuleResult[];
}>;

export type RuleResult = Identifier | Terminal | Optional | Many | Group | Alternation | Concatenation;

export type Rule = Readonly<{
  identifier: Identifier;
  result: RuleResult;
}>;

const letter = regex(/[a-zA-Z]/, 'letter');
const digit = regex(/[0-9]/, 'digit');
const generalSymbols = regex(/[[\]{}()<>=|.,:;\-_]/, 'generalSymbols');
const whiteSpace = expectErase(any(
  str(' '),
  map(str('\\n'), () => '\n'),
  map(str('\\t'), () => '\t'),
  map(str('\\r'), () => '\r'),
  map(str('\\f'), () => '\f'),
  map(str('\\v'), () => '\v'),
  map(str('\\b'), () => '\b'),
  map(str('\\0'), () => '\0'),
  map(str('\\\\'), () => '\\')
), 'whitespace');
const characterForDoubleQuote = expectErase(any(letter, digit, generalSymbols, regex(/'|(?:\\")/, 'symbol'), whiteSpace), "character-for-double-quote");
const characterForSingleQuote = expectErase(any(letter, digit, generalSymbols, regex(/"|(?:\\')/, 'symbol'), whiteSpace), "character-for-single-quote");

const identifier: Parser<Identifier> = expectErase(map(
  seq(letter, many(any(letter, digit, str('_')))),
  ([first, rest]) => ({ kind: 'identifier', name: first + rest.join('')})
), "identifier");

const terminal: Parser<Terminal> = map(any(
  expect(between(str("'"), oneOrMany(characterForSingleQuote), str("'")), "terminal-single-quote"),
  expect(between(str('"'), oneOrMany(characterForDoubleQuote), str('"')), "terminal-double-quote")
), value => ({ kind: 'terminal', value: value.join('') }));

function normalRhs(): Parser<RuleResult> {
  return (ctx: Context): Result<RuleResult> =>
  expect(any(
    identifier,
    terminal,
    expect(map(between(str('['), surely(rhs()), str(']')), value => <Optional>({ kind: 'optional', value})), 'optional'),
    expect(map(between(str('{'), surely(rhs()), str('}')), value => <Many>({ kind: 'many', value})), 'many'),
    expect(map(between(str('('), surely(rhs()), str(')')), value => <Group>({ kind: 'group', value})), 'group')
  ), 'any-rhs')(ctx);
}

function concatRhs(): Parser<RuleResult> {
  return (ctx: Context): Result<RuleResult> =>
  expect(
    between(
      wspaces,
      oneOrManyRed(normalRhs(), between(wspaces, str(','), wspaces), (left, right) => {
        return <Concatenation>({ kind: 'concatenation', values: [
          ...(left.kind === 'concatenation' ? left.values : [left]),
          right
        ] });
      }),
      wspaces
    ),
    'concatenation-rhs')(ctx);
}

function rhs(): Parser<RuleResult> {
  return (ctx: Context): Result<RuleResult> =>
  expect(
    between(
      wspaces,
      oneOrManyRed(concatRhs(), between(wspaces, str('|'), wspaces), (left, right) => {
        return <Alternation>({ kind: 'alternation', values: [
          ...(left.kind === 'alternation' ? left.values : [left]),
          right
        ] });
      }),
      wspaces
    ),
  'alternation-rhs')(ctx);
}

const rule: Parser<Rule> = map(
  seq(wspaces, identifier, wspaces, str('='), wspaces, rhs(), wspaces, str(';'), wspaces),
  ([,lhs,,,, rhs]) => ({ identifier: lhs, result: rhs })
);

export const EBNFParser = exhaust(rule);
