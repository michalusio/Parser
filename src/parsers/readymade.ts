import { Parser } from "../types";
import { any } from "./any";
import { between } from "./between";
import { zeroOrMany } from "./zeroOrMany";
import { map } from "./map";
import { regex } from "./regex";
import { seq } from "./seq";
import { str } from "./str";
import { lazy, surely } from "./utilities";

export type Json = string | number | boolean | null | { [key: number]: Json } | { [key: string]: Json };

const WhiteSpace = regex(/\s*/m, 'whitespace');

const True = map(str("true"), () => true);
const False = map(str("false"), () => false);
const Null = map(str("null"), () => null);
const LCurly = str("{");
const RCurly = surely(str("}"));
const LSquare = str("[");
const RSquare = surely(str("]"));
const Quote = str('"');
const Comma = str(",");
const Colon = surely(str(":"));

const replacements: Record<string, string> = {
    '\\\\': '\\',
    '\\0': '\0',
    '\\b': '\b',
    '\\f': '\f',
    '\\n': '\n',
    '\\r': '\r',
    '\\t': '\t',
    '\\v': '\v',
    '\\"': '"'
};

const StringLiteral = between(Quote,
    map(
        regex(/(?:[^\\"]|\\(?:[0bfnrtv"\\]|u[0-9a-fA-F]{4}))*/, 'string literal'),
        str => str.replace(/\\(?:[0bfnrtv"\\]|u[0-9a-fA-F]{4})/g, function(replace) {
        const tabled = replacements[replace];
        if (tabled != null) {
            return tabled;
        }
        return String.fromCharCode(parseInt(replace.slice(2), 16));
    })
), Quote);
const NumberLiteral = map(regex(/-?(?:0|(?:[1-9]\d*))(?:\.\d+)?(?:[eE][+-]?\d+)?/, 'number literal'), parseFloat);

const JArray: Parser<{ [key: number]: Json }> = lazy(() => map(seq(
        LSquare,
        surely(
            seq(
                WhiteSpace,
                zeroOrMany(Value, seq(WhiteSpace, Comma, WhiteSpace)),
                WhiteSpace,
                RSquare
            )
        )
    ),
    (data) => data[1][1]
));

const JObject: Parser<{ [key: string]: Json }> = lazy(() => map(seq(
        LCurly,
        surely(
            seq(
                WhiteSpace,
                zeroOrMany(ObjectEntry, seq(WhiteSpace, Comma, WhiteSpace)),
                WhiteSpace,
                RCurly
            )
        )
    ),
    data => Object.fromEntries(data[1][1])
));

const Value = any(
    StringLiteral,
    NumberLiteral,
    JObject,
    JArray,
    True,
    False,
    Null,
);

const ObjectEntry = map(
    seq(StringLiteral, surely(seq(WhiteSpace, Colon, WhiteSpace, Value))),
    ([key, rest]) => ([key, rest[3]] as const)
);

export const json: Parser<Json> = between(WhiteSpace, Value, WhiteSpace);