import { DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { BrowserModule } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FooterComponent } from './components/footer/footer.component';
import { GalleryDialogComponent } from './components/gallery-dialog/gallery-dialog.component';
import { GalleryComponent } from './components/gallery/gallery.component';
import { MenuComponent } from './components/menu/menu.component';
import { TopBarComponent } from './components/top-bar/top-bar.component';
import { LabsComponent } from './views/labs/labs.component';
import { ProjectComponent } from './views/projects/project/project.component';
import { ProjectsComponent } from './views/projects/projects.component';

@NgModule({
  declarations: [
    AppComponent,
    TopBarComponent,
    FooterComponent,
    MenuComponent,
    ProjectsComponent,
    ProjectComponent,
    LabsComponent,
    GalleryComponent,
    GalleryDialogComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CommonModule,
    HttpClientModule,
    MatMenuModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    DragDropModule,
  ],
  providers: [
    provideAnimationsAsync()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
