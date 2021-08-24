import { Parser, regex } from '../parser/parser';

export const type = (expects: string): Parser<string> => regex(/[a-zA-Z][\w\d]*/, expects);
export const name = (expects: string): Parser<string> => regex(/[a-zA-Z_][\w\d]*/, expects);

export const functionReturnType = type('function return type');
export const parameterType = type('parameter type');
export const objectName = type('object name');
export const variableType = type('variable type');
export const variableName = name('variable name');
export const parameterName = name('parameter name');
export const functionName = name('function name');