import { Component, signal , inject, OnInit, DestroyRef } from '@angular/core';

import { PlacesContainerComponent } from '../places-container/places-container.component';
import { PlacesComponent } from '../places.component';
import { HttpClient } from '@angular/common/http';
import { catchError, map, throwError } from 'rxjs';
import { Place } from '../place.model';
import { PlacesService } from '../places.service';

@Component({
  selector: 'app-user-places',
  standalone: true,
  templateUrl: './user-places.component.html',
  styleUrl: './user-places.component.css',
  imports: [PlacesContainerComponent, PlacesComponent],
})
export class UserPlacesComponent implements OnInit {
  placeService = inject(PlacesService)
  // places = signal<Place[] | undefined>(undefined);
  places = this.placeService.loadedUserPlaces
  destroyRef = inject(DestroyRef)
  // constructor(private httpClient: HttpClient){}
  isLoading = signal<boolean | undefined>(undefined);
  isError = signal<any>(undefined);

  ngOnInit() {
    this.isLoading.set(true)
    const getPlaces = this.placeService.loadUserPlaces().subscribe({
        // next:(response)=>{ 
        //   console.log(response)
        //   this.places.set(response)
        // },
        error: (err: Error) => {
          this.isError.set(`${err.message}`)
          this.isLoading.set(undefined);
        },
        complete: ()=> this.isLoading.update((loading)=> loading = false)
    })

    this.destroyRef.onDestroy(() => getPlaces.unsubscribe())
  }

  removeFromFavourites(place:Place){
    this.placeService.removeUserPlace(place).subscribe({
      
    });
  }
}
