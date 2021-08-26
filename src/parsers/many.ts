import { Context, failure, isFailure, Parser, Result, success } from '../types';
import { map } from './map';
import { opt } from './opt';
import { seq } from './seq';

/** Parses zero or more occurences of the given parser.
 * @returns A parser returning an array of many parses.
 */
export function many<T>(parser: Parser<T>): Parser<T[]> {
  return (ctx: Context): Result<T[]> => {
      const results: T[] = [];
      // eslint-disable-next-line no-constant-condition
      while (true) {
          const res = parser(ctx);
          if (isFailure(res)) {
              return success(ctx, results);
          }
          ctx = res.ctx;
          results.push(res.value);
      }
  }
}

/** Parses zero or more occurences of the given parser, separated with the separator parser.
 * @returns A parser returning an array of many parses, omitting the separator.
 */
export function zeroOrMany<T, V>(item: Parser<T>, separator: Parser<V>): Parser<T[]> {
  return map(opt(oneOrMany(item, separator)), t => t ?? []);
}

/** Parses one or more occurences of the given parser, separated with the separator parser.
 * @returns A parser returning an array of many parses, omitting the separator.
 */
export function oneOrMany<T, V>(item: Parser<T>, separator: Parser<V>): Parser<T[]> {
  return (ctx: Context): Result<T[]> => {
      const res = map(
          seq(item, many(map(seq(separator, item), ([, t]) => t))),
          ([t, ts]) => ([t, ...ts])
      )(ctx);
      if (isFailure(res)) {
          const newHistory = [...res.history];
          newHistory.splice(0, 2);
          return failure(res.ctx, res.expected, ['oneOrMany', ...newHistory]);
      }
      return res;
  }
}

/** Parses one or more occurences of the given parser, separated with the separator parser.
 * @returns A parser returning the result of many parses, reduced using the `reducer` function passed in.
 */
export function oneOrManyRed<T, V, U = T>(item: Parser<T>, separator: Parser<V>, reducer: (left: U | T, right: T, sep: V) => U): Parser<U | T> {
  return map(
      map(
          seq(map(item, (x) => (<[V | null, T]>[null, x])), many<[V | null, T]>(seq(separator, item))),
          ([t, ts]) => ([t, ...ts])
      ),
      ts => {
          let result: U | T = ts[0][1];
          for (let i = 1; i < ts.length; i++) {
              result = reducer(result, ts[i][1], ts[i][0] as V);
          }
          return result;
      }
  );
}