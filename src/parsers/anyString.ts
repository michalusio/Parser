import { Context, failure, Parser, Result, success } from "../types";
import { StrIParser, StrParser } from "./str";

type AnyStringParser<T> = Parser<T> & {
    parserType: 'anyString',
    /**
     * if flag is true, match case-insensitive
     */
    matches: (readonly [string, boolean])[];
};

export type OptimizableStrParser<T> = AnyStringParser<T> | StrParser<T> | StrIParser<T>;

/**
 * Optimization for `any(str(), str(), ...)` which replaces the parser tree with one parser which tries all strings together
 */
export function anyString<T extends string, U extends string, V extends string, W extends string, X extends string, Z extends string, I extends string, J extends string, K extends string, L extends string, M extends string>(...parsers: [OptimizableStrParser<T>, OptimizableStrParser<U>, OptimizableStrParser<V>, OptimizableStrParser<W>, OptimizableStrParser<X>, OptimizableStrParser<Z>, OptimizableStrParser<I>, OptimizableStrParser<J>, OptimizableStrParser<K>, OptimizableStrParser<L>, OptimizableStrParser<M>]): AnyStringParser<T | U | V | W | X | Z | I | J | K | L | M>
export function anyString<T extends string, U extends string, V extends string, W extends string, X extends string, Z extends string, I extends string, J extends string, K extends string, L extends string>(...parsers: [OptimizableStrParser<T>, OptimizableStrParser<U>, OptimizableStrParser<V>, OptimizableStrParser<W>, OptimizableStrParser<X>, OptimizableStrParser<Z>, OptimizableStrParser<I>, OptimizableStrParser<J>, OptimizableStrParser<K>, OptimizableStrParser<L>]): AnyStringParser<T | U | V | W | X | Z | I | J | K | L>
export function anyString<T extends string, U extends string, V extends string, W extends string, X extends string, Z extends string, I extends string, J extends string, K extends string>(...parsers: [OptimizableStrParser<T>, OptimizableStrParser<U>, OptimizableStrParser<V>, OptimizableStrParser<W>, OptimizableStrParser<X>, OptimizableStrParser<Z>, OptimizableStrParser<I>, OptimizableStrParser<J>, OptimizableStrParser<K>]): AnyStringParser<T | U | V | W | X | Z | I | J | K>
export function anyString<T extends string, U extends string, V extends string, W extends string, X extends string, Z extends string, I extends string, J extends string>(...parsers: [OptimizableStrParser<T>, OptimizableStrParser<U>, OptimizableStrParser<V>, OptimizableStrParser<W>, OptimizableStrParser<X>, OptimizableStrParser<Z>, OptimizableStrParser<I>, OptimizableStrParser<J>]): AnyStringParser<T | U | V | W | X | Z | I | J>
export function anyString<T extends string, U extends string, V extends string, W extends string, X extends string, Z extends string, I extends string>(...parsers: [OptimizableStrParser<T>, OptimizableStrParser<U>, OptimizableStrParser<V>, OptimizableStrParser<W>, OptimizableStrParser<X>, OptimizableStrParser<Z>, OptimizableStrParser<I>]): AnyStringParser<T | U | V | W | X | Z | I>
export function anyString<T extends string, U extends string, V extends string, W extends string, X extends string, Z extends string>(...parsers: [OptimizableStrParser<T>, OptimizableStrParser<U>, OptimizableStrParser<V>, OptimizableStrParser<W>, OptimizableStrParser<X>, OptimizableStrParser<Z>]): AnyStringParser<T | U | V | W | X | Z>
export function anyString<T extends string, U extends string, V extends string, W extends string, X extends string>(...parsers: [OptimizableStrParser<T>, OptimizableStrParser<U>, OptimizableStrParser<V>, OptimizableStrParser<W>, OptimizableStrParser<X>]): AnyStringParser<T | U | V | W | X >
export function anyString<T extends string, U extends string, V extends string, W extends string>(...parsers: [OptimizableStrParser<T>, OptimizableStrParser<U>, OptimizableStrParser<V>, OptimizableStrParser<W>]): AnyStringParser<T | U | V | W>
export function anyString<T extends string, U extends string, V extends string>(...parsers: [OptimizableStrParser<T>, OptimizableStrParser<U>, OptimizableStrParser<V>]): AnyStringParser<T | U | V>
export function anyString<T extends string, U extends string>(...parsers: [OptimizableStrParser<T>, OptimizableStrParser<U>]): AnyStringParser<T | U>
export function anyString<T extends string>(...parsers: [OptimizableStrParser<T>]): AnyStringParser<T>
export function anyString<T extends string>(...parsers: OptimizableStrParser<T>[]): AnyStringParser<T>
export function anyString<T extends string>(...parsers: OptimizableStrParser<T>[]): AnyStringParser<T> {
    const matches = parsers.flatMap(p => {
        switch (p.parserType) {
            case 'anyString':
                return p.matches;
            case 'str':
                return [[p.match, false] as const];
            case 'stri':
                return [[p.match, true] as const];
        }
    });
    const lastMatchInQuotes = `'${matches[matches.length - 1][0]}'`;
    let tree: SearchNode
    return Object.assign((ctx: Context): Result<T> => {
        tree ??= createSearchTree(matches);
        const result = searchThroughTree(tree, ctx.text, ctx.index);
        if (result) {
            return success({ ...ctx, index: result.end }, matches[result.matchIndex][0] as T);
        } else {
            return failure(ctx, lastMatchInQuotes, ['any', lastMatchInQuotes]);
        }
    }, { parserType: 'anyString', matches }) as AnyStringParser<T>;
}

type SearchNode = {
    matchIndex?: number;
} & Map<string, SearchNode>;

function createSearchTree(matches: (readonly [string, boolean])[]): SearchNode {
    const tree: SearchNode = new Map();
    matches.forEach((match, index) => addMatchToTree(tree, match, index));
    return tree;    
}

function addMatchToTree(node: SearchNode, match: readonly [string, boolean], idIndex: number, charIndex: number = 0) {
    if (charIndex >= match[0].length) {
        if (node.matchIndex != undefined) {
            node.matchIndex = Math.min(node.matchIndex, idIndex);
        } else {
            node.matchIndex = idIndex;
        }
    } else {
        const char = match[0][charIndex];
        const lowercase = char.toLowerCase();
        const uppercase = char.toUpperCase();
        const newNode: SearchNode = new Map();
        if (match[1] && (lowercase !== uppercase)) {
            const lower = node.get(lowercase) ?? newNode;
            const upper = node.get(uppercase) ?? newNode;
            node.set(lowercase, lower);
            node.set(uppercase, upper);
            addMatchToTree(lower, match, idIndex, charIndex + 1);
            if (lower !== upper) {
                addMatchToTree(upper, match, idIndex, charIndex + 1);
            }
        } else {
            const charNode = node.get(char) ?? newNode;
            node.set(char, charNode);
            const lower = node.get(lowercase);
            if (lower === node.get(uppercase)) {
                const copy: SearchNode = new Map(lower!.entries());
                copy.matchIndex = lower!.matchIndex;
                node.set(uppercase, copy);
            }
            addMatchToTree(charNode, match, idIndex, charIndex + 1);
        }
    }
}

function searchThroughTree(node: SearchNode, text: string, start: number): { end: number, matchIndex: number } | undefined {
    let lastSuccessIndex: number | undefined = undefined;
    let lastSuccessMatchIndex: number | undefined = undefined;
    let currentNode: SearchNode | undefined = node;
    for (let index = start; index < text.length; index++) {
        const char = text[index];
        if (currentNode!.matchIndex != undefined && (lastSuccessMatchIndex == undefined || currentNode!.matchIndex <= lastSuccessMatchIndex)) {
            lastSuccessIndex = index;
            lastSuccessMatchIndex = currentNode!.matchIndex;
        }
        currentNode = currentNode!.get(char);
        if (!currentNode) break;
    }
    if (currentNode && currentNode.matchIndex != undefined && (lastSuccessMatchIndex == undefined || currentNode.matchIndex <= lastSuccessMatchIndex)) {
        lastSuccessIndex = text.length;
        lastSuccessMatchIndex = currentNode.matchIndex;
    }
    return lastSuccessIndex == undefined
        ? undefined
        : { end: lastSuccessIndex, matchIndex: lastSuccessMatchIndex! };
}