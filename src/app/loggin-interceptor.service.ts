import { HttpEvent, HttpEventType, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Observable, tap } from "rxjs";


export class LogginInterceptorService implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    /** will run before the request leaves our app */
    console.log('Request is on its way');
    console.log(req.url);
    console.log(req.headers);

    return next.handle(req).pipe(
      tap(event => {
        console.log(event);

        if(event.type === HttpEventType.Response) {
          console.log('Response arrived, body data: ', event.body);
        }
      })
    )
  }

}
