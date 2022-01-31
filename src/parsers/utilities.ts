import { Context, failure, isFailure, Parser, Result } from '../types';

/** Allows to make a condition on the result of the parsing function.
 * @returns A parser returning the same but also performing a given check on the result.
 */
export function ref<T>(parser: Parser<T>, check: ((p: T) => boolean), expected?: string): Parser<T> {
  return (ctx: Context): Result<T> => {
      const res = parser(ctx);
      if (!isFailure(res) && !check(res.value)) {
          return failure(res.ctx, expected ?? 'check', [`ref: ${expected ?? 'check'}`]);
      }
      return res;
  }
}

/** Changes the expected value for when the parser fails.
 * @returns A parser returning the same but with a different expected value.
 */
export function expect<T>(parser: Parser<T>, expected: string): Parser<T> {
  return (ctx: Context): Result<T> => {
      const res = parser(ctx);
      if (isFailure(res)) {
          return failure(res.ctx, expected, [expected, ...res.history]);
      }
      return res;
  }
}

/** Changes the expected value for when the parser fails. Erases the previous history.
 * @returns A parser returning the same but with a different expected value.
 */
export function expectErase<T>(parser: Parser<T>, expected: string): Parser<T> {
  return (ctx: Context): Result<T> => {
      const res = parser(ctx);
      if (isFailure(res)) {
          return failure(res.ctx, expected, [expected]);
      }
      return res;
  }
}