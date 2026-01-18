import { Context, failure, Parser, Result, success } from '../types';

/** Parses a string and returns it as a result of the parse.
 * @returns A parser parsing a given string, case-sensitive.
 */
export function str<T extends string>(match: T): Parser<T> {
    const inQuotes = `'${match}'`;
    return Object.assign((ctx: Context): Result<T> => {
      if (ctx.text.startsWith(match, ctx.index)){
          return success({ ...ctx, index: ctx.index + match.length}, match);
      }
      else {
          return failure(ctx, inQuotes, [inQuotes]);
      }
  }, { parserType: 'anyString', matches: [[match, false, (v: string) => v]] });
}

const collator = new Intl.Collator('en', { sensitivity: 'accent' });

/** Parses a string case-insensitively and returns it as a result of the parse.
 * @returns A parser parsing a given string, case-insensitive.
 */
export function stri<T extends string>(match: T): Parser<Lowercase<T>> {
    const lowercase = match.toLowerCase();
    const inQuotes = `'${lowercase}'`;
    return Object.assign((ctx: Context): Result<Lowercase<T>> => {
      const textSlice = ctx.text.slice(ctx.index, ctx.index + match.length);
      if (collator.compare(match, textSlice) == 0) {
          return success({ ...ctx, index: ctx.index + match.length}, lowercase as Lowercase<T>);
      }
      else {
          return failure(ctx, inQuotes, [inQuotes]);
      }
  }, { parserType: 'anyString', matches: [[lowercase, true, (v: string) => v]] });
}