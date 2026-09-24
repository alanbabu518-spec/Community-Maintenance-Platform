# Security Policy

## Supported Versions

Security fixes are applied to the latest version on the `main` branch.

| Version        | Supported |
| -------------- | --------- |
| `main` (latest) | ✅        |
| Older versions | ❌        |

## Reporting a Vulnerability

**Please do not open a public issue for security vulnerabilities.**

Report privately using one of the following:

- GitHub: **Security → Report a vulnerability** (private advisory) on this repository
- Email: `alanbabu518@gmail.com`

Please include:

- Affected component, endpoint, or feature
- Steps to reproduce
- Expected vs. actual behavior
- Security impact
- Evidence with all secrets removed
- Suggested fix (optional)

Never include real passwords, API keys, JWTs, session cookies, or private keys in a report.

### What to expect

| Stage                 | Target timeframe |
| --------------------- | ---------------- |
| Acknowledgement       | 3 business days  |
| Initial assessment    | 7 days           |
| Fix or mitigation plan | 30 days (severity dependent) |

Reporters acting in good faith, avoiding data destruction, privacy violations, and service disruption, will not face legal action from the maintainers.

## Security Controls

**Authentication**
- JWT authentication stored in `HttpOnly`, `SameSite` cookies (`Secure` in production)
- Backend verification of token validity, user existence, account status, and token version
- Token-version checks to invalidate sessions after sensitive account changes
- OAuth sign-in support
- Passwords stored as salted hashes only

**Authorization and Data Isolation**
- Role-Based Access Control (`ADMIN`, `MANAGER`, `TECHNICIAN`, `RESIDENT`) enforced on the server
- Frontend route guards are for UX only and are not a security boundary
- Resource access is checked against community, building, unit, assignment, and manager scope
- Client-supplied IDs are never trusted as proof of authorization

**API Protection**
- Schema validation of request bodies, params, and query strings
- Rate limiting on login, OTP, forgot-password, and password-reset endpoints
- Restricted CORS origins, HTTP security headers, and request body size limits
- Generic error responses that avoid leaking internal details

**Account Recovery**
- Expiring, single-use reset tokens
- Session invalidation after password reset
- Enumeration-resistant responses

**Data and Infrastructure**
- PostgreSQL accessed only through the backend (Prisma); never directly from the client
- Redis used for OTPs, rate limiting, and caching, with expiry on sensitive keys
- Socket.IO connections are authenticated, origin-restricted, and scoped to private per-user rooms

## Secure Development

- Automated tests cover missing/invalid/expired JWTs, inactive users, token-version mismatch, role checks, privilege escalation, and input validation
- Dependencies are reviewed with `npm audit`; avoid blind `--force` upgrades
- Security reviews are assisted by the [Cloudflare security-audit skill](https://github.com/cloudflare/security-audit-skill) (development-time tooling only; it does not add Cloudflare infrastructure protection)

```bash
npx tsc --noEmit   # type check
npm test           # test suite
npm audit          # dependency vulnerabilities
```

## Secrets Management

Never commit secrets. This includes `.env`, `.env.local`, `.env.production`, and values such as `DATABASE_URL`, `JWT_SECRET`, `REDIS_URL`, OAuth client secrets, email/API keys, and private keys.

Use `.env.example` with placeholder values only. If a secret is ever committed, **rotate it immediately**, since removing it from git history is not enough.

Before pushing, review staged changes:

```bash
git status
git diff --cached
```

## Production Deployment Checklist

- [ ] HTTPS/TLS enabled
- [ ] CORS and WebSocket origins restricted to production domains
- [ ] Secure cookie settings and strong, unique `JWT_SECRET`
- [ ] Database and Redis credentials stored in a secrets manager or secure environment config
- [ ] OAuth redirect URIs verified
- [ ] Rate limits configured (and correct client IP handling behind proxies)
- [ ] Logs free of secrets and personal data
- [ ] Container and CI/CD permissions reviewed
- [ ] Security tests and `npm audit` passing

Infrastructure-dependent controls (proxies, TLS, hosting) must be validated in the real deployment environment.