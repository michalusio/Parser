import { Context, Failure, failure, isFailure, Parser, Result } from '../types';
import { anyString, OptimizableStrParser } from './anyString';
import { shouldPerformFusions } from './utilities';

const optimizableTypes = ['str', 'stri', 'anyString'];

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
    if (shouldPerformFusions() && parsers.every(p => 'parserType' in p && typeof p.parserType === 'string' && optimizableTypes.includes(p.parserType))) {
        return anyString(...parsers as OptimizableStrParser<string>[]) as Parser<T>;
    }
    return (ctx: Context): Result<T> => {
        const expected: Failure[] = [];
        for (const parser of parsers) {
            const res = parser(ctx);
            if (isFailure(res)) {
                if (res.history.includes('surely')) {
                    return failure(res.ctx, res.expected, res.history.filter(h => h !== 'surely'));
                }
                expected.push(res);
            }
            else return res;
        }
        const longest = expected.reduce((a, b) => a.history.length > b.history.length ? a : b);
        return failure(longest.ctx, longest.expected, ['any', ...longest.history]);
    }
}