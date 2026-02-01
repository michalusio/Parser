import { Context, failure, Parser, Result, success } from '../types';

/** Parses a regex and returns the matched result of the parse.
 * @returns A parser parsing a given regex and returning a match.
 */
export function regex(match: RegExp | string, expected: string): Parser<string> {
    const regexp = new RegExp(match, typeof match === 'string' ? 'y' : match.flags+'y');
    return (ctx: Context): Result<string> => {
        regexp.lastIndex = ctx.index;
        const regexMatch = regexp.exec(ctx.text);
        if (regexMatch !== null) {
            return success({...ctx, index: ctx.index + regexMatch[0].length}, regexMatch[0]);
        }
        else {
            return failure(ctx, expected, [expected]);
        }
    }
}