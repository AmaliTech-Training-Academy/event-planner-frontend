import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';
import { NotificationService } from './notification.service';

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService {

  constructor(private readonly notificationService:NotificationService) {}

  

  handle(error: HttpErrorResponse) {
    let message = 'An unknown error occurred';
    
    console.log(error.error?.description)

    // console.log(error.error)

    if (error.error instanceof ErrorEvent) {
      message = `Network error: ${error.error.message}`;
    } 
    else if (error.error?.description) {
      message = error.error?.description
    }
    else {
      // Backend error
      switch (error.status) {
        case 0:
          message = 'Cannot connect to the server. Please check your internet connection.';
          break;
        case 400:
          message = error.error?.message || 'Bad request.';
          break;
        case 401:
          message = 'Unauthorized. Please log in again.';
          break;
        case 403:
          message = 'Access denied. You don’t have permission for this action.';
          break;
        case 404:
          message = 'The requested resource was not found.';
          break;
        case 500:
          message = 'Server error. Please try again later.';
          break;
        default:
          message = error.error?.message || `Unexpected error: ${error.status}`;
      }
      
    }

    this.notificationService.error(message);

    return throwError(() => new Error(message));
  }
}
