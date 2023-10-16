import {Injectable} from "@angular/core";
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from "@angular/common/http";
import {Observable} from "rxjs";
import {LoginService} from "./login.service";


@Injectable({
  providedIn: 'root'
})
export class AuthService implements HttpInterceptor {

  constructor(private loginService: LoginService) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    console.log(this.loginService.getLoggedInUser());
    if (this.loginService.getLoggedInUser()) {
      req = req.clone({
        setHeaders: {
          Authorization: `Bearer ${this.loginService.getJwtToken().token}`
        }
      });
    }
    return next.handle(req);

  }
}

