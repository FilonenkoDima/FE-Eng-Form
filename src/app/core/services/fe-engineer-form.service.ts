import { Injectable } from '@angular/core';
import { type FrameworkVersions } from '../models/framework-versions.model';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FeEngineerFormService {
  private frontendTechnologiesVersions: FrameworkVersions = {
    angular: ['1.1.1', '1.2.1', '1.3.3'],
    react: ['2.1.2', '3.2.4', '4.3.1'],
    vue: ['3.3.1', '5.2.1', '5.1.3'],
  };

  private frontendTechnologiesSubject$ = new BehaviorSubject<FrameworkVersions>(
    this.frontendTechnologiesVersions,
  );

  public frontendTechnologies$ =
    this.frontendTechnologiesSubject$.asObservable();
}
