import { Component, inject, OnInit } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule, MatOption } from '@angular/material/core';
import { MatIcon } from '@angular/material/icon';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatToolbar } from '@angular/material/toolbar';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MatSelect } from '@angular/material/select';
import moment from 'moment';
import { map, Observable, switchMap } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { FrameworkVersions } from '../../core/models/framework-versions.model';

import { FeEngineerFormService } from '../../core/services/fe-engineer-form.service';
import { emailIsUnique } from '../../core/validators/email-unique.validator';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-fe-engineer-form',
  imports: [
    ReactiveFormsModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatNativeDateModule,
    MatInputModule,
    MatIcon,
    MatIconButton,
    MatButton,
    MatToolbar,
    NgbModule,
    MatSelect,
    MatOption,
    AsyncPipe,
  ],
  templateUrl: './fe-engineer-form.component.html',
  styleUrl: './fe-engineer-form.component.css',
  providers: [],
  standalone: true,
})
export class FeEngineerFormComponent implements OnInit {
  private formBuilder: FormBuilder = inject(FormBuilder);
  private feTechnologiesVersionsService: FeEngineerFormService = inject(
    FeEngineerFormService,
  );

  /** Frontend engineer form. */
  public form = this.formBuilder.group({
    name: ['', [Validators.required]],
    lastName: ['', [Validators.required]],
    dateOfBirth: [null, [Validators.required]],
    frontendTechnology: ['', [Validators.required]],
    frontendTechnologyVersion: [
      { value: '', disabled: true },
      [Validators.required],
    ],
    email: ['', [Validators.required, Validators.email], [emailIsUnique]],
    hobbies: this.formBuilder.array([], Validators.required),
  });

  /** Get for the available frontend technologies from the service. */
  public frontendTechnologies$: Observable<string[]> =
    this.feTechnologiesVersionsService.frontendTechnologies$.pipe(
      map((data: FrameworkVersions): string[] => Object.keys(data)),
    );

  /** Versions of the selected frontend technology. */
  public frontendTechnologyVersions$: Observable<string[]> =
    this.form.controls.frontendTechnology.valueChanges.pipe(
      switchMap((selectedTechnology) =>
        this.feTechnologiesVersionsService.frontendTechnologies$.pipe(
          map((technologies: FrameworkVersions): string[] =>
              technologies[selectedTechnology!],
          ),
        ),
      ),
    );

  /** check correct input for hobbies. */
  public hobbiesIsInvalid$: Observable<boolean> =
    this.form.controls.hobbies.statusChanges.pipe(map(() =>
        (this.form.controls.hobbies.invalid || this.form.controls.hobbies.touched) &&
        (this.form.get('hobbies') as FormArray).length < 1,
      ),
    );

  /**
   * Sets up a subscription to the 'frontendTechnology' value changes to enable
   * or disable the 'frontendTechnologyVersion' control.
   */
  public ngOnInit(): void {
    const frontendTechnologyControl = this.form.get('frontendTechnology');
    if (frontendTechnologyControl) {
      frontendTechnologyControl.valueChanges.pipe(takeUntilDestroyed())
        .subscribe((value) => {const frontendTechnologyVersionControl = this.form.get('frontendTechnologyVersion',);
          if (value) {
            frontendTechnologyVersionControl?.enable();
          }
        });
    }
  }

  /** Method to add a new hobby to the hobbies FormArray. */
  public addHobby() {
    const hobbyGroup = this.formBuilder.group({
      name: ['', [Validators.required]],
      duration: ['', [Validators.required]],
    });
    (this.form.get('hobbies') as FormArray).push(hobbyGroup);
  }

  /** Method to remove a hobby from the hobbies FormArray. */
  public removeHobby(index: number) {
    (this.form.get('hobbies') as FormArray).removeAt(index);
  }

  /** Method to handle form submission. */
  public onSubmit() {
    if (this.form.invalid) {
      console.log('INVALID FORM');
      return;
    }

    const dataFEForm = {
      ...this.form.value,
      dateOfBirth: moment(this.form.value.dateOfBirth).format('MM-DD-YYYY'),
    };

    console.log(dataFEForm);
  }
}
