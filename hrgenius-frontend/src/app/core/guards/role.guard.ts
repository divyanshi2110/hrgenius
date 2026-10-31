import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const roleGuard: CanActivateFn = (route) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const allowedRoles = route.data['roles'] as string[] | undefined;
  const userRole = authService.userRole();

  if (!allowedRoles || (userRole && allowedRoles.includes(userRole))) {
    return true;
  }

  router.navigate(['/dashboard']);
  return false;
};
