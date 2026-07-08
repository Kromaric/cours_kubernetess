// src/auth/jwt.strategy.ts
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { passportJwtSecret } from 'jwks-rsa';

// Valide les JWT émis par Keycloak :
// - la signature est vérifiée via les clés publiques (JWKS), récupérées
//   par l'URL interne au cluster ;
// - l'issuer attendu est l'URL publique de Keycloak (celle vue par le
//   client qui a obtenu le token) — les deux ne coïncident pas en k8s.
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKeyProvider: passportJwtSecret({
        jwksUri:
          process.env.KEYCLOAK_JWKS_URI ??
          'http://keycloak-svc.security.svc.cluster.local:8080/auth/realms/restaurant/protocol/openid-connect/certs',
        cache: true,
        rateLimit: true,
      }),
      issuer:
        process.env.KEYCLOAK_ISSUER ??
        'http://localhost:8082/auth/realms/restaurant',
      algorithms: ['RS256'],
    });
  }

  validate(payload: {
    sub: string;
    preferred_username?: string;
    realm_access?: { roles: string[] };
  }) {
    // Ce que retourne validate() devient request.user
    return {
      userId: payload.sub,
      username: payload.preferred_username,
      roles: payload.realm_access?.roles ?? [],
    };
  }
}
