const DEBUG = false;
let lastErrorMsg = '';

export type Parser<T> = (ctx: Context) => Result<T>;

export type Context = Readonly<{
  text: string;
  index: number;
}>;

export type Result<T> = Success<T> | Failure;

type Success<T> = Readonly<{
  success: true;
  value: T;
  ctx: Context;
}>;

type Failure = Readonly<{
  success: false;
  expected: string;
  ctx: Context;
  history: string[];
}>;

export function isFailure(input: unknown): input is Failure {
    return !(input as Failure).success;
}

function success<T>(ctx: Context, value: T): Success<T> {
    if (DEBUG) {
        const error = new ParseError('', ctx.text, ctx.index, []);
        logDebug(`Parsed ${JSON.stringify(value)}`, ctx.index, [error.column, error.row], error.line);
    }
    return { success: true, value, ctx };
}

function failure(ctx: Context, expected: string, history: string[]): Failure {
    if (DEBUG) {
        const errorMsg = `Expected ${expected} at index ${ctx.index}`;
        if (errorMsg !== lastErrorMsg) {
            lastErrorMsg = errorMsg;
            const error = new ParseError('', ctx.text, ctx.index, history);
            logDebug(`Expected ${expected}`, ctx.index, [error.column, error.row], error.line);
        }
    }
  return { success: false, expected, ctx, history };
}

export function result<T>(value: T): Parser<T> {
    return (ctx: Context): Result<T> => success(ctx, value);
}

export function fail<T>(reason: string): Parser<T> {
    return (ctx: Context): Result<T> => failure(ctx, reason, [reason]);
}

export function str<T extends string>(match: T): Parser<T> {
    return (ctx: Context): Result<T> => {
        if (ctx.text.substr(ctx.index, match.length) === match){
            return success({...ctx, index: ctx.index + match.length}, match);
        }
        else {
            return failure(ctx, match, [match]);
        }
    };
}

export function regex(match: RegExp | string, expected: string): Parser<string> {
    return (ctx: Context): Result<string> => {
        const regexMatch = ctx.text.substr(ctx.index).match(match);
        if (regexMatch !== undefined && regexMatch !== null && regexMatch.index === 0) {
            return success({...ctx, index: ctx.index + regexMatch[0].length}, ctx.text.substr(ctx.index, regexMatch[0].length))
        }
        else {
            return failure(ctx, expected, [expected]);
        }
    }
}

export function opt<T>(parser: Parser<T>): Parser<T | null> {
    return (ctx: Context): Result<T | null> => {
        const parseResult = parser(ctx);
        if (isFailure(parseResult)) {
            return success(ctx, null);
        }
        return parseResult;
    };
}

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
export function any<T>(...parsers: Parser<T>[]): Parser<T> {
    return (ctx: Context): Result<T> => {
        const expected: Failure[] = [];
        for (const parser of parsers) {
            const res = parser(ctx);
            if (isFailure(res)) {
                expected.push(res);
            }
            else return res;
        }
        const failMessage = expected.length === 1 ? expected[0].expected : `any of ['${expected.map(e => e.expected).join("', '")}']`;
        const longest = expected.map(e => e.ctx).reduce((a, b) => a.index > b.index ? a : b);
        return failure(longest, failMessage, ['any', ...(expected.map(e => e.history.map(h => '  '+h).concat('###')).flat())]);
    }
}

export function anySmart<T, U, V, W, X, Z, I, J, K, L, M>(...parsers: [Parser<T>, Parser<U>, Parser<V>, Parser<W>, Parser<X>, Parser<Z>, Parser<I>, Parser<J>, Parser<K>, Parser<L>, Parser<M>]): Parser<T | U | V | W | X | Z | I | J | K | L | M>
export function anySmart<T, U, V, W, X, Z, I, J, K, L>(...parsers: [Parser<T>, Parser<U>, Parser<V>, Parser<W>, Parser<X>, Parser<Z>, Parser<I>, Parser<J>, Parser<K>, Parser<L>]): Parser<T | U | V | W | X | Z | I | J | K | L>
export function anySmart<T, U, V, W, X, Z, I, J, K>(...parsers: [Parser<T>, Parser<U>, Parser<V>, Parser<W>, Parser<X>, Parser<Z>, Parser<I>, Parser<J>, Parser<K>]): Parser<T | U | V | W | X | Z | I | J | K>
export function anySmart<T, U, V, W, X, Z, I, J>(...parsers: [Parser<T>, Parser<U>, Parser<V>, Parser<W>, Parser<X>, Parser<Z>, Parser<I>, Parser<J>]): Parser<T | U | V | W | X | Z | I | J>
export function anySmart<T, U, V, W, X, Z, I>(...parsers: [Parser<T>, Parser<U>, Parser<V>, Parser<W>, Parser<X>, Parser<Z>, Parser<I>]): Parser<T | U | V | W | X | Z | I>
export function anySmart<T, U, V, W, X, Z>(...parsers: [Parser<T>, Parser<U>, Parser<V>, Parser<W>, Parser<X>, Parser<Z>]): Parser<T | U | V | W | X | Z>
export function anySmart<T, U, V, W, X>(...parsers: [Parser<T>, Parser<U>, Parser<V>, Parser<W>, Parser<X>]): Parser<T | U | V | W | X >
export function anySmart<T, U, V, W>(...parsers: [Parser<T>, Parser<U>, Parser<V>, Parser<W>]): Parser<T | U | V | W>
export function anySmart<T, U, V>(...parsers: [Parser<T>, Parser<U>, Parser<V>]): Parser<T | U | V>
export function anySmart<T, U>(...parsers: [Parser<T>, Parser<U>]): Parser<T | U>
export function anySmart<T>(...parsers: [Parser<T>]): Parser<T>
export function anySmart<T>(...parsers: Parser<T>[]): Parser<T> {
    return (ctx: Context): Result<T> => {
        const expected: Failure[] = [];
        for (const parser of parsers) {
            const res = parser(ctx);
            if (isFailure(res)) {
                const filteredHistory = res.history.filter(term => term !== 'seq' && term !== 'map' && term !== 'any' && term !== 'exhaust');
                if (filteredHistory.length > 4) {
                    return failure(res.ctx, res.expected, ['any', ...res.history]);
                }
                expected.push(res);
            }
            else return res;
        }
        const longest = expected.reduce((a, b) => a.ctx.index > b.ctx.index ? a : b);
        return failure(longest.ctx, longest.expected, ['any', ...longest.history]);
    }
}

export function map<A, B>(parser: Parser<A>, fn: (val: A) => B | undefined): Parser<B> {
    return (ctx: Context): Result<B> => {
        const res = parser(ctx);
        if (isFailure(res)) return failure(res.ctx, res.expected, ['map', ...res.history]);
        const newValue = fn(res.value);
        if (newValue === undefined) {
            return failure(res.ctx, 'Error while mapping', ['map']);
        }
        return success(res.ctx, newValue);
    }
}

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

export function exhaust<T,V>(parser: Parser<T>, until: Parser<V> | null = null): Parser<T[]> {
    return (ctx: Context): Result<T[]> => {
        const results: T[] = [];
        // eslint-disable-next-line no-constant-condition
        while (true) {
            const res = parser(ctx);
            if (isFailure(res)) {
                if (until === null || isFailure(until(ctx))) {
                    return failure(res.ctx, res.expected, ['exhaust', ...res.history]);
                }
                return success(ctx, results);
            }
            ctx = res.ctx;
            results.push(res.value);
            if (res.ctx.index === res.ctx.text.length) return success(res.ctx, results);
        }
    }
}

export const spaces: Parser<string> = regex(/ */, 'spaces');

export const spacesPlus: Parser<string> = regex(/ +/, 'spaces');

export const wspaces: Parser<string | null> = opt(regex(/(?:\s|\t|\n|\r)+/, 'whitespace characters'));

export const bool: Parser<'true'|'false'> = regex(/true|false/, 'boolean') as Parser<'true'|'false'>;

export const boolP: Parser<boolean> = map(bool, val => val === 'true');

export const int: Parser<string> = regex(/\d+/, 'integer');

export const intP: Parser<number> = map(int, seq => parseInt(seq, 10));

export const real: Parser<`${number}.${number}`> = expect(map(seq(int, str('.'), int), ([intPart, , decimalPart]) => `${intPart}.${decimalPart}` as `${number}.${number}`), 'real');

export const realP: Parser<number> = map(real, (seq) => parseFloat(seq));

export function between<T, U, V>(left: Parser<U>, parser: Parser<T>, right: Parser<V>): Parser<T> {
    return (ctx: Context): Result<T> => {
        const res = map(seq(left, parser, right), val => val[1])(ctx);
        if (isFailure(res)) {
            const newHistory = [...res.history];
            newHistory.splice(0, 2);
            return failure(res.ctx, res.expected, ['between', ...newHistory]);
        }
        return res;
    }
}

export function zeroOrMany<T, V>(item: Parser<T>, separator: Parser<V>): Parser<T[]> {
    return map(opt(oneOrMany(item, separator)), t => t ?? []);
}

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

export function expect<T>(parser: Parser<T>, expected: string): Parser<T> {
    return (ctx: Context): Result<T> => {
        const res = parser(ctx);
        if (isFailure(res)) {
            return failure(res.ctx, expected, [expected, ...res.history]);
        }
        return res;
    }
}

export function ref<T>(parser: Parser<T>, check: ((p: T) => boolean), expected: string): Parser<T> {
    return (ctx: Context): Result<T> => {
        const res = parser(ctx);
        if (!isFailure(res) && !check(res.value)) {
            return failure(res.ctx, expected, [`ref: ${expected}`]);
        }
        return res;
    }
}

export function Parse<T>(input: string, parser: Parser<T>): T {
    const res = parser({text: input, index: 0});
    if (isFailure(res)) {
        throw new ParseError(`Parse error, expected ${[...res.history].pop()} at char ${res.ctx.index}`, input, res.ctx.index, res.history);
    }
    if (res.ctx.index !== input.length) {
        throw new ParseError(`Parse error at index ${res.ctx.index}`, input, res.ctx.index, []);
    }
    return res.value;
}

export class ParseError extends Error {
    public line: string;
    public column: number;
    public row: number;

    constructor(message: string, input: string, public index: number, public history: string[]) {
        super(message);
        [this.line, this.column, this.row] = this.getInputData(input, index);
    }

    private getInputData(input: string, index: number): [string, number, number] {
        const lines = input.split('\n');
        let row = 0;
        while (index > 0) {
            if (lines[row].length > index) {
                return [lines[row], index + 1, row];
            }
            index -= lines[row].length + 1;
            row += 1;
        }
        return [lines[row], index + 1, row];
    }
}

export function ParseShowErrors<T>(input: string, parser: Parser<T>): T | null {
    try {
        return Parse(input, parser);
    }
    catch (e: unknown) {
        if (e instanceof ParseError) {
            console.error(`${e.message} (line ${e.row}, col ${e.column})`);
            console.error(e.line);
            console.error((e.column ? ' '.repeat(e.column-1) : '') + '^');
            return null;
        }
        else throw e;
    }
}

function logDebug(message: string, index: number, colRow: [number, number], line: string): void {
    console.debug(message.padEnd(60, ' ')+`| at index ${index}`.padEnd(14, ' ') + ` | (line ${colRow[1]}, col ${colRow[0]})`.padEnd(20, ' ') + ` | ${line}`);
}