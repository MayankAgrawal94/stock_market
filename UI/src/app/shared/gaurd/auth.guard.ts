import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Router, ActivatedRoute } from '@angular/router';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private router: Router, private route :ActivatedRoute) {

    }

    canActivate() {
        if (localStorage.getItem('isLoggedin')) {
            return true;
        }
        
        this.router.navigate(['/login']);
        return false;
    }
}