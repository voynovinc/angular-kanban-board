import { Injectable } from "@angular/core";
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree
} from "@angular/router";
import { first } from "rxjs/operators";
import { AngularFireAuth } from "@angular/fire/auth";
import { SnackService } from "../services/snack.service";

@Injectable({
  providedIn: "root"
})
export class AuthGuard implements CanActivate {
  constructor(private afAuth: AngularFireAuth, private snack: SnackService) {}

  async canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<boolean> {
    //const user = this.afAuth.auth.currentUser;
    const user = await this.afAuth.authState.pipe(first()).toPromise();

    const isLoggedIn = !!user;

    if (!isLoggedIn) {
      this.snack.authError();
    }

    return isLoggedIn;
  }
}
