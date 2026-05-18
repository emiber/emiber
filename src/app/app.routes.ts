import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'home' },
  {
    path: 'home',
    loadComponent: () => import('./views/home/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'contact',
    loadComponent: () => import('./views/contact/contact.component').then(m => m.ContactComponent)
  },
  {
    path: 'labs',
    loadComponent: () => import('./views/labs/labs.component').then(m => m.LabsComponent)
  },
  {
    path: 'projects',
    loadComponent: () => import('./views/projects/projects.component').then(m => m.ProjectsComponent)
  },
  {
    path: 'projects/:project',
    loadComponent: () => import('./views/projects/projects.component').then(m => m.ProjectsComponent)
  },
  {
    path: 'chat',
    loadComponent: () => import('./views/chat/chat.component').then(m => m.ChatComponent)
  },
  { path: '**', pathMatch: 'full', redirectTo: 'home' },
];
