import { Context, failure, Parser, Result, success } from '../types';

export type StrParser<T> = Parser<T> & {
    parserType: 'str',
    match: T
};

/** Parses a string and returns it as a result of the parse.
 * @returns A parser parsing a given string, case-sensitive.
 */
export function str<T extends string>(match: T): StrParser<T> {
    const inQuotes = `'${match}'`;
    return Object.assign((ctx: Context): Result<T> => {
      if (ctx.text.startsWith(match, ctx.index)){
          return success({ ...ctx, index: ctx.index + match.length}, match);
      }
      else {
          return failure(ctx, inQuotes, [inQuotes]);
      }
  }, { parserType: 'str', match }) as StrParser<T>;
}

export type StrIParser<T> = Parser<T> & {
    parserType: 'stri',
    match: T
};

/** Parses a string case-insensitively and returns it as a result of the parse.
 * @returns A parser parsing a given string, case-insensitive.
 */
export function stri<T extends string>(match: T): StrIParser<Lowercase<T>> {
    const lowercase = match.toLowerCase();
    const inQuotes = `'${lowercase}'`;
    return Object.assign((ctx: Context): Result<Lowercase<T>> => {
      const textSlice = ctx.text.slice(ctx.index, ctx.index + match.length);
      if (match.localeCompare(textSlice, undefined, { sensitivity: 'accent' }) == 0) {
          return success({ ...ctx, index: ctx.index + match.length}, lowercase as Lowercase<T>);
      }
      else {
          return failure(ctx, inQuotes, [inQuotes]);
      }
  }, { parserType: 'stri', match: lowercase }) as StrIParser<Lowercase<T>>;
}