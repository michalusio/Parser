import { Context, isFailure, Parser, Result, success } from '../types';

/** Parses a sequence of three parsers.
 * @returns A parser returning only the middle parser's result.
 */
export function between<T, U, V>(left: Parser<U>, parser: Parser<T>, right: Parser<V>): Parser<T> {
  return (ctx: Context): Result<T> => {
      const resLeft = left(ctx);
      if (isFailure(resLeft)) {
          return resLeft;
      }
      const resParse = parser(resLeft.ctx);
      if (isFailure(resParse)) {
          return resParse;
      }
      const resRight = right(resParse.ctx);
      if (isFailure(resRight)) {
        return resRight;
      }
      return success(resRight.ctx, resParse.value);
  }
}