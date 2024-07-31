import { inject, Injectable, signal } from '@angular/core';

import { Place } from './place.model';
import { HttpClient } from '@angular/common/http';
import { map, catchError, throwError, tap } from 'rxjs';
import { ErrorService } from '../shared/error.service';

@Injectable({
  providedIn: 'root',
})
export class PlacesService {
  httpClient = inject(HttpClient)
  errService = inject(ErrorService)
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
        // console.log(error_)
        this.errService.showError(errMsg)
        return throwError(()=>new Error(errMsg))
      })
    )
  }

  addPlaceToUserPlaces(place: Place) {
    const prevPlaces = this.userPlaces();
    if(!prevPlaces.some((p)=>p.id === place.id)) this.userPlaces.update((existingPlaces)=>[...existingPlaces, place])
    return this.httpClient.put('http://localhost:3000/user-places', {
      placeId: place.id
    }).pipe(
      catchError((error)=>{
        this.userPlaces.set(prevPlaces)
        this.errService.showError("Failed to store selected place...")
        return throwError(()=>new Error("Failed to store selected place..."))
      })
    )
  }

  removeUserPlace(place: Place) {}
}
