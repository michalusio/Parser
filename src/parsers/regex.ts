import { Context, failure, Parser, Result, success } from '../types';

/** Parses a regex and returns the matched result of the parse.
 * @returns A parser parsing a given regex and returning a match.
 */
export function regex(match: RegExp | string, expected: string): Parser<string> {
  return (ctx: Context): Result<string> => {
      const regexMatch = ctx.text.substr(ctx.index).match(match);
      if (regexMatch !== undefined && regexMatch !== null && regexMatch.index === 0) {
          return success({...ctx, index: ctx.index + regexMatch[0].length}, ctx.text.substr(ctx.index, regexMatch[0].length))
      }
      else {
          return failure(ctx, expected, [expected]);
      }
  }
}