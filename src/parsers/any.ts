import { Context, Failure, failure, isFailure, Parser, Result } from '../types';
import { anyString } from './anyString';
import { shouldPerformFusions, allStringParsers } from './optimizations';

/** Parses the input using any passed parser, trying from left to right.
 * @returns A parser returning the result of the first parser that succeeds, or the failure that has come the furthest.
 */
export function any<T, U, V, W, X, Z, I, J, K, L, M>(...parsers: [Parser<T>, Parser<U>, Parser<V>, Parser<W>, Parser<X>, Parser<Z>, Parser<I>, Parser<J>, Parser<K>, Parser<L>, Parser<M>]): Parser<T | U | V | W | X | Z | I | J | K | L | M>
export function any<T, U, V, W, X, Z, I, J, K, L>(...parsers: [Parser<T>, Parser<U>, Parser<V>, Parser<W>, Parser<X>, Parser<Z>, Parser<I>, Parser<J>, Parser<K>, Parser<L>]): Parser<T | U | V | W | X | Z | I | J | K | L>
export function any<T, U, V, W, X, Z, I, J, K>(...parsers: [Parser<T>, Parser<U>, Parser<V>, Parser<W>, Parser<X>, Parser<Z>, Parser<I>, Parser<J>, Parser<K>]): Parser<T | U | V | W | X | Z | I | J | K>
export function any<T, U, V, W, X, Z, I, J>(...parsers: [Parser<T>, Parser<U>, Parser<V>, Parser<W>, Parser<X>, Parser<Z>, Parser<I>, Parser<J>]): Parser<T | U | V | W | X | Z | I | J>
export function any<T, U, V, W, X, Z, I>(...parsers: [Parser<T>, Parser<U>, Parser<V>, Parser<W>, Parser<X>, Parser<Z>, Parser<I>]): Parser<T | U | V | W | X | Z | I>
export function any<T, U, V, W, X, Z>(...parsers: [Parser<T>, Parser<U>, Parser<V>, Parser<W>, Parser<X>, Parser<Z>]): Parser<T | U | V | W | X | Z>
export function any<T, U, V, W, X>(...parsers: [Parser<T>, Parser<U>, Parser<V>, Parser<W>, Parser<X>]): Parser<T | U | V | W | X >
export function any<T, U, V, W>(...parsers: [Parser<T>, Parser<U>, Parser<V>, Parser<W>]): Parser<T | U | V | W>
export function any<T, U, V>(...parsers: [Parser<T>, Parser<U>, Parser<V>]): Parser<T | U | V>
export function any<T, U>(...parsers: [Parser<T>, Parser<U>]): Parser<T | U>
export function any<T>(...parsers: [Parser<T>]): Parser<T>
export function any<T>(...parsers: Parser<T>[]): Parser<T>
export function any<T>(...parsers: Parser<T>[]): Parser<T> {
    let marker = {};
    if (shouldPerformFusions() && allStringParsers(parsers)) {
        const matches = parsers.flatMap(p => p.matches);
        // Not fusing if not enough matches
        // We do pass the matches forward though, because a parser above may want to fuse
        if (matches.length > 10) {
            return anyString(matches) as Parser<T>;
        } else {
            marker = { parserType: 'anyString', matches };
        }
    }
    return Object.assign((ctx: Context): Result<T> => {
        const expected: Failure[] = [];
        for (const parser of parsers) {
            const res = parser(ctx);
            if (isFailure(res)) {
                const surelyIndex = res.history.findIndex(h => h === 'surely');
                if (surelyIndex >= 0) {
                    return failure(res.ctx, res.expected, ['any', ...res.history.slice(0, surelyIndex), ...res.history.slice(surelyIndex + 1)]);
                }
                expected.push(res);
            }
            else return res;
        }
        const longest = expected.reduce((a, b) => a.history.length > b.history.length ? a : b);
        return failure(longest.ctx, longest.expected, ['any', ...longest.history]);
    }, marker);
}