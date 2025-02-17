import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function seedDoraTemplate() {
  const template = await prisma.maturityTemplate.create({
    data: {
      name: 'DORA Metrics Maturity Matrix',
      description: 'Assess your DevOps capabilities using DORA (DevOps Research and Assessment) metrics.',
      facets: {
        create: [
          {
            name: 'Deployment Frequency',
            description: 'How often does your organisation deploy code to production?',
            levels: {
              create: [
                {
                  number: 1,
                  name: 'Low',
                  description: 'Deployments happen less frequently than once per month. Manual processes and approvals slow down deployments significantly.'
                },
                {
                  number: 2,
                  name: 'Medium-Low',
                  description: 'Deployments occur between once per month and once per week. Some automation exists but manual steps are still required.'
                },
                {
                  number: 3,
                  name: 'Medium',
                  description: 'Deployments happen between once per week and once per day. Most deployment steps are automated.'
                },
                {
                  number: 4,
                  name: 'Medium-High',
                  description: 'Multiple deployments per day. Fully automated deployment pipeline with minimal manual intervention.'
                },
                {
                  number: 5,
                  name: 'Elite',
                  description: 'On-demand deployments (multiple times per day). Fully automated, continuous deployment with feature flags and canary releases.'
                }
              ]
            }
          },
          {
            name: 'Lead Time for Changes',
            description: 'How long does it take to go from code commit to code running in production?',
            levels: {
              create: [
                {
                  number: 1,
                  name: 'Low',
                  description: 'More than six months. Long review and testing cycles, manual processes, and multiple handoffs.'
                },
                {
                  number: 2,
                  name: 'Medium-Low',
                  description: 'Between one month and six months. Some automation but significant manual processes remain.'
                },
                {
                  number: 3,
                  name: 'Medium',
                  description: 'Between one week and one month. Automated testing and deployment, but some manual approvals required.'
                },
                {
                  number: 4,
                  name: 'Medium-High',
                  description: 'Between one day and one week. Highly automated pipeline with minimal manual intervention.'
                },
                {
                  number: 5,
                  name: 'Elite',
                  description: 'Less than one day. Fully automated pipeline with immediate feedback and deployment capabilities.'
                }
              ]
            }
          },
          {
            name: 'Time to Restore Service',
            description: 'How long does it take to restore service when an incident occurs?',
            levels: {
              create: [
                {
                  number: 1,
                  name: 'Low',
                  description: 'More than one week. Manual recovery processes, limited monitoring, and poor incident response procedures.'
                },
                {
                  number: 2,
                  name: 'Medium-Low',
                  description: 'Between one day and one week. Basic monitoring and some automated recovery procedures.'
                },
                {
                  number: 3,
                  name: 'Medium',
                  description: 'Less than one day. Good monitoring, automated alerts, and documented recovery procedures.'
                },
                {
                  number: 4,
                  name: 'Medium-High',
                  description: 'Less than one hour. Advanced monitoring, automated recovery for common failures, and well-practiced incident response.'
                },
                {
                  number: 5,
                  name: 'Elite',
                  description: 'Less than 15 minutes. Self-healing systems, automated rollbacks, and sophisticated monitoring with predictive analytics.'
                }
              ]
            }
          },
          {
            name: 'Change Failure Rate',
            description: 'What percentage of changes result in degraded service or require remediation?',
            levels: {
              create: [
                {
                  number: 1,
                  name: 'Low',
                  description: 'More than 45% change failure rate. Limited testing, poor quality controls, and frequent production issues.'
                },
                {
                  number: 2,
                  name: 'Medium-Low',
                  description: '30-45% change failure rate. Basic testing practices and some quality gates in place.'
                },
                {
                  number: 3,
                  name: 'Medium',
                  description: '15-30% change failure rate. Comprehensive testing strategy and established quality controls.'
                },
                {
                  number: 4,
                  name: 'Medium-High',
                  description: '7-15% change failure rate. Advanced testing practices, thorough code review, and strong quality culture.'
                },
                {
                  number: 5,
                  name: 'Elite',
                  description: 'Less than 7% change failure rate. Exceptional quality practices, comprehensive automated testing, and robust deployment validation.'
                }
              ]
            }
          }
        ]
      }
    }
  });

  console.log('Created DORA Metrics Maturity Matrix template:', template.id);
  return template;
}
