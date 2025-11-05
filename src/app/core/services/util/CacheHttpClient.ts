import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CacheHttpService {
    
  constructor(private http: HttpClient) {}

  get<T>(url: string, expiryMs: number = 300000): Observable<T> {
    const cacheKey = `cache::${url}`;
    const cached = localStorage.getItem(cacheKey);

    if (cached) {
      const { value, expiry } = JSON.parse(cached);
      if (Date.now() < expiry) {
        return of(value as T);
      } else {
        localStorage.removeItem(cacheKey);
      }
    }

    return this.http.get<T>(url).pipe(
      tap((data) => {
        const item = {
          value: data,
          expiry: Date.now() + expiryMs
        };
        localStorage.setItem(cacheKey, JSON.stringify(item));
      })
    );
  }

  clearCache(url?: string): void {
    if (url) {
      localStorage.removeItem(`cache::${url}`);
    } else {
      Object.keys(localStorage)
        .filter((key) => key.startsWith('cache::'))
        .forEach((key) => localStorage.removeItem(key));
    }
  }
}