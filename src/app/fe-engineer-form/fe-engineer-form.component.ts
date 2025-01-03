import {Component, inject} from '@angular/core';
import {AsyncValidatorFn, FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule} from '@angular/material/form-field';
import {MatInput} from '@angular/material/input';
import {MatNativeDateModule} from '@angular/material/core';
import {DatePipe} from '@angular/common';
import {of} from 'rxjs';

const asyncRequiredValidator: AsyncValidatorFn = (control) => {
  const isValid = !!control.value;
  return of(isValid ? null : { required: true });
};

@Component({
  selector: 'app-fe-engineer-form',
  imports: [ReactiveFormsModule, MatDatepickerModule, MatFormFieldModule, MatInput, MatNativeDateModule],
  templateUrl: './fe-engineer-form.component.html',
  styleUrl: './fe-engineer-form.component.css',
  providers: [DatePipe],
  standalone: true
})
export class FeEngineerFormComponent {
  private datePipe = inject(DatePipe);
  public form = new FormGroup({
    name: new FormControl('', {validators: [Validators.required]}),
    lastName: new FormControl('',  {validators: [Validators.required]}),
    dateOfBirth: new FormControl('',  {validators: [Validators.required]}),
  })

  get nameIsInvalid() {
    return (
      this.form.controls.name.touched &&
      this.form.controls.name.invalid
    );
  }

  get lastNameIsInvalid() {
    return (
      this.form.controls.lastName.touched &&
      this.form.controls.lastName.invalid
    );
  }

  get dateOfBirthIsInvalid() {
    return (
      this.form.controls.dateOfBirth.touched &&
      this.form.controls.dateOfBirth.invalid
    );
  }

  onSubmit() {
    if (this.form.invalid) {
      console.log('INVALID FORM');
      return;
    }

    const formattedDate = this.datePipe.transform(this.form.value.dateOfBirth, 'dd-MM-yyyy');
    console.log(this.form.value.name, this.form.value.lastName, formattedDate);
  }
}
