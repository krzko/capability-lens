import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function seedObservabilityTemplate() {
  // First create the template schema structure
  const templateSchema = {
    type: 'object',
    properties: {
      'Data Collection and Quality': {
        type: 'object',
        description: 'Assessment of telemetry collection practices and data quality standards.',
        recommendations: [
          'Implement OpenTelemetry across all services',
          'Establish standardised attribute conventions',
          'Define and implement sampling strategies',
          'Validate telemetry data quality regularly'
        ],
        evidence: '',
        levels: [
          {
            level: 1,
            name: 'Foundation',
            description: 'Services at this level demonstrate basic telemetry collection. Teams collect logs and metrics without standardization.'
          },
          {
            level: 2,
            name: 'Standardisation',
            description: 'Services implement consistent logging patterns and basic metric collection.'
          },
          {
            level: 3,
            name: 'Integration',
            description: 'Services demonstrate comprehensive OpenTelemetry instrumentation with standardized attributes.'
          },
          {
            level: 4,
            name: 'Optimisation',
            description: 'Services showcase advanced context propagation across boundaries.'
          },
          {
            level: 5,
            name: 'Innovation',
            description: 'Services feature automated detection of instrumentation gaps.'
          }
        ]
      },
      'Service Level Objectives (SLOs)': {
        type: 'object',
        description: 'Evaluation of SLO implementation and usage for reliability management.',
        recommendations: [
          'Define clear SLOs for all critical user journeys',
          'Implement error budget policies',
          'Automate SLO tracking and reporting',
          'Align SLOs with business objectives'
        ],
        evidence: '',
        levels: [
          {
            level: 1,
            name: 'Foundation',
            description: 'Services have basic uptime monitoring without clearly defined SLOs.'
          },
          {
            level: 2,
            name: 'Standardisation',
            description: 'Services have fundamental SLOs with basic error budget policies.'
          },
          {
            level: 3,
            name: 'Integration',
            description: 'Services maintain well-defined SLOs with appropriate SLIs reflecting user experience.'
          },
          {
            level: 4,
            name: 'Optimisation',
            description: 'Services feature a robust SLO framework with automated error budget tracking.'
          },
          {
            level: 5,
            name: 'Innovation',
            description: 'Services demonstrate industry-leading SLO practices.'
          }
        ]
      },
      'Troubleshooting Effectiveness': {
        type: 'object',
        description: 'Assessment of incident response and troubleshooting capabilities.',
        recommendations: [
          'Implement comprehensive tracing',
          'Create detailed runbooks',
          'Establish incident response procedures',
          'Use automated root cause analysis'
        ],
        evidence: '',
        levels: [
          {
            level: 1,
            name: 'Foundation',
            description: 'Basic troubleshooting with limited tooling and ad-hoc processes.'
          },
          {
            level: 2,
            name: 'Standardisation',
            description: 'Standard debugging tools and basic incident response procedures.'
          },
          {
            level: 3,
            name: 'Integration',
            description: 'Comprehensive tracing and well-defined incident management.'
          },
          {
            level: 4,
            name: 'Optimisation',
            description: 'Advanced diagnostics with automated root cause analysis.'
          },
          {
            level: 5,
            name: 'Innovation',
            description: 'AI-assisted troubleshooting and predictive issue detection.'
          }
        ]
      },
      'Operational Excellence': {
        type: 'object',
        description: 'Evaluation of operational practices and tooling maturity.',
        recommendations: [
          'Implement comprehensive dashboards',
          'Establish alert correlation',
          'Automate runbooks',
          'Define clear incident response processes'
        ],
        evidence: '',
        levels: [
          {
            level: 1,
            name: 'Foundation',
            description: 'Basic dashboards and minimal alerting with informal processes.'
          },
          {
            level: 2,
            name: 'Standardisation',
            description: 'Standard dashboards and consistent alerting with documented processes.'
          },
          {
            level: 3,
            name: 'Integration',
            description: 'Comprehensive dashboards with alert correlation and tested processes.'
          },
          {
            level: 4,
            name: 'Optimisation',
            description: 'Advanced metrics and automated runbooks with data-driven improvements.'
          },
          {
            level: 5,
            name: 'Innovation',
            description: 'AI-powered operations with self-updating runbooks.'
          }
        ]
      },
      'Performance Optimisation': {
        type: 'object',
        description: 'Assessment of performance monitoring and optimization practices.',
        recommendations: [
          'Implement continuous profiling',
          'Establish performance baselines',
          'Automate performance testing',
          'Use data-driven optimization'
        ],
        evidence: '',
        levels: [
          {
            level: 1,
            name: 'Foundation',
            description: 'Basic performance monitoring with reactive optimization.'
          },
          {
            level: 2,
            name: 'Standardisation',
            description: 'Regular performance testing with established baselines.'
          },
          {
            level: 3,
            name: 'Integration',
            description: 'Continuous profiling with regular optimization reviews.'
          },
          {
            level: 4,
            name: 'Optimisation',
            description: 'Advanced analytics with automated regression detection.'
          },
          {
            level: 5,
            name: 'Innovation',
            description: 'ML-based optimization with automated capacity planning.'
          }
        ]
      }
    }
  };

  const template = await prisma.maturityTemplate.create({
    data: {
      name: 'Observability Maturity Matrix',
      description: 'A comprehensive framework for assessing observability practices and capabilities.',
      templateSchema,
      version: '0.1.0',
      isCustom: false,
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

  // Create a sample service and assessment
  const team = await prisma.team.create({
    data: {
      name: 'Platform Engineering',
      organisation: {
        create: {
          name: 'Example Org'
        }
      }
    }
  });

  const service = await prisma.service.create({
    data: {
      name: 'API Gateway',
      description: 'Core API Gateway service',
      teamId: team.id
    }
  });

  // Create an assessment with the new schema structure
  const assessment = await prisma.assessment.create({
    data: {
      templateId: template.id,
      serviceId: service.id,
      assessor: 'System',
      scores: {
        'Data Collection and Quality': {
          score: 2,
          evidence: 'Initial OpenTelemetry implementation with basic logging patterns.'
        },
        'Service Level Objectives (SLOs)': {
          score: 3,
          evidence: 'Well-defined SLOs with error budget policies in place.'
        },
        'Troubleshooting Effectiveness': {
          score: 2,
          evidence: 'Basic troubleshooting procedures documented.'
        },
        'Performance Optimisation': {
          score: 1,
          evidence: 'Initial performance monitoring setup.'
        }
      }
    }
  });

  console.log('Created sample assessment:', assessment.id);
  return template;
}
