import { between, map, oneOrMany, opt, Parser, seq, spacesPlus, str } from '../parser/parser';
import { objectName, parameterName, parameterType, wspacesOrComment } from './core';
import { ObjectDeclaration, Property } from './interfaces';

function property(): Parser<Property> {
  return map(
    seq(
      wspacesOrComment,
      parameterType,
      wspacesOrComment,
      parameterName,
      wspacesOrComment,
      str(';')
    ),
    ([, type, , name, ]) => ({kind: 'property', name, type})
  );
}

function properties(): Parser<Property[]> {
  return map(opt(oneOrMany(property(), wspacesOrComment)), (props) => (props ?? []));
}

export function objectDeclaration(): Parser<ObjectDeclaration> {
  return map(
      seq(
          str('type'),
          spacesPlus,
          objectName,
          between(seq(wspacesOrComment, str('{')), properties(), seq(wspacesOrComment, str('}')))
      ),
      ([, , name, params]) => ({kind: 'object', name, properties: params})
  );
}
