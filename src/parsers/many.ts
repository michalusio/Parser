import { Context, failure, isFailure, Parser, Result, success } from "../types";

/** Parses zero or more occurences of the given parser.
 * @returns A parser returning an array of many parses.
 */
export function many<T>(parser: Parser<T>): Parser<T[]> {
    return (ctx: Context): Result<T[]> => {
        const results: T[] = [];
        while (true) {
            const res = parser(ctx);
            if (isFailure(res)) {
                const surelyIndex = res.history.findIndex(h => h === 'surely');
                if (surelyIndex >= 0) {
                    return failure(res.ctx, res.expected, ['many', ...res.history.slice(0, surelyIndex), ...res.history.slice(surelyIndex + 1)]);
                }
                return success(ctx, results);
            }
            ctx = res.ctx;
            results.push(res.value);
        }
    };
}

/** Parses zero or more occurences of the given parser, separated with the separator parser.
 * @returns A parser returning an array of many parses, omitting the separator.
 */
export function zeroOrMany<T, V>(
    item: Parser<T>,
    separator: Parser<V> | undefined = undefined,
): Parser<T[]> {
    if (separator) {
        return (ctx: Context): Result<T[]> => {
            const results: T[] = [];
            const res = item(ctx);
            if (isFailure(res)) {
                const surelyIndex = res.history.findIndex(h => h === 'surely');
                if (surelyIndex >= 0) {
                    return failure(res.ctx, res.expected, ['zeroOrMany', ...res.history.slice(0, surelyIndex), ...res.history.slice(surelyIndex + 1)]);
                }
                return success(ctx, results);
            }
            ctx = res.ctx;
            results.push(res.value);
            while (true) {
                const resSep = separator(ctx);
                if (isFailure(resSep)) {
                    const surelyIndex = resSep.history.findIndex(h => h === 'surely');
                    if (surelyIndex >= 0) {
                        return failure(resSep.ctx, resSep.expected, ['zeroOrMany', ...resSep.history.slice(0, surelyIndex), ...resSep.history.slice(surelyIndex + 1)]);
                    }
                    return success(ctx, results);
                }
                const res = item(resSep.ctx);
                if (isFailure(res)) {
                    const surelyIndex = res.history.findIndex(h => h === 'surely');
                    if (surelyIndex >= 0) {
                        return failure(res.ctx, res.expected, ['zeroOrMany', ...res.history.slice(0, surelyIndex), ...res.history.slice(surelyIndex + 1)]);
                    }
                    return success(ctx, results);
                }
                ctx = res.ctx;
                results.push(res.value);
            }
        };
    }
    else return many(item);
}

/** Parses one or more occurences of the given parser, separated with the separator parser.
 * @returns A parser returning an array of many parses, omitting the separator.
 */
export function oneOrMany<T, V>(
    item: Parser<T>,
    separator: Parser<V> | undefined = undefined,
): Parser<T[]> {
    if (separator) {
        return (ctx: Context): Result<T[]> => {
            const results: T[] = [];
            const res = item(ctx);
            if (isFailure(res)) return res;
            ctx = res.ctx;
            results.push(res.value);
            while (true) {
                const resSep = separator(ctx);
                if (isFailure(resSep)) {
                    const surelyIndex = resSep.history.findIndex(h => h === 'surely');
                    if (surelyIndex >= 0) {
                        return failure(resSep.ctx, resSep.expected, ['oneOrMany', ...resSep.history.slice(0, surelyIndex), ...resSep.history.slice(surelyIndex + 1)]);
                    }
                    return success(ctx, results);
                }
                const res = item(resSep.ctx);
                if (isFailure(res)) {
                    const surelyIndex = res.history.findIndex(h => h === 'surely');
                    if (surelyIndex >= 0) {
                        return failure(res.ctx, res.expected, ['oneOrMany', ...res.history.slice(0, surelyIndex), ...res.history.slice(surelyIndex + 1)]);
                    }
                    return success(ctx, results);
                }
                ctx = res.ctx;
                results.push(res.value);
            }
        };
    } else {
        return (ctx: Context): Result<T[]> => {
            const results: T[] = [];
            const res = item(ctx);
            if (isFailure(res)) return res;
            ctx = res.ctx;
            results.push(res.value);
            while (true) {
                const res = item(ctx);
                if (isFailure(res)) {
                    const surelyIndex = res.history.findIndex(h => h === 'surely');
                    if (surelyIndex >= 0) {
                        return failure(res.ctx, res.expected, ['oneOrMany', ...res.history.slice(0, surelyIndex), ...res.history.slice(surelyIndex + 1)]);
                    }
                    return success(ctx, results);
                }
                ctx = res.ctx;
                results.push(res.value);
            }
        };
    }
}

/** Parses one or more occurences of the given parser, separated with the separator parser.
 * @returns A parser returning the result of many parses, reduced using the `reducer` function passed in.
 */
export function oneOrManyRed<T, V, U = T>(
    item: Parser<T>,
    separator: Parser<V>,
    reducer: (left: U | T, right: T, sep: V) => U,
): Parser<U | T> {
    return (ctx: Context): Result<U | T> => {
        const res = item(ctx);
        if (isFailure(res)) return res;
        ctx = res.ctx;
        let result: U | T = res.value;
        while (true) {
            const resSep = separator(ctx);
            if (isFailure(resSep)) {
                const surelyIndex = resSep.history.findIndex(h => h === 'surely');
                if (surelyIndex >= 0) {
                    return failure(resSep.ctx, resSep.expected, ['oneOrManyRed', ...resSep.history.slice(0, surelyIndex), ...resSep.history.slice(surelyIndex + 1)]);
                }
                return success(ctx, result);
            }
            const res = item(resSep.ctx);
            if (isFailure(res)) {
                const surelyIndex = res.history.findIndex(h => h === 'surely');
                if (surelyIndex >= 0) {
                    return failure(res.ctx, res.expected, ['oneOrManyRed', ...res.history.slice(0, surelyIndex), ...res.history.slice(surelyIndex + 1)]);
                }
                return success(ctx, result);
            }
            ctx = res.ctx;
            try {
                result = reducer(result, res.value, resSep.value);
            }
            catch {
                return failure(res.ctx, 'Error while reducing', ['oneOrManyRed']);
            }
        }
    };
}
