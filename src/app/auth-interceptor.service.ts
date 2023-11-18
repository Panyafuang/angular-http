import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Observable } from "rxjs";

export class AuthInterceptorService implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    /** modifies req */
    const modifiesReq = req.clone({
      // url: 'new-url',
      headers: req.headers.append('Auth', 'xyz')
    });
    // let request continue
    return next.handle(modifiesReq)
  }

}
