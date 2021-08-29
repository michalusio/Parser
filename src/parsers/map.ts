import { Context, failure, isFailure, Parser, Result, success } from '../types';

/** Parses the input using the given parser, then maps the output.
 * @returns A parser that parses the same input, but has output mapped using the mapping function.
 */
export function map<A, B>(parser: Parser<A>, mapper: (val: A) => B): Parser<B> {
  return (ctx: Context): Result<B> => {
      const res = parser(ctx);
      if (isFailure(res)) return failure(res.ctx, res.expected, ['map', ...res.history]);
      try {
          const newValue = mapper(res.value);
          return success(res.ctx, newValue);
      }
      catch (e) {
          return failure(res.ctx, 'Error while mapping', ['map']);
      }
  }
}