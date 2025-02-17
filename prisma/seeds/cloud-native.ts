import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function seedCloudNativeTemplate() {
  const template = await prisma.maturityTemplate.create({
    data: {
      name: 'Cloud Native Maturity Matrix',
      description: 'Assess your cloud native practices and capabilities across key dimensions.',
      facets: {
        create: [
          {
            name: 'Container Strategy',
            description: 'How effectively do you use containers and container orchestration?',
            levels: {
              create: [
                {
                  number: 1,
                  name: 'Initial',
                  description: 'Limited container usage. Manual container management. No standardization.'
                },
                {
                  number: 2,
                  name: 'Managed',
                  description: 'Basic container orchestration. Some standardization. Manual scaling.'
                },
                {
                  number: 3,
                  name: 'Defined',
                  description: 'Kubernetes in production. Container standards. Automated scaling.'
                },
                {
                  number: 4,
                  name: 'Measured',
                  description: 'Advanced orchestration. Service mesh. Automated container lifecycle.'
                },
                {
                  number: 5,
                  name: 'Optimised',
                  description: 'Serverless containers. Advanced service mesh. AI-powered orchestration.'
                }
              ]
            }
          },
          {
            name: 'Microservices Architecture',
            description: 'How well do you implement microservices patterns and practices?',
            levels: {
              create: [
                {
                  number: 1,
                  name: 'Initial',
                  description: 'Monolithic applications. Limited service separation. Tight coupling.'
                },
                {
                  number: 2,
                  name: 'Managed',
                  description: 'Some service separation. Basic API management. Manual service discovery.'
                },
                {
                  number: 3,
                  name: 'Defined',
                  description: 'Microservices architecture. API gateway. Service discovery.'
                },
                {
                  number: 4,
                  name: 'Measured',
                  description: 'Event-driven architecture. Circuit breakers. Advanced monitoring.'
                },
                {
                  number: 5,
                  name: 'Optimised',
                  description: 'Serverless microservices. Advanced patterns. Self-healing services.'
                }
              ]
            }
          },
          {
            name: 'Infrastructure as Code',
            description: 'How effectively do you manage infrastructure through code?',
            levels: {
              create: [
                {
                  number: 1,
                  name: 'Initial',
                  description: 'Manual infrastructure management. Limited automation. No version control.'
                },
                {
                  number: 2,
                  name: 'Managed',
                  description: 'Basic IaC tools. Some automation. Manual approvals.'
                },
                {
                  number: 3,
                  name: 'Defined',
                  description: 'Comprehensive IaC. Version control. Automated provisioning.'
                },
                {
                  number: 4,
                  name: 'Measured',
                  description: 'Advanced IaC patterns. Policy as code. Drift detection.'
                },
                {
                  number: 5,
                  name: 'Optimised',
                  description: 'Self-service infrastructure. AI-powered optimization. Complete automation.'
                }
              ]
            }
          },
          {
            name: 'Cloud Native Storage',
            description: 'How well do you implement cloud native storage solutions?',
            levels: {
              create: [
                {
                  number: 1,
                  name: 'Initial',
                  description: 'Traditional storage. Manual provisioning. Limited scalability.'
                },
                {
                  number: 2,
                  name: 'Managed',
                  description: 'Basic cloud storage. Some automation. Manual backup.'
                },
                {
                  number: 3,
                  name: 'Defined',
                  description: 'Cloud native storage. Automated provisioning. Backup automation.'
                },
                {
                  number: 4,
                  name: 'Measured',
                  description: 'Advanced storage patterns. Data lifecycle management. Cross-region replication.'
                },
                {
                  number: 5,
                  name: 'Optimised',
                  description: 'Serverless storage. AI-powered optimization. Advanced data services.'
                }
              ]
            }
          }
        ]
      }
    }
  });

  console.log('Created Cloud Native Maturity Matrix template:', template.id);
}
