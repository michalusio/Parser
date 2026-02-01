import { Context, failure, isFailure, Parser, Result, success, Token } from '../types';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { any } from './any';

/** Allows to make a condition on the result of the parsing function.
 * @returns A parser returning the same but also performing a given check on the result.
 */
export function ref<T>(parser: Parser<T>, check: ((p: T) => boolean), expected?: string): Parser<T> {
  return (ctx: Context): Result<T> => {
      const res = parser(ctx);
      if (!isFailure(res) && !check(res.value)) {
          const phrase = expected ?? 'check';
          return failure(res.ctx, phrase, [`ref: ${phrase}`]);
      }
      return res;
  }
}

/** Changes the expected value for when the parser fails.
 * @returns A parser returning the same but with a different expected value.
 */
export function expect<T>(parser: Parser<T>, expected: string): Parser<T> {
  return (ctx: Context): Result<T> => {
      const res = parser(ctx);
      if (isFailure(res)) {
          return failure(res.ctx, expected, [expected, ...res.history]);
      }
      return res;
  }
}

/** Changes the expected value for when the parser fails. Erases the previous history.
 * @returns A parser returning the same but with a different expected value.
 */
export function expectErase<T>(parser: Parser<T>, expected: string): Parser<T> {
  return (ctx: Context): Result<T> => {
      const res = parser(ctx);
      if (isFailure(res)) {
          return failure(res.ctx, expected, [expected]);
      }
      return res;
  }
}

/**
 * Marks a parser as a branch that has to be executed to the end by the {@link any} parser
 */
export function surely<T>(parser: Parser<T>): Parser<T> {
    return expect(parser, 'surely');
}

/**
 * Wraps the value returned by the parser with the token information (the start and end index in the text)
 * @returns A parser returning the value wrapped in token information.
 */
export function token<T>(parser: Parser<T>): Parser<Token<T>> {
  return (ctx) => {
    const result = parser(ctx);
    if (result.success) {
      return {
        ...result,
        value: {
          value: result.value,
          start: ctx.index,
          end: result.ctx.index
        }
      }
    }
    return result;
  }
}

/**
 * Checks whether the parser parses successfully, but doesn't move the cursor forward
 */
export function lookaround<T>(parser: Parser<T>): Parser<void> {
  return (ctx) => {
    const result = parser(ctx);
    if (result.success) {
      return success(ctx, void 0);
    }
    return failure(ctx, result.expected, ['lookaround', ...result.history]);
  }
}

/**
 * Turns a function creating a parser into a parser. Useful for recursive grammars.
 */
export function lazy<T>(parserGetter: () => Parser<T>): Parser<T> {
  let parser: Parser<T>;
  return (ctx) => {
    parser ??= parserGetter();
    return parser(ctx);
  }
}