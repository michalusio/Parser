import { Context, failure, isFailure, Parser, Result, success } from '../types';

/** Parses a sequence of parsers going from left to right, returning the results of the parsers.
 * @returns A parser parsing the sequence of parsers.
 */
export function seq<T, U, V, W, X, Z, I, J, K, L, M>(...parsers: [Parser<T>, Parser<U>, Parser<V>, Parser<W>, Parser<X>, Parser<Z>, Parser<I>, Parser<J>, Parser<K>, Parser<L>, Parser<M>]): Parser<[T, U, V, W, X, Z, I, J, K, L, M]>
export function seq<T, U, V, W, X, Z, I, J, K, L>(...parsers: [Parser<T>, Parser<U>, Parser<V>, Parser<W>, Parser<X>, Parser<Z>, Parser<I>, Parser<J>, Parser<K>, Parser<L>]): Parser<[T, U, V, W, X, Z, I, J, K, L]>
export function seq<T, U, V, W, X, Z, I, J, K>(...parsers: [Parser<T>, Parser<U>, Parser<V>, Parser<W>, Parser<X>, Parser<Z>, Parser<I>, Parser<J>, Parser<K>]): Parser<[T, U, V, W, X, Z, I, J, K]>
export function seq<T, U, V, W, X, Z, I, J>(...parsers: [Parser<T>, Parser<U>, Parser<V>, Parser<W>, Parser<X>, Parser<Z>, Parser<I>, Parser<J>]): Parser<[T, U, V, W, X, Z, I, J]>
export function seq<T, U, V, W, X, Z, I>(...parsers: [Parser<T>, Parser<U>, Parser<V>, Parser<W>, Parser<X>, Parser<Z>, Parser<I>]): Parser<[T, U, V, W, X, Z, I]>
export function seq<T, U, V, W, X, Z>(...parsers: [Parser<T>, Parser<U>, Parser<V>, Parser<W>, Parser<X>, Parser<Z>]): Parser<[T, U, V, W, X, Z]>
export function seq<T, U, V, W, X>(...parsers: [Parser<T>, Parser<U>, Parser<V>, Parser<W>, Parser<X>]): Parser<[T, U, V, W, X]>
export function seq<T, U, V, W>(...parsers: [Parser<T>, Parser<U>, Parser<V>, Parser<W>]): Parser<[T, U, V, W]>
export function seq<T, U, V>(...parsers: [Parser<T>, Parser<U>, Parser<V>]): Parser<[T, U, V]>
export function seq<T, U>(...parsers: [Parser<T>, Parser<U>]): Parser<[T, U]>
export function seq<T>(...parsers: [Parser<T>]): Parser<[T]>
export function seq<T>(...parsers: Parser<T>[]): Parser<T[]>
export function seq<T>(...parsers: Parser<T>[]): Parser<T[]> {
    return (ctx: Context): Result<T[]> => {
        const values: T[] = [];
        for (const parser of parsers) {
            const res = parser(ctx);
            ctx = res.ctx;
            if (isFailure(res)) return failure(res.ctx, res.expected, ['seq', ...res.history]);
            values.push(res.value);
        }
        return success(ctx, values);
    }
}