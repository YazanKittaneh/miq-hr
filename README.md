# MiQ People Portal

This is MiQ's internal employee and HR management portal built with **Next.js**. Provides secure access to company resources, employee profiles, and HR tools.

**Staging Environment**: [miq-hr-git-preview-yazankittanehs-projects.vercel.app](miq-hr-git-preview-yazankittanehs-projects.vercel.app)

## Key Features

- Employee dashboard with personalized welcome message
- HR management console with employee directory
- Role-based access control (RBAC) for:
  - Employees (basic access)
  - HR Managers (advanced tools)
  - Department Heads (team insights)
- Activity logging for all system interactions
- Secure authentication with JWT tokens
- Employee profile management:
  - Personal details
  - Job information
  - Time-off requests
  - Performance reviews
- Audit logging for compliance tracking

## Core Technologies

- **Framework**: [Next.js](https://nextjs.org/) - Optimized for secure internal applications
- **Database**: [Postgres](https://www.postgresql.org/) - Enterprise-grade data storage
- **ORM**: [Drizzle](https://orm.drizzle.team/) - Type-safe database operations
- **Authentication**: Supabase Auth
- **UI Library**: [shadcn/ui](https://ui.shadcn.com/) - Accessible internal tooling components

## Development Setup

```bash
git clone https://github.com/YazanKittaneh/miq-hr
cd miq-hr
pnpm install
```

## Local Configuration

1. Use the included setup script to create your .env file:

```bash
pnpm db:setup
```

2. Run database migrations with test data:

```bash
pnpm db:migrate
pnpm db:seed
```

This creates test users with different roles:
- HR Admin: `hr.admin@miq.digital`
- Department Head: `dept.head@miq.digital`
- Employee: `employee@miq.digital`
Password: `MiQSecure123!`

Start the development server:

```bash
pnpm dev
```

Access the local environment at [http://localhost:3000](http://localhost:3000)

## Role Testing Matrix

Test different access levels using these credentials:

| Role | Email | Permissions |
|------|-------|-------------|
| HR Manager | hr.user@miq.digital | Full employee management |
| Team Lead | team.lead@miq.digital | Team-specific access |
| Employee | employee@miq.digital | Basic profile access |

## Compliance & Security

Key security implementations:
- AES-256 encryption for sensitive employee data
- GDPR-compliant audit trails
- SOC 2 Type II compliant infrastructure
- Regular penetration testing schedules

## Production Deployment

MiQ's portal follows strict deployment protocols:

1. Code review through GitHub Enterprise
2. Security scanning with SonarQube
3. Deployment to MiQ's private Kubernetes cluster
4. Post-deploy smoke tests
5. Final approval from Security team

## Support & Maintenance

For production issues or feature requests:
- Create a ticket in ServiceNow (CATEGORY: People Portal)
- Emergency P1 issues: +44 20 7946 0811 (MiQ IT 24/7)
- Follow [IT-3456] change management process for modifications
