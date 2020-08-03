import { Pipe, PipeTransform } from '@angular/core';
import { StringUtils } from '../utils/string.utils';

/**
 * Pipe to control max length of the string.
 * If string exceeds max characters passed to pipe then exceeded part of the string replace with ellipsis.
 */
@Pipe({
  name: 'amountCharacters'
})
export class AmountCharactersPipe implements PipeTransform {

  public transform(str: string, maxCharacters: number): string {
    if (!str || !maxCharacters || str.length <= maxCharacters) {
      return str;
    }
    const maxCharactersWithEllipsis = maxCharacters - 3;
    if (str.length > maxCharactersWithEllipsis) {
      const separatedString = str.slice(0, maxCharactersWithEllipsis).split(StringUtils.SPACE);
      separatedString.slice(separatedString.length - 1, 1);
      return separatedString.join(StringUtils.SPACE).trim() + StringUtils.ELLIPSIS;
    }

    return str;
  }

}
