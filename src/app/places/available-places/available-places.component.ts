import { Component, signal , inject, OnInit, DestroyRef} from '@angular/core';

import { Place } from '../place.model';
import { PlacesComponent } from '../places.component';
import { PlacesContainerComponent } from '../places-container/places-container.component';
import { HttpClient } from '@angular/common/http';
import { catchError, map, throwError } from 'rxjs';
import { PlacesService } from '../places.service';

@Component({
  selector: 'app-available-places',
  standalone: true,
  templateUrl: './available-places.component.html',
  styleUrl: './available-places.component.css',
  imports: [PlacesComponent, PlacesContainerComponent],
})
export class AvailablePlacesComponent implements OnInit {
  places = signal<Place[] | undefined>(undefined);
  placeService = inject(PlacesService)
  destroyRef = inject(DestroyRef)
  // constructor(private httpClient: HttpClient){}
  isLoading = signal<boolean | undefined>(undefined);
  isError = signal<any>(undefined);

  ngOnInit() {
    this.isLoading.set(true)
    const getPlaces = this.placeService.loadAvailablePlaces().subscribe({
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

  addToFavourites(placeObj: Place){
    const subscription = this.placeService.addPlaceToUserPlaces(placeObj).subscribe({
      next:(response)=>console.log(response),
      error: (err)=> console.log(err),
      complete:()=>console.log("complete")
    });
    this.destroyRef.onDestroy(()=>subscription.unsubscribe());
  }
}
