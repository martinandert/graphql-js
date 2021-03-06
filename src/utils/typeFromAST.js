/* @flow */
/**
 *  Copyright (c) 2015, Facebook, Inc.
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree. An additional grant
 *  of patent rights can be found in the PATENTS file in the same directory.
 */

import invariant from './invariant';
import { NAMED_TYPE, LIST_TYPE, NON_NULL_TYPE } from '../language/kinds';
import type { Type } from '../language/ast';
import { GraphQLList, GraphQLNonNull } from '../type/definition';
import type { GraphQLType } from '../type/definition';
import type { GraphQLSchema } from '../type/schema';


export default function typeFromAST(
  schema: GraphQLSchema,
  inputTypeAST: Type
): ?GraphQLType {
  var innerType;
  if (inputTypeAST.kind === LIST_TYPE) {
    innerType = typeFromAST(schema, inputTypeAST.type);
    return innerType && new GraphQLList(innerType);
  }
  if (inputTypeAST.kind === NON_NULL_TYPE) {
    innerType = typeFromAST(schema, inputTypeAST.type);
    return innerType && new GraphQLNonNull(innerType);
  }
  invariant(inputTypeAST.kind === NAMED_TYPE, 'Must be a named type.');
  return schema.getType(inputTypeAST.name.value);
}
