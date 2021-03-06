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
import { GraphQLNonNull } from '../../type/definition';
import keyMap from '../../utils/keyMap';
import { missingFieldArgMessage, missingDirectiveArgMessage } from '../errors';


/**
 * Provided required arguments
 *
 * A field or directive is only valid if all required (non-null) field arguments
 * have been provided.
 */
export default function ProvidedNonNullArguments(
  context: ValidationContext
): any {
  return {
    Field: {
      // Validate on leave to allow for deeper errors to appear first.
      leave(fieldAST) {
        var fieldDef = context.getFieldDef();
        if (!fieldDef) {
          return false;
        }
        var errors = [];
        var argASTs = fieldAST.arguments || [];

        var argASTMap = keyMap(argASTs, arg => arg.name.value);
        fieldDef.args.forEach(argDef => {
          var argAST = argASTMap[argDef.name];
          if (!argAST && argDef.type instanceof GraphQLNonNull) {
            errors.push(new GraphQLError(
              missingFieldArgMessage(
                fieldAST.name.value,
                argDef.name,
                argDef.type
              ),
              [fieldAST]
            ));
          }
        });

        if (errors.length > 0) {
          return errors;
        }
      }
    },

    Directive: {
      // Validate on leave to allow for deeper errors to appear first.
      leave(directiveAST) {
        var directiveDef = context.getDirective();
        if (!directiveDef) {
          return false;
        }
        var errors = [];
        var argASTs = directiveAST.arguments || [];

        var argASTMap = keyMap(argASTs, arg => arg.name.value);
        directiveDef.args.forEach(argDef => {
          var argAST = argASTMap[argDef.name];
          if (!argAST && argDef.type instanceof GraphQLNonNull) {
            errors.push(new GraphQLError(
              missingDirectiveArgMessage(
                directiveAST.name.value,
                argDef.name,
                argDef.type
              ),
              [directiveAST]
            ));
          }
        });

        if (errors.length > 0) {
          return errors;
        }
      }
    }
  };
}
