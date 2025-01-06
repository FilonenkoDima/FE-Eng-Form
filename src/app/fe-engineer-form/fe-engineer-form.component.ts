import { FeEngineerFormService } from './fe-engineer-form.service';

import {Component, inject, OnInit} from '@angular/core';
import {
  AbstractControl, FormArray,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInput, MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { DatePipe } from '@angular/common';
import { of } from 'rxjs';
import {MatIcon} from '@angular/material/icon';
import {MatButton, MatIconButton} from '@angular/material/button';
import {MatToolbar} from '@angular/material/toolbar';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

function emailIsUnique(control: AbstractControl) {
  if (control.value !== 'test@test.test') {
    return of(null);
  }

  return of({ notUnique: true });
}

@Component({
  selector: 'app-fe-engineer-form',
  imports: [
    ReactiveFormsModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInput,
    MatNativeDateModule,
    MatInputModule,
    MatIcon,
    MatIconButton,
    MatButton,
    MatToolbar,
    NgbModule
  ],
  templateUrl: './fe-engineer-form.component.html',
  styleUrl: './fe-engineer-form.component.css',
  providers: [DatePipe],
  standalone: true,
})
export class FeEngineerFormComponent implements OnInit {
  public form = new FormGroup({
    name: new FormControl<string>('', { validators: [Validators.required] }),
    lastName: new FormControl<string>('', {
      validators: [Validators.required],
    }),
    dateOfBirth: new FormControl<string>('', {
      validators: [Validators.required],
    }),
    frontendTechnology: new FormControl<typeof this.frontendTechnologies | ''>(
      '',
      { validators: [Validators.required] },
    ),
    frontendTechnologyVersion: new FormControl<string>(
      {
        value: '',
        disabled: true,
      },
      { validators: [Validators.required] },
    ),
    email: new FormControl<string>('', {
      validators: [Validators.required, Validators.email],
      asyncValidators: emailIsUnique,
    }),
    hobbies: new FormArray([], Validators.required),
  });
  private datePipe = inject(DatePipe);
  private feTechnologiesVersionsService = inject(FeEngineerFormService);

  get frontendTechnologies(): string[] {
    return Object.keys(this.feTechnologiesVersionsService.frontendTechnologies);
  }

  get frontendTechnologyVersions(): string[] {
    return this.feTechnologiesVersionsService.frontendTechnologies[
      `${this.form.value.frontendTechnology}`
    ];
  }

  get hobbies(): FormArray {
    return this.form.get('hobbies') as FormArray;
  }

  //#region input validator
  get nameIsInvalid() {
    return this.form.controls.name.touched || this.form.controls.name.invalid;
  }

  get lastNameIsInvalid() {
    return (
      this.form.controls.lastName.touched || this.form.controls.lastName.invalid
    );
  }

  get dateOfBirthIsInvalid() {
    return (
      this.form.controls.dateOfBirth.touched ||
      this.form.controls.dateOfBirth.invalid
    );
  }

  get frontendTechnologyIsInvalid() {
    return (
      this.form.controls.frontendTechnology.touched ||
      this.form.controls.frontendTechnology.invalid
    );
  }

  get frontendTechnologyVersionIsInvalid() {
    return (
      this.form.controls.frontendTechnologyVersion.touched ||
      this.form.controls.frontendTechnologyVersion.invalid
    );
  }

  get emailIsInvalid() {
    return (
      this.form.controls.email.touched ||
      this.form.controls.email.dirty ||
      this.form.controls.email.invalid
    );
  }

  get hobbiesIsInvalid() {
    return (
      (this.form.controls.hobbies.invalid ||
        this.form.controls.hobbies.touched) &&
      this.hobbies.length < 1
    );
  }
  //#endregion

  ngOnInit(): void {
    this.form.get('frontendTechnology')?.valueChanges.subscribe((value) => {
      const frontendTechnologyVersionControl = this.form.get(
        'frontendTechnologyVersion',
      );
      if (value) {
        frontendTechnologyVersionControl?.enable();
      } else {
        frontendTechnologyVersionControl?.disable();
      }
    });
  }

  // Method to add a new hobby FormGroup
  public addHobby() {
    const hobbyGroup = new FormGroup({
      name: new FormControl('', Validators.required),
      duration: new FormControl('', Validators.required),
    });
    this.hobbies.push(hobbyGroup);
  }

  // Method to remove a hobby
  public removeHobby(index: number) {
    this.hobbies.removeAt(index);
  }

  onSubmit() {
    if (this.form.invalid) {
      console.log('INVALID FORM');
      return;
    }

    const formattedDate = this.datePipe.transform(
      this.form.value.dateOfBirth,
      'dd-MM-yyyy',
    );

    const dataFEForm = {
      firstName: this.form.value.name,
      lastName: this.form.value.lastName,
      dateOfBirth: formattedDate,
      framework: this.form.value.frontendTechnology,
      frameworkVersion: this.form.value.frontendTechnologyVersion,
      email: this.form.value.email,
      hobbies: this.form.value.hobbies

    }

    console.log(dataFEForm);
  }
}
