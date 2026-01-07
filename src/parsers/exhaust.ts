import { Context, failure, isFailure, Parser, Result, success } from '../types';

/** Parses using the passed in parser, until the input is exhausted or until the `until` condition is satisfied.
 * @returns A parser returning an array of parsed results.
 */
export function exhaust<T,V>(parser: Parser<T>, until: Parser<V> | null = null): Parser<T[]> {
  return (ctx: Context): Result<T[]> => {
      const results: T[] = [];
      while (true) {
          const res = parser(ctx);
          if (isFailure(res)) {
              if (until === null || isFailure(until(ctx))) {
                  return failure(res.ctx, res.expected, ['exhaust', ...res.history]);
              }
              return success(ctx, results);
          }
          ctx = res.ctx;
          results.push(res.value);
          if (res.ctx.index === res.ctx.text.length) return success(res.ctx, results);
      }
  }
}