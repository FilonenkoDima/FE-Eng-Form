import {AbstractControl} from '@angular/forms';
import {of} from 'rxjs';

export function emailIsUnique(control: AbstractControl) {
  if (control.value !== 'test@test.test') {
    return of(null);
  }

  return of({notUnique: true});
}
