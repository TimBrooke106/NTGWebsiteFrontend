import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { About } from './pages/about/about';
import { Contact } from './pages/contact/contact';
import { BookSkip } from './pages/book-skip/book-skip';
import { Services } from './pages/services/services';
import { AdminGuard } from './core/guards/admin.guard';
import { OwnerDashboardComponent } from './pages/owner-dashboard/owner-dashboard.component';
import { AdminLoginComponent } from './pages/admin-login/admin-login.component';


export const routes: Routes = [
  { path: '', component: Home },
  { path: 'about', component: About },
  { path: 'contact', component: Contact },
  { path: 'book-skip', component: BookSkip },
  { path: 'services', component: Services },
  { path: 'login', component: AdminLoginComponent },
  { path: 'admin', canActivate: [AdminGuard], component: OwnerDashboardComponent }
];