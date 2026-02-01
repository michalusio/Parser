import { Context, failure, isFailure, Parser, Result, success } from "../types";

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
                // Stryker disable next-line EqualityOperator: The > mutant results in an equivalent mutant
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
                    // Stryker disable next-line EqualityOperator: The > mutant results in an equivalent mutant
                    if (surelyIndex >= 0) {
                        return failure(resSep.ctx, resSep.expected, ['zeroOrMany', ...resSep.history.slice(0, surelyIndex), ...resSep.history.slice(surelyIndex + 1)]);
                    }
                    return success(ctx, results);
                }
                const res = item(resSep.ctx);
                if (isFailure(res)) {
                    const surelyIndex = res.history.findIndex(h => h === 'surely');
                    // Stryker disable next-line EqualityOperator: The > mutant results in an equivalent mutant
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
    else return (ctx: Context): Result<T[]> => {
        const results: T[] = [];
        while (true) {
            const res = item(ctx);
            if (isFailure(res)) {
                const surelyIndex = res.history.findIndex(h => h === 'surely');
                // Stryker disable next-line EqualityOperator: The > mutant results in an equivalent mutant
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
