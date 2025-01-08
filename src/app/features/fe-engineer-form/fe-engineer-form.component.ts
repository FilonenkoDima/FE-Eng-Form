import { FeEngineerFormService } from '../../core/services/fe-engineer-form.service';
import { emailIsUnique } from '../../core/validators/emailUnique.validator';

import { Component, inject, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import {
  FormArray,
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIcon } from '@angular/material/icon';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatToolbar } from '@angular/material/toolbar';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

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
  ],
  templateUrl: './fe-engineer-form.component.html',
  styleUrl: './fe-engineer-form.component.css',
  providers: [DatePipe],
  standalone: true,
})
export class FeEngineerFormComponent implements OnInit {
  private formBuilder: FormBuilder = inject(FormBuilder);
  private datePipe: DatePipe = inject(DatePipe);
  private feTechnologiesVersionsService: FeEngineerFormService = inject(
    FeEngineerFormService,
  );

  /** Frontend engineer form. */
  public form = this.formBuilder.group({
    name: ['', [Validators.required]],
    lastName: ['', [Validators.required]],
    dateOfBirth: ['', [Validators.required]],
    frontendTechnology: ['', [Validators.required]],
    frontendTechnologyVersion: [
      { value: '', disabled: true },
      [Validators.required],
    ],
    email: ['', [Validators.required, Validators.email], [emailIsUnique]],
    hobbies: this.formBuilder.array([], Validators.required),
  });

  /** Get for the available frontend technologies from the service. */
  public frontendTechnologies: string[] = Object.keys(
    this.feTechnologiesVersionsService.frontendTechnologies,
  );

  /**
   * Sets up a subscription to the 'frontendTechnology' value changes to enable
   * or disable the 'frontendTechnologyVersion' control.
   */
  public ngOnInit(): void {
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

  /** versions of the selected frontend technology. */
  public frontendTechnologyVersions(): string[] {
    return this.feTechnologiesVersionsService.frontendTechnologies[
      `${this.form.value.frontendTechnology}`
      ];
  }

  /** check correct input for hobbies. */
  public hobbiesIsInvalid() {
    return (
      (this.form.controls.hobbies.invalid ||
        this.form.controls.hobbies.touched) &&
      (this.form.get('hobbies') as FormArray).length < 1
    );
  }

  /**
   * Method to add a new hobby to the hobbies FormArray.
   */
  public addHobby() {
    const hobbyGroup = this.formBuilder.group({
      name: ['', [Validators.required]],
      duration: ['', [Validators.required]],
    });
    (this.form.get('hobbies') as FormArray).push(hobbyGroup);
  }

  /**
   * Method to remove a hobby from the hobbies FormArray.
   */
  public removeHobby(index: number) {
    (this.form.get('hobbies') as FormArray).removeAt(index);
  }

  /**
   * Method to handle form submission.
   */
  public onSubmit() {
    if (this.form.invalid) {
      console.log('INVALID FORM');
      return;
    }

    const formattedDate = this.datePipe.transform(
      this.form.value.dateOfBirth,
      'dd-MM-yyyy',
    );

    const dataFEForm = {
      ...this.form.value,
      dateOfBirth: formattedDate,
    };

    console.log(dataFEForm);
  }
}
