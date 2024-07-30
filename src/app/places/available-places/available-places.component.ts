import { Component, signal , inject, OnInit, DestroyRef} from '@angular/core';

import { Place } from '../place.model';
import { PlacesComponent } from '../places.component';
import { PlacesContainerComponent } from '../places-container/places-container.component';
import { HttpClient } from '@angular/common/http';

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

  ngOnInit() {
    const getPlaces = this.httpClient.
      get<{places: Place[]}>('http://localhost:3000/places').subscribe({
        next:(data)=> console.log(data.places),
        error: (err) => console.log('Eror', err),
        complete: ()=> console.log('Completed...')
    })

    this.destroyRef.onDestroy(() => getPlaces.unsubscribe())
  }
}
