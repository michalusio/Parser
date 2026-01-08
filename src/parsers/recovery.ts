import { Failure, isFailure, Parser } from "../types";

/**
 * Tries to automatically recover a parsing failure by removing characters from the front.
 * 
 * If the inner parser fails, the recovery parser will restart parsing skipping a character, up to {@link chars} skips
 */
export function recoverBySkippingChars<T>(
  parser: Parser<T>,
  chars: number
): Parser<T> {
  return (ctx) => {
    let firstFailure: Failure | null = null;
    for (let i = 0; i <= chars; i++) {
      const result = parser({
        index: ctx.index + i,
        path: ctx.path,
        text: ctx.text,
      });
      if (isFailure(result)) {
        firstFailure ??= result;
      }
      else return result;
    }
    return firstFailure!;
  };
}

/**
 * Tries to automatically recover a parsing failure by adding characters to the front.
 * 
 * If the inner parser fails, the recovery parser will restart parsing adding a character, up to {@link chars}
 * @todo Inserting characters in the middle of a context string is inefficient - maybe there's a better way?
 */
export function recoverByAddingChars<T>(
  parser: Parser<T>,
  chars: string,
): Parser<T> {
  return (ctx) => {
    let firstFailure: Failure | null = null;

    for (let i = 0; i <= chars.length; i++) {
      const addedChars = chars.slice(0, i);
      const result = parser({
        index: ctx.index,
        path: ctx.path,
        text: `${ctx.text.slice(0, ctx.index)}${addedChars}${ctx.text.slice(
          ctx.index
        )}`,
      });
      if (isFailure(result)) {
        firstFailure ??= result;
      }
      else return result;
    }
    return firstFailure!;
  };
}