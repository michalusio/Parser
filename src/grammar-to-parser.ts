import { Identifier, Rule, RuleResult } from './ebnf';
import { any, expect, many, map, opt, seq, str } from './parsers';
import { Context, Parser, Result } from './types';

export type ParsedGroup = Readonly<{
  kind: 'group';
  result: ParsedUnit;
}>;

export type ParsedMany = Readonly<{
  kind: 'many';
  result: ParsedUnit[];
}>;

export type ParsedOption = Readonly<{
  kind: 'option';
  result: ParsedUnit | null;
}>;

export type ParsedSequence = Readonly<{
  kind: 'sequence';
  result: ParsedUnit[];
}>;

export type ParsedRule = Readonly<{
  kind: 'rule';
  name: string;
  result: ParsedUnit;
}>;

export type Omitted = Readonly<{
  kind: 'omitted';
}>;

export type ParsedUnit = ParsedRule | ParsedSequence | ParsedOption | ParsedMany | ParsedGroup | string | Omitted;

function isOmitted(unit: ParsedUnit | null): unit is Omitted {
  return unit !== null && (unit as Omitted).kind === 'omitted';
}

function parseTerminal(str: string): string {
  switch (str) {
    case '\n':
      return '\\n';
    case '\r':
      return '\\r';
    case '\t':
      return '\\t';
    case '\v':
      return '\\v';
    case '\f':
      return '\\f';
    case '\b':
      return '\\b';
    case '\0':
      return '\\0';
    case '\\':
      return '\\\\';
  }
  return str;
}

function ruleResultToParser(rule: RuleResult, grammarMap: Map<string, RuleResult>, parserMap: Map<string, Parser<ParsedUnit>>, inProgress: Set<string>): Parser<ParsedUnit> {
  switch (rule.kind) {
    case 'identifier': {
      if (!parserMap.has(rule.name) && !inProgress.has(rule.name)) {
        inProgress.add(rule.name);
        ruleToParser(rule, grammarMap, parserMap, inProgress);
      }
      const ruleName = rule.name;
      return (ctx: Context): Result<ParsedUnit> => {
        const parser = parserMap.get(ruleName);
        if (parser) {
          const p: Parser<ParsedUnit> = ruleName.endsWith("_")
           ? (ruleName.endsWith("__")
              ? map(parser, () => ({ kind: 'omitted' }))
              : parser)
           : map(parser, r => ({
              kind: 'rule',
              name: ruleName,
              result: r,
            }));
          return p(ctx);
        }
        throw new Error(`no parser found for ${ruleName}`);
      };
    }
    case 'terminal': return str(parseTerminal(rule.value));
    case 'optional':
      return map(opt(ruleResultToParser(rule.value, grammarMap, parserMap, inProgress)), opt => isOmitted(opt) ? opt : ({ kind: 'option', result: opt }));
    case 'many':
      return map(many(ruleResultToParser(rule.value, grammarMap, parserMap, inProgress)), many => ({ kind: 'many', result: many.filter(x => !isOmitted(x)) }));
    case 'concatenation':
      return map(seq(...rule.values.map(r =>  ruleResultToParser(r, grammarMap, parserMap, inProgress))), seq => ({ kind: 'sequence', result: seq.filter(x => !isOmitted(x)) }));
    case 'alternation':
      return any(...rule.values.map(r => ruleResultToParser(r, grammarMap, parserMap, inProgress)));
    case 'group':
      return map(ruleResultToParser(rule.value, grammarMap, parserMap, inProgress), group => isOmitted(group) ? group : ({ kind: 'group', result: group }));
  }
}

function ruleToParser(ruleId: Identifier, grammarMap: Map<string, RuleResult>, parserMap: Map<string, Parser<ParsedUnit>>, inProgress: Set<string>): Parser<ParsedUnit> {
  const rule = grammarMap.get(ruleId.name);
  if (!rule) {
    throw new Error(`No rule found for ${ruleId.name}`);
  }
  parserMap.set(ruleId.name, expect(ruleResultToParser(rule, grammarMap, parserMap, inProgress), ruleId.name));
  return parserMap.get(ruleId.name) as Parser<ParsedUnit>;
}

export function grammarToParser(grammar: Rule[], entryRule: Identifier): Parser<ParsedUnit> {
  const grammarMap = new Map<string, RuleResult>(grammar.map(g => [g.identifier.name, g.result]));
  const value = ruleToParser(entryRule, grammarMap, new Map<string, Parser<ParsedUnit>>(), new Set<string>([entryRule.name]));
  return value;
}