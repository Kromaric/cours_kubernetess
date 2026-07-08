// src/auth/jwt-auth.guard.ts
import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

// Guard à poser sur un endpoint pour exiger un Bearer token Keycloak valide.
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
