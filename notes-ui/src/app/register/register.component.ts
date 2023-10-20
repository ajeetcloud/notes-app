import {Component, OnDestroy, OnInit} from "@angular/core";
import {SignupRequest} from "../types/types";
import {Subject, takeUntil} from "rxjs";
import {LoginService} from "../service/login.service";
import {SIGNUP_SUCCESSFUL_MSG} from "../common/constants";


@Component({
  selector: 'register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit, OnDestroy {

  username: string = '';
  password: string = '';
  firstName: string = '';
  lastName: string = '';
  email: string = '';
  signupRequest: SignupRequest;

  isRegistered: boolean = false;
  registrationSuccessfulMsg = '';

  private destroyed = new Subject<void>();

  constructor(private loginService: LoginService) {
  }

  ngOnInit(): void {
    this.isRegistered = false;
  }

  register() {
    this.signupRequest = {
      username: this.username,
      password: this.password,
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email
    };
    this.loginService.signup(this.signupRequest)
      .pipe(takeUntil(this.destroyed))
      .subscribe((res: SignupRequest) => {
          this.cleanup();
          this.isRegistered = true;
          this.registrationSuccessfulMsg = SIGNUP_SUCCESSFUL_MSG(res.firstName);
        }
      );
  }

  cleanup() {
    this.username = '';
    this.password = '';
    this.firstName = '';
    this.lastName = '';
    this.email = '';
  }

  ngOnDestroy(): void {
    this.destroyed.next();
    this.destroyed.complete();
  }
}
