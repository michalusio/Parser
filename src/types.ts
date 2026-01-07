export type Parser<T> = (ctx: Context) => Result<T>;

export type Context = Readonly<{
  text: string;
  path: string;
  index: number;
}>;

export type Result<T> = Success<T> | Failure;

export type Success<T> = Readonly<{
  success: true;
  value: T;
  ctx: Context;
}>;

export type Failure = Readonly<{
  success: false;
  expected: string;
  ctx: Context;
  history: string[];
}>;

export function isFailure(input: unknown): input is Failure {
    return !(input as Failure).success;
}

export function success<T>(ctx: Context, value: T): Success<T> {
    return { success: true, value, ctx };
}

export function failure(ctx: Context, expected: string, history: string[]): Failure {
  return { success: false, expected, ctx, history };
}

export function result<T>(value: T): Parser<T> {
    return (ctx: Context): Result<T> => success(ctx, value);
}

export function fail<T>(reason: string): Parser<T> {
    return (ctx: Context): Result<T> => failure(ctx, reason, [reason]);
}

export class ParseError extends Error {
  public readonly line: string;
  public readonly column: number;
  public readonly row: number;

  constructor(message: string, input: string, public readonly index: number, public readonly history: string[]) {
      super(message);
      [this.line, this.column, this.row] = this.getInputData(input, index);
  }

  private getInputData(input: string, index: number): [string, number, number] {
      const lines = input.split('\n');
      let row = 0;
      while (index > 0) {
          if (lines[row].length > index) {
              return [lines[row], index + 1, row + 1];
          }
          index -= lines[row].length + 1;
          row += 1;
      }
      return [lines[row], index + 1, row + 1];
  }

  public getPrettyErrorMessage(): string {
    return `${this.message} (line ${this.row}, col ${this.column}):\n${this.line}\n${(this.column > 0 ? '-'.repeat(this.column - 1) : '') + '^'}`;
  }
}