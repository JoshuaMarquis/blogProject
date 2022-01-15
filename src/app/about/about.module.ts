import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import {MatCardModule} from '@angular/material/card';
import {MatListModule} from '@angular/material/list';

import { AboutComponent } from './components/about/about.component';

const materials = [
  MatCardModule,
  MatListModule
]

const routes = [
  {path: 'about', component: AboutComponent}
]

@NgModule({
  declarations: [
    AboutComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    materials,
  ]
})
export class AboutModule { }
