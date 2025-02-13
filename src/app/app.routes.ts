import { Routes } from '@angular/router';
import { StudentListComponent } from './student-list/student-list.component';
import { StudentResultComponent } from './student-result/student-result.component';

export const routes: Routes = [
  { path: '', component: StudentListComponent },
  { path: 'results', component: StudentResultComponent },
];
