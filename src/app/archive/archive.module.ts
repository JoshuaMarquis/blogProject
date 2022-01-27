import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import {MatPaginatorModule} from '@angular/material/paginator';
import {MatTableModule} from '@angular/material/table';

import { ArchiveComponent } from './components/archive/archive.component';


const routes = [
  {path:'archive', component: ArchiveComponent}
]

const materials = [
  MatPaginatorModule,
  MatTableModule,

]

@NgModule({
  declarations: [
    ArchiveComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    materials
  ]
})
export class ArchiveModule { }
