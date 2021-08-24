import { between, map, oneOrMany, opt, Parser, seq, spacesPlus, str, wspaces } from '../parser/parser';
import { objectName, parameterName, parameterType } from './core';
import { ObjectDeclaration, Property } from './interfaces';

function property(): Parser<Property> {
  return map(
    seq(
      wspaces,
      parameterType,
      wspaces,
      parameterName,
      wspaces,
      str(';')
    ),
    ([, type, , name, ]) => ({kind: 'property', name, type})
  );
}

function properties(): Parser<Property[]> {
  return map(opt(oneOrMany(property(), wspaces)), (props) => (props ?? []));
}

export function objectDeclaration(): Parser<ObjectDeclaration> {
  return map(
      seq(
          str('type'),
          spacesPlus,
          objectName,
          between(seq(wspaces, str('{')), properties(), seq(wspaces, str('}')))
      ),
      ([, , name, params]) => ({kind: 'object', name, properties: params})
  );
}
