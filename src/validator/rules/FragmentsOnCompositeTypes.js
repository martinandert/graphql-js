/* @flow */
/**
 *  Copyright (c) 2015, Facebook, Inc.
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree. An additional grant
 *  of patent rights can be found in the PATENTS file in the same directory.
 */

import type { ValidationContext } from '../index';

import { GraphQLError } from '../../error';
import { isCompositeType } from '../../type/definition';
import { print } from '../../language/printer';
import {
  inlineFragmentOnNonCompositeErrorMessage,
  fragmentOnNonCompositeErrorMessage
} from '../errors';

/**
 * Fragments on composite type
 *
 * Fragments use a type condition to determine if they apply, since fragments
 * can only be spread into a composite type (object, interface, or union), the
 * type condition must also be a composite type.
 */
export default function FragmentsOnCompositeType(
  context: ValidationContext
): any {
  return {
    InlineFragment(node) {
      var type = context.getType();
      if (type && !isCompositeType(type)) {
        return new GraphQLError(
          inlineFragmentOnNonCompositeErrorMessage(print(node.typeCondition)),
          [node.typeCondition]
        );
      }
    },
    FragmentDefinition(node) {
      var type = context.getType();
      if (type && !isCompositeType(type)) {
        return new GraphQLError(
          fragmentOnNonCompositeErrorMessage(
            node.name.value,
            print(node.typeCondition)
          ),
          [node.typeCondition]
        );
      }
    }
  };
}
