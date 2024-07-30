import { Component, signal , inject, OnInit, DestroyRef} from '@angular/core';

import { Place } from '../place.model';
import { PlacesComponent } from '../places.component';
import { PlacesContainerComponent } from '../places-container/places-container.component';
import { HttpClient } from '@angular/common/http';
import { catchError, map, throwError } from 'rxjs';

@Component({
  selector: 'app-available-places',
  standalone: true,
  templateUrl: './available-places.component.html',
  styleUrl: './available-places.component.css',
  imports: [PlacesComponent, PlacesContainerComponent],
})
export class AvailablePlacesComponent implements OnInit {
  places = signal<Place[] | undefined>(undefined);
  httpClient = inject(HttpClient)
  destroyRef = inject(DestroyRef)
  // constructor(private httpClient: HttpClient){}
  isLoading = signal<boolean | undefined>(undefined);
  isError = signal<any>(undefined);

  ngOnInit() {
    this.isLoading.set(true)
    const getPlaces = this.httpClient.
      get<{places: Place[]}>('http://localhost:3000/places', {
        observe:'response' //or events as a value;
      }).pipe(
        map((data) => data.body?.places),
        catchError((error_)=> {
          console.log(error_)
          return throwError(()=>new Error("Something went wrong! Please try again later..."))
        })
      ).subscribe({
        next:(response)=>{ 
          console.log(response)
          this.places.set(response)
        },
        error: (err: Error) => {
          this.isError.set(`${err.message}`)
          this.isLoading.set(undefined);
        },
        complete: ()=> this.isLoading.update((loading)=> loading = false)
    })

    this.destroyRef.onDestroy(() => getPlaces.unsubscribe())
  }
}
