import { inject, Injectable, signal } from '@angular/core';

import { Place } from './place.model';
import { HttpClient } from '@angular/common/http';
import { map, catchError, throwError, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PlacesService {
  httpClient = inject(HttpClient)
  private userPlaces = signal<Place[]>([]);

  loadedUserPlaces = this.userPlaces.asReadonly();

  loadAvailablePlaces() {
    let url = 'http://localhost:3000/places' 
    let errMsg = "Something went wrong! Please try again later..."
    return this.loadPlaces(url, errMsg);
  }

  loadUserPlaces() {
    let url = 'http://localhost:3000/user-places' 
    let errMsg = "Something went wrong fetching your favourite places! Please try again later..."
    return this.loadPlaces(url, errMsg).pipe(
      tap({
        next:(userPlaces)=> {
          if (userPlaces)  this.userPlaces.set(userPlaces)
        }
      })
    );
  }

  loadPlaces(url:string, errMsg:string) {
    return this.httpClient.get<{places: Place[]}>(url, {
      observe:'response' //or events as a value;
    }).pipe(
      map((data) => data.body?.places),
      catchError((error_)=> {
        console.log(error_)
        return throwError(()=>new Error(errMsg))
      })
    )
  }

  addPlaceToUserPlaces(place: Place) {
    this.userPlaces.update((existingPlaces)=>[...existingPlaces, place])
    return this.httpClient.put('http://localhost:3000/user-places', {
      placeId: place.id
    })
  }

  removeUserPlace(place: Place) {}
}
