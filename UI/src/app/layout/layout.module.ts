import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatCardModule} from '@angular/material/card';
import {MatTableModule} from '@angular/material/table';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatSortModule} from '@angular/material/sort';
import { MatFormFieldModule, MatInputModule } from '@angular/material';
import {MatDialogModule} from '@angular/material/dialog';
import { FormsModule,FormGroup, FormBuilder, Validators, FormControl,ReactiveFormsModule } from '@angular/forms';

import { LayoutRoutingModule } from './layout-routing.module';
import { LayoutComponent } from './layout.component';
import { HeaderComponent } from './header/header.component';
import { AboutComponent } from './about/about.component';
import { WelcomeHeaderComponent } from './welcome-header/welcome-header.component';
import { ServicesComponent } from './services/services.component';

@NgModule({
  declarations: [
  	LayoutComponent,
  	HeaderComponent,
	AboutComponent,
	WelcomeHeaderComponent,
	ServicesComponent,
  ],
  imports: [
    CommonModule,
    LayoutRoutingModule,
	  MatToolbarModule,
	  MatCardModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
    FormsModule,
    ReactiveFormsModule
  ],
    entryComponents : [
    ]
})
export class LayoutModule { }
