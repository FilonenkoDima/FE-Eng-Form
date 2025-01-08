import { FeEngineerFormService } from './fe-engineer-form.service';
import { emailIsUnique } from './customValidators';

import { Component, inject, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import {
  FormArray, FormBuilder,
  FormControl,
  FormGroup,
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

// todo порядок інстансів
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
  private formBuilder = inject(FormBuilder);

  public form = this.formBuilder.group({
    name: ['', [Validators.required]],
    lastName: ['', [Validators.required]],
    dateOfBirth: ['', [Validators.required]],
    frontendTechnology: ['', [Validators.required]],
    frontendTechnologyVersion: [{ value: '', disabled: true }, [Validators.required]],
    email: ['', [Validators.required, Validators.email], [emailIsUnique]],
    hobbies: this.formBuilder.array([], Validators.required),
  });
  /**
   * hobbies FormArray control.
   */
  public hobbies: FormArray = this.form.get('hobbies') as FormArray;
  private datePipe: DatePipe = inject(DatePipe);
  private feTechnologiesVersionsService: FeEngineerFormService = inject(
    FeEngineerFormService,
  );
  /**
   * Get for the available frontend technologies from the service.
   */
  public frontendTechnologies: string[] = Object.keys(
    this.feTechnologiesVersionsService.frontendTechnologies,
  );

  get hobbiesIsInvalid() {
    return (
      (this.form.controls.hobbies.invalid ||
        this.form.controls.hobbies.touched) &&
      this.hobbies.length < 1
    );
  }

  /**
   * versions of the selected frontend technology.
   */
  public frontendTechnologyVersions(): string[] {
    return this.feTechnologiesVersionsService.frontendTechnologies[
      `${this.form.value.frontendTechnology}`
    ];
  }

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

  /**
   * Method to add a new hobby to the hobbies FormArray.
   */
  public addHobby() {
    const hobbyGroup = new FormGroup({
      name: new FormControl('', Validators.required),
      duration: new FormControl('', Validators.required),
    });
    this.hobbies.push(hobbyGroup);
  }

  /**
   * Method to remove a hobby from the hobbies FormArray.
   * @param index - The index of the hobby to remove from the array.
   */
  public removeHobby(index: number) {
    this.hobbies.removeAt(index);
  }

  /**
   * Method to handle form submission.
   */
  // переробити через спред
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
