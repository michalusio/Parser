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

const fused = ['anyString', 'map', 'any', 'str', 'stri'];

export function isStringParser<T>(parser: Parser<T>): parser is AnyStringParser<T> {
    return 'parserType' in parser && fused.includes(parser.parserType as string);
}
export function allStringParsers<T>(parsers: Parser<T>[]): parsers is AnyStringParser<T>[] {
    return parsers.every(isStringParser);
}