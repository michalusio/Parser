import { Context, failure, isFailure, Parser, Result } from '../types';
import { map } from './map';
import { seq } from './seq';

/** Parses a sequence of three parsers.
 * @returns A parser returning only the middle parser's result.
 */
export function between<T, U, V>(left: Parser<U>, parser: Parser<T>, right: Parser<V>): Parser<T> {
  return (ctx: Context): Result<T> => {
      const res = map(seq(left, parser, right), val => val[1])(ctx);
      if (isFailure(res)) {
          const newHistory = [...res.history];
          newHistory.splice(0, 2);
          return failure(res.ctx, res.expected, ['between', ...newHistory]);
      }
      return res;
  }
}