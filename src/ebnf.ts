import { any, between, exhaust, many, map, oneOrMany, oneOrManyRed, regex, seq, str, wspaces } from './parsers';
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
const generalSymbols = regex(/[[\]{}()<>=|.,:;-]| /, 'generalSymbols');
const symbolForDoubleQuote = any(generalSymbols, regex(/'|(?:\\")/, 'symbol'));
const symbolForSingleQuote = any(generalSymbols, regex(/"|(?:\\')/, 'symbol'));
const characterForDoubleQuote = any(letter, digit, symbolForDoubleQuote, str('_'));
const characterForSingleQuote = any(letter, digit, symbolForSingleQuote, str('_'));

const identifier: Parser<Identifier> = map(
  seq(letter, many(any(letter, digit, str('_')))),
  ([first, rest]) => ({ kind: 'identifier', name: first + rest.join('')})
);

const terminal: Parser<Terminal> = map(any(
  between(str("'"), oneOrMany(characterForSingleQuote), str("'")),
  between(str('"'), oneOrMany(characterForDoubleQuote), str('"'))
), value => ({ kind: 'terminal', value: value.join('') }));

function normalRhs(): Parser<RuleResult> {
  return (ctx: Context): Result<RuleResult> =>
  any(
    identifier,
    terminal,
    map(between(str('['), rhs(), str(']')), value => <Optional>({ kind: 'optional', value})),
    map(between(str('{'), rhs(), str('}')), value => <Many>({ kind: 'many', value})),
    map(between(str('('), rhs(), str(')')), value => <Group>({ kind: 'group', value}))
  )(ctx);
}

function rhs(): Parser<RuleResult> {
  return (ctx: Context): Result<RuleResult> =>
  between(
    wspaces,
    oneOrManyRed(normalRhs(), between(wspaces, any(str('|'), str(',')), wspaces), (left, right, sep) => {
      if (sep === '|') {
        return <Alternation>({ kind: 'alternation', values: [
          ...(left.kind === 'alternation' ? left.values : [left]),
          right
        ] });
      }
      else {
        return <Concatenation>({ kind: 'concatenation', values: [
          ...(left.kind === 'concatenation' ? left.values : [left]),
          right
        ] });
      }
    }),
    wspaces
  )(ctx);
}

const rule: Parser<Rule> = map(
  seq(identifier, wspaces, str('='), wspaces, rhs(), wspaces, str(';'), wspaces),
  ([lhs,,,, rhs]) => ({ identifier: lhs, result: rhs })
);

export const grammar = exhaust(rule);