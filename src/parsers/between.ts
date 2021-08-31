import { Context, failure, isFailure, Parser, Result } from '../types';
import { seq } from './seq';

/** Parses a sequence of three parsers.
 * @returns A parser returning only the middle parser's result.
 */
export function between<T, U, V>(left: Parser<U>, parser: Parser<T>, right: Parser<V>): Parser<T> {
  const sequence = seq(left, parser, right);
  return (ctx: Context): Result<T> => {
      const res = sequence(ctx);
      if (isFailure(res)) {
          const newHistory = [...res.history];
          newHistory.splice(0, 1);
          return failure(res.ctx, res.expected, ['between', ...newHistory]);
      }
      return { ...res, value: res.value[1] };
  }
}