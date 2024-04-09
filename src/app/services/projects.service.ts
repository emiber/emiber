import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { IProject } from './models';

@Injectable({
  providedIn: 'root'
})
export class ProjectsService {
  private url = '/assets/data/projects.json';

  constructor(private http: HttpClient) { }

  get(): Observable<IProject[]> {
    return this.http.get<IProject[]>(this.url).pipe(
      map((res: IProject[]) => {
        res.forEach(prj => {
          for (let i = 0; i < prj.images.length; i++) {
            prj.images[i] = "assets/images/projects/".concat(prj.images[i]);
          }
        });
        return (res);
      })
    );
  }
}