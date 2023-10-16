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
        this.loginService.setLoggedInUser(this.username);
        this.loginService.setJwtToken(token);
        console.log("inside login", this.loginService.getLoggedInUser());
        console.log("inside login", this.loginService.getJwtToken());
        this.router.navigate(['']);
      });
  }

  ngOnDestroy(): void {
    this.destroyed.next();
    this.destroyed.complete();
  }
}
