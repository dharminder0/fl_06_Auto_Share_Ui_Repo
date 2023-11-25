import {  
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
 }
from '@angular/router';

export class DetectBranchingLogicAuthService implements CanActivate{
  public data = true;

  constructor() {}

  setDetectBranchingLogicAuthService(data) {
     this.data = data ? false : true;
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.data;
  }
}
