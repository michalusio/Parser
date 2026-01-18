import { Parser } from "../types";
import { AnyStringParser } from "./anyString";

export const shouldPerformFusions = () => performFusions;

let performFusions = true;
/**
 * Disables all parser combinator fusions.
 * 
 * Should probably be used only for testing performance.
 */
export const toggleFusions = (value: boolean) => {
  performFusions = value;
};

export function isStringParser<T>(parser: Parser<T>): parser is AnyStringParser<T> {
    return 'parserType' in parser && typeof parser.parserType === 'string' && parser.parserType === 'anyString';
}
export function allStringParsers<T>(parsers: Parser<T>[]): parsers is AnyStringParser<T>[] {
    return parsers.every(isStringParser);
}