import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function seedObservabilityTemplate() {
  const template = await prisma.maturityTemplate.create({
    data: {
      name: 'Observability Maturity Matrix',
      description: 'A comprehensive framework for assessing observability practices and capabilities.',
      facets: {
        create: [
          {
            name: 'Data Collection and Quality',
            description: 'Assessment of telemetry collection practices and data quality standards.',
            levels: {
              create: [
                {
                  number: 1,
                  name: 'Foundation',
                  description:
                    'Services at this level demonstrate basic telemetry collection. Teams collect logs and metrics without standardization, and OpenTelemetry usage may be inconsistent. Data collection often happens reactively, primarily after incidents occur. There is limited understanding of sampling strategies, and teams struggle with data consistency.'
                },
                {
                  number: 2,
                  name: 'Standardisation',
                  description:
                    'Services implement consistent logging patterns and basic metric collection. OpenTelemetry is partially used across some service components. Basic trace sampling may be in place, but not necessarily optimized. Context propagation might exist but can be incomplete across service boundaries.'
                },
                {
                  number: 3,
                  name: 'Integration',
                  description:
                    'Services demonstrate comprehensive OpenTelemetry instrumentation with standardized attributes aligned to recognized best practices. Structured logging includes correlation IDs, and metric collection follows defined naming conventions. Sampling strategies are documented and periodically reviewed. Teams collaborate to define and refine telemetry standards.'
                },
                {
                  number: 4,
                  name: 'Optimisation',
                  description:
                    'Services showcase advanced context propagation across boundaries, supplemented by high-quality custom instrumentation. Teams measure telemetry data quality and coverage regularly. Sampling decisions are data-driven and consistently refined. Teams also contribute to defining internal telemetry conventions and actively validate data quality.'
                },
                {
                  number: 5,
                  name: 'Innovation',
                  description:
                    'Services feature automated detection of instrumentation gaps and sophisticated sampling strategies. Teams contribute to the broader OpenTelemetry community or develop internal enhancements. Continuous validation of telemetry data quality occurs automatically, and teams pioneer new approaches to data collection and quality assurance.'
                }
              ]
            }
          },
          {
            name: 'Service Level Objectives (SLOs)',
            description: 'Evaluation of SLO implementation and usage for reliability management.',
            levels: {
              create: [
                {
                  number: 1,
                  name: 'Foundation',
                  description:
                    'Services have basic uptime monitoring without clearly defined SLOs. Error budgets are not utilized for decision-making, and reliability measurements are inconsistent. Teams lack clear reliability targets and struggle to quantify service health.'
                },
                {
                  number: 2,
                  name: 'Standardisation',
                  description:
                    'Services have fundamental SLOs with basic error budget policies. Teams track service reliability but may not consistently act on error budget data. SLI definitions exist but may not fully represent real user experiences.'
                },
                {
                  number: 3,
                  name: 'Integration',
                  description:
                    'Services maintain well-defined SLOs with appropriate SLIs reflecting user experience. Error budget policies actively influence engineering priorities. Teams routinely measure customer impact and adjust SLO targets based on business requirements. Regular reviews of SLO definitions occur.'
                },
                {
                  number: 4,
                  name: 'Optimisation',
                  description:
                    'Services feature a robust SLO framework with automated error budget tracking. Teams use SLO data effectively for work prioritization and capacity planning. Multi-level SLOs may exist for different user journeys, and there is close alignment between technical and business metrics.'
                },
                {
                  number: 5,
                  name: 'Innovation',
                  description:
                    'Services demonstrate advanced SLO implementations with machine learning–driven target recommendations. Automated reliability improvements occur based on historical patterns. Business stakeholders actively participate in defining SLOs, and teams pioneer new approaches to reliability measurement.'
                }
              ]
            }
          },
          {
            name: 'Troubleshooting Effectiveness',
            description: 'Assessment of incident response and problem resolution capabilities.',
            levels: {
              create: [
                {
                  number: 1,
                  name: 'Foundation',
                  description:
                    'Teams rely heavily on log searching for troubleshooting. Correlation between different telemetry types is limited, and mean time to resolution (MTTR) is typically high. Teams struggle to isolate root causes efficiently.'
                },
                {
                  number: 2,
                  name: 'Standardisation',
                  description:
                    'Basic trace analysis is introduced alongside log correlation. Teams maintain documented troubleshooting procedures and can identify common failure patterns. Runbooks exist but may be limited to known issues.'
                },
                {
                  number: 3,
                  name: 'Integration',
                  description:
                    'Services feature comprehensive trace analysis with high-quality spans and metadata. Teams effectively correlate logs, metrics, and traces across service boundaries. Routine troubleshooting drills occur, and teams maintain updated runbooks with clear procedures.'
                },
                {
                  number: 4,
                  name: 'Optimisation',
                  description:
                    'Services employ advanced trace analysis with custom attributes for business context. Teams utilize automated root cause analysis and focus on reducing MTTR. Troubleshooting procedures are continuously refined based on incident learnings.'
                },
                {
                  number: 5,
                  name: 'Innovation',
                  description:
                    'Services leverage AI-assisted troubleshooting and predictive issue detection. Automated remediation handles known issues, and sophisticated diagnostic tools facilitate proactive resolution. Continuous improvement in MTTR is achieved through learning systems and real-time feedback.'
                }
              ]
            }
          },
          {
            name: 'Operational Excellence',
            description: 'Evaluation of operational practices and tooling maturity.',
            levels: {
              create: [
                {
                  number: 1,
                  name: 'Foundation',
                  description:
                    'Services rely on rudimentary dashboards and minimal alerting. Documentation is incomplete, and on-call processes are informal. Incident response lacks a structured approach, leading to inconsistent operational outcomes.'
                },
                {
                  number: 2,
                  name: 'Standardisation',
                  description:
                    'Services maintain standardized dashboards for key metrics with consistent alerting rules. Teams follow structured on-call rotations and have basic runbooks. Incident response is documented but may need further refinement.'
                },
                {
                  number: 3,
                  name: 'Integration',
                  description:
                    'Services feature comprehensive dashboards offering both technical and business views. Teams employ coordinated alert correlation and routing. Incident response processes are well-defined and regularly tested, with updates to runbooks as needed.'
                },
                {
                  number: 4,
                  name: 'Optimisation',
                  description:
                    'Services drive business decisions through metrics and dashboards. Teams measure and regularly improve alert effectiveness. Runbook automation is in place for common scenarios, and incident response processes evolve based on data-driven insights.'
                },
                {
                  number: 5,
                  name: 'Innovation',
                  description:
                    'Services adopt AI-based recommendations for dashboard improvements and automated alert tuning. Runbooks update themselves with each incident, incorporating new knowledge. Teams lead in pioneering advanced operational practices.'
                }
              ]
            }
          },
          {
            name: 'Performance Optimisation',
            description: 'Assessment of performance monitoring and optimization practices.',
            levels: {
              create: [
                {
                  number: 1,
                  name: 'Foundation',
                  description:
                    'Services rely on minimal performance monitoring and occasional profiling during incidents. There is no systematic performance testing, and teams lack defined performance baselines.'
                },
                {
                  number: 2,
                  name: 'Standardisation',
                  description:
                    'Services conduct periodic performance testing and have basic continuous profiling. Teams establish and monitor performance baselines but may lack consistent optimization routines.'
                },
                {
                  number: 3,
                  name: 'Integration',
                  description:
                    'Services integrate performance testing in CI/CD pipelines. Continuous profiling features defined thresholds, and teams hold regular performance reviews tied to actionable improvement plans.'
                },
                {
                  number: 4,
                  name: 'Optimisation',
                  description:
                    'Services utilize advanced performance analytics with automated regression detection. Resource optimization is guided by profiling data, and teams maintain a robust performance monitoring framework.'
                },
                {
                  number: 5,
                  name: 'Innovation',
                  description:
                    'Services employ machine learning–based performance optimization and automated capacity planning. Teams innovate on new approaches to measurement and maintain top-tier optimization strategies.'
                }
              ]
            }
          }
        ]
      }
    }
  });

  console.log('Created Observability Maturity Matrix template:', template.id);
  return template;
}
