import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import {MatCardModule} from '@angular/material/card';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';

import { HomeComponent } from './components/home/home.component';
import { FeedComponent } from './components/feed/feed.component';

const routes = [
  {path: 'home', component:HomeComponent}
]

const materials = [
  MatCardModule,
  MatIconModule,
  MatButtonModule,
]

@NgModule({
  declarations: [
    HomeComponent,
    FeedComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    materials,

  ]
})
export class HomeModule { }
