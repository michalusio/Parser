import { Context, failure, isFailure, Parser, Result, success } from "../types";

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
            if (isFailure(res)) {
                return failure(res.ctx, res.expected, ['oneOrMany', ...res.history]);
            }
            ctx = res.ctx;
            results.push(res.value);
            while (true) {
                const resSep = separator(ctx);
                if (isFailure(resSep)) {
                    const surelyIndex = resSep.history.findIndex(h => h === 'surely');
                    // Stryker disable next-line EqualityOperator: The > mutant results in an equivalent mutant
                    if (surelyIndex >= 0) {
                        return failure(resSep.ctx, resSep.expected, ['oneOrMany', ...resSep.history.slice(0, surelyIndex), ...resSep.history.slice(surelyIndex + 1)]);
                    }
                    return success(ctx, results);
                }
                const res = item(resSep.ctx);
                if (isFailure(res)) {
                    const surelyIndex = res.history.findIndex(h => h === 'surely');
                    // Stryker disable next-line EqualityOperator: The > mutant results in an equivalent mutant
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
            if (isFailure(res)) {
                return failure(res.ctx, res.expected, ['oneOrMany', ...res.history]);
            }
            ctx = res.ctx;
            results.push(res.value);
            while (true) {
                const res = item(ctx);
                if (isFailure(res)) {
                    const surelyIndex = res.history.findIndex(h => h === 'surely');
                    // Stryker disable next-line EqualityOperator: The > mutant results in an equivalent mutant
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
