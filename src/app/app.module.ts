import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { AuthInterceptorService } from './auth-interceptor.service';
import { LogginInterceptorService } from './loggin-interceptor.service';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, FormsModule, HttpClientModule],
  providers: [{
    provide: HTTP_INTERCEPTORS, // HTTP run interceptor method.
    useClass: AuthInterceptorService, // point to interceptor class you wanna add as interceptor.
    multi: true // should not replace the existing interceptors.
  }, {
    provide: HTTP_INTERCEPTORS,
    useClass: LogginInterceptorService,
    multi: true
  }],
  bootstrap: [AppComponent]
})
export class AppModule {}
