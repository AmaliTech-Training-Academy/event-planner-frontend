import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';


// Declare google to avoid TypeScript errors if you're not using @types/googlemaps
// declare var google: any;

@Injectable({
  providedIn: 'root'
})
export class GooglePlacesLoaderService {
  private scriptLoaded = false;

  load() {
    return new Promise((resolve, reject) => {
      if (this.scriptLoaded) {
        resolve(true);
        return;
      }

      const script = document.createElement('script');
      
      script.src = `${environment.GOOGLE_MAP_URL}?key=${environment.GOOGLE_MAPS_KEY}&libraries=places`; 
      
      script.type = 'text/javascript';
      script.async = true;
      script.defer = true;

      script.onload = () => {
        this.scriptLoaded = true;
        resolve(true);
      };

      script.onerror = (error) => {
        reject(error);
      };

      document.head.appendChild(script);
    });
  }
}