# Capability Lens

**🚨 Work in Progress 🚨**

Capability Lens is a sophisticated maturity assessment tool designed to help organisations evaluate and improve their technical capabilities across various domains. Built with modern web technologies and following industry best practices, it provides a comprehensive framework for tracking and enhancing organisational maturity.

<img src="https://raw.githubusercontent.com/krzko/capability-lens/main/docs/images/capability-lens.png" alt="Capability Lens" width="100%" height="100%" />

## Features

### Maturity Matrices

- **Pre-built Templates**: Includes industry-standard matrices for:
  - Observability
  - Security
  - Cloud Native
  - DORA Metrics
- **Customisable Frameworks**: Create and modify maturity matrices to match your organisation's needs
- **Multi-level Assessment**: Five-level maturity model from Foundation to Innovation

### Assessment Management

- **Team-based Evaluations**: Conduct assessments at the team level
- **Service Mapping**: Link services to teams and track their maturity
- **Historical Tracking**: Monitor progress over time with detailed history
- **Trend Analysis**: Visualise improvement trajectories

### Dashboards and Reporting

- **Interactive Dashboards**: Real-time visibility of maturity levels
- **Comprehensive Metrics**: Track key performance indicators
- **Custom Reports**: Generate detailed reports for stakeholders
- **Data Visualisation**: Clear representation of maturity states and trends

## Technical Stack

### Frontend

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Components**: Shadcn/ui
- **State Management**: React Hooks

### Backend

- **Database**: PostgreSQL
- **ORM**: Prisma
- **API**: Next.js API Routes
- **Authentication**: NextAuth.js

### Development

- **Package Manager**: pnpm
- **Testing**: Jest and React Testing Library
- **Code Quality**: ESLint and Prettier
- **Git Workflow**: Conventional Commits

## Getting Started

### Prerequisites

- Next.js 14+
- pnpm
- PostgreSQL

### Installation

1. Clone the repository:
```bash
git clone https://github.com/krzko/capability-lens.git
cd capability-lens
```

2. Install dependencies:
```bash
pnpm install
```

3. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. Initialize the database:
```bash
pnpm prisma migrate dev
pnpm prisma db seed
```

5. Start the development server:
```bash
pnpm dev
```

Visit `http://localhost:3000` to access the application.

## Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
