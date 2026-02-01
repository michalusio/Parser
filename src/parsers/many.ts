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
                // Stryker disable next-line EqualityOperator: The > mutant results in an equivalent mutant
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
