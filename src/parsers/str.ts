import { Context, failure, Parser, Result, success } from '../types';

/** Parses a string and returns it as a result of the parse.
 * @returns A parser parsing a given string.
 */
export function str<T extends string>(match: T): Parser<T> {
    return (ctx: Context): Result<T> => {
      if (ctx.text.startsWith(match, ctx.index)){
          return success({ ...ctx, index: ctx.index + match.length}, match);
      }
      else {
          return failure(ctx, match, [match]);
      }
  };
}