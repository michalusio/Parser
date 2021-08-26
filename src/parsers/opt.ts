import { Context, isFailure, Parser, Result, success } from '../types';

/** Makes the parser optional.
 * @returns A parser that succeeds with `null` result if the parsing didn't succeed.
 */
export function opt<T>(parser: Parser<T>): Parser<T | null> {
  return (ctx: Context): Result<T | null> => {
      const parseResult = parser(ctx);
      if (isFailure(parseResult)) {
          return success(ctx, null);
      }
      return parseResult;
  };
}