import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { AlphabetInvasionComponent } from './pages/alphabet-invasion/alphabet-invasion.component';
import { CatchTheDotComponent } from './pages/catch-the-dot/catch-the-dot.component';

const routes: Routes = [
  { path: '', component: HomeComponent, pathMatch: 'full'},
  { path: 'alphabet-invasion', component: AlphabetInvasionComponent },
  { path: 'catch-the-dot', component: CatchTheDotComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
