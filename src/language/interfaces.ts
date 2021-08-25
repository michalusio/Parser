export type ObjectDeclaration = Readonly<{
  kind: 'object';
  name: string;
  properties: Property[];
}>;

export type Property = Readonly<{
  kind: 'property';
  name: string;
  type: string;
}>;

export type FunctionDeclaration = Readonly<{
  kind: 'function';
  name: string;
  type: string;
  params: Parameter[];
  body: Scope;
}>;

export type Scope = Readonly<{
  kind: 'scope';
  lines: Statement[];
}>;

export type Parameter = Readonly<{
  kind: 'parameter';
  name: string;
  type: string;
}>;

export type Program = Readonly<{
  kind: 'program';
  nodes: Declaration[];
}>;

export type Declaration = FunctionDeclaration | ObjectDeclaration;

export type LetStatement = Readonly<{
  kind: 'let';
  name: string;
  type: string;
  assignment: RStatement | undefined;
}>;

export type AssignmentStatement = Readonly<{
  kind: 'assignment';
  to: LStatement;
  value: RStatement;
}>;

export type IfElseStatement = Readonly<{
  kind: 'if';
  condition: RStatement;
  then: Statement;
  elseThen: Statement | undefined;
}>;

export type Statement = LetStatement | MethodCallStatement | AssignmentStatement | IfElseStatement | Scope;

export type IntValueStatement = Readonly<{
  kind: 'intValue',
  value: number
}>;

export type RealValueStatement = Readonly<{
  kind: 'realValue',
  value: number
}>;

export type StringValueStatement = Readonly<{
  kind: 'stringValue',
  value: string
}>;

export type MethodCallStatement = Readonly<{
  kind: 'methodCall',
  from: LStatement,
  args: RStatement[]
}>;

export type RStatement =
IntValueStatement |
RealValueStatement |
StringValueStatement |
LStatement |
MethodCallStatement |
ArithmeticStatement;

export type ArithmeticStatement = Readonly<{
  kind: 'arithmetic',
  operator: '+' | '-' | '*' | '/',
  left: RStatement,
  right: RStatement
}>;

export type VariableStatement = Readonly<{
  kind: 'variable',
  name: string
}>;

export type PropertyStatement = Readonly<{
  kind: 'propertyAccess',
  to: LStatement,
  from: LStatement | MethodCallStatement
}>;

export type IndexingStatement = Readonly<{
  kind: 'indexing',
  index: RStatement;
  from: LStatement
}>;

export type LStatement = VariableStatement | PropertyStatement | IndexingStatement;

export type ASTStatement = Statement | RStatement | Declaration | Program | Property | Parameter;