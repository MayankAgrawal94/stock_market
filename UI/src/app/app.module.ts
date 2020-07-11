import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatCardModule} from '@angular/material/card';

import { AuthGuard } from './shared/gaurd/auth.guard';
import { WebsiteService } from './shared/service/website.service';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { FormsModule,FormGroup, FormBuilder, Validators, FormControl,ReactiveFormsModule } from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSnackBarModule} from '@angular/material/snack-bar';

import { LayoutModule } from './layout/layout.module';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatCardModule,
    LayoutModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatSnackBarModule
  ],
  providers: [
  	AuthGuard,
    WebsiteService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
