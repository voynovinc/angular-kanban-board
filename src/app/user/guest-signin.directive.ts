import { Directive, HostListener } from "@angular/core";
import { AngularFireAuth } from "@angular/fire/auth";

@Directive({
  selector: "[appGuestSignin]"
})
export class GuestSigninDirective {
  constructor(private afAuth: AngularFireAuth) {}

  @HostListener("click")
  onClick() {
    this.afAuth.auth.signInAnonymously().then(user => {
      console.log("User logged in as anon? " + user.user.isAnonymous);
    });
  }
}
