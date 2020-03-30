import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { LoginComponent } from './components/login/login.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {MatButtonModule} from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { MatInputModule} from '@angular/material/input';
import { MatIconModule} from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ShowTasksComponent } from './components/show-tasks/show-tasks.component';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuardService } from './services/auth-guard.service';
import { LoadingSpinnerComponent } from './shared/loading-spinner/loading-spinner.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatTableModule } from '@angular/material/table';
import { MatNativeDateModule } from '@angular/material/core';

// const appRoutes: Routes = [
//   { path: 'Tasks', component: ShowTasksComponent }
// ];

const appRoutes: Routes = [
  {
    path: '', component: LoginComponent,
     
    // canActivateChild: [LoginGuard],
    // children: [
    //   { path: 'formula', loadChildren: './formula/formula.module#FormulaModule' },
    //   { path: 'report', loadChildren: './report/report.module#ReportModule' },
    // ]
  },
  { path: 'Tasks',
  component: ShowTasksComponent,
  canActivate:[AuthGuardService] },

];

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ShowTasksComponent,
    LoadingSpinnerComponent
  ],
  imports: [
    RouterModule.forRoot(
      appRoutes,
      { enableTracing: true } // <-- debugging purposes only
    ),
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FontAwesomeModule,
    NgbModule,
    MatButtonModule,
    CommonModule,
    MatInputModule,
    MatIconModule,
    FormsModule,
    HttpClientModule,
    MatDatepickerModule,
    MatTableModule,
    MatNativeDateModule
  ],
  providers: [HttpClientModule],
  bootstrap: [AppComponent]
})
export class AppModule { }
