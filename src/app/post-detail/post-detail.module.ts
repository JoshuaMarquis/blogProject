import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import {MatCardModule} from '@angular/material/card';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';

import { PostComponent } from './components/post/post.component';

const routes = [
  {
    path:'post/:id',
    component: PostComponent
  }
]

const materials = [
  MatCardModule,
  MatIconModule,
  MatButtonModule,
]

@NgModule({
  declarations: [
    PostComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    materials,
  ]
})
export class PostDetailModule { }
