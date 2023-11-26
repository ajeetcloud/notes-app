import {Component, OnDestroy, OnInit} from "@angular/core";
import {LoginService} from "../service/login.service";
import {Subject, takeUntil} from "rxjs";
import {JWTToken} from "../types/types";
import {Router} from "@angular/router";

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit, OnDestroy {

  username = '';
  password = '';

  private destroyed = new Subject<void>();

  constructor(private loginService: LoginService, private router: Router) {
  }

  ngOnInit(): void {

  }

  login() {
    this.loginService.login(this.username, this.password)
      .pipe(takeUntil(this.destroyed))
      .subscribe((token: JWTToken) => {
        console.log("token after login", token);
        this.loginService.setUserId(token.userId)
        this.loginService.setLoggedInUser(this.username);
        this.loginService.setJwtToken(token);
        this.router.navigate(['/']);
      });
  }

  ngOnDestroy(): void {
    this.destroyed.next();
    this.destroyed.complete();
  }
}
