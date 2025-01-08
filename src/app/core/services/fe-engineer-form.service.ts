import { Injectable } from '@angular/core';
import {type FrameworkVersions} from '../models/frameworkVersions.model';

@Injectable({
  providedIn: 'root'
})
export class FeEngineerFormService {
 private frontendTechnologiesVersions: FrameworkVersions = {
   angular: ['1.1.1', '1.2.1', '1.3.3'],
   react: ['2.1.2', '3.2.4', '4.3.1'],
   vue: ['3.3.1', '5.2.1', '5.1.3'],
 }

 public get frontendTechnologies(): FrameworkVersions {
   return this.frontendTechnologiesVersions;
 }
}
