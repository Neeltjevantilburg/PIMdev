import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptorService } from '../http-interceptors/authInterceptor/auth-interceptor.service';

export const HttpInterceptorProviders = [
  { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptorService, multi: true }
];