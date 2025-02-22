import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function seedSecurityTemplate() {
  // Create the template schema structure
  const templateSchema = {
    type: 'object',
    properties: {
      'Access Control': {
        type: 'object',
        description: 'How well do you manage and control access to systems and data?',
        recommendations: [
          'Implement multi-factor authentication',
          'Use role-based access control',
          'Implement privileged access management',
          'Regular access reviews'
        ],
        evidence: '',
        levels: [
          {
            level: 1,
            name: 'Basic',
            description: 'Basic password policies. No MFA. Shared accounts common. Limited access reviews.'
          },
          {
            level: 2,
            name: 'Developing',
            description: 'Password complexity enforced. MFA for critical systems. Some role-based access control.'
          },
          {
            level: 3,
            name: 'Defined',
            description: 'MFA widely implemented. Role-based access control. Regular access reviews. Password managers used.'
          },
          {
            level: 4,
            name: 'Managed',
            description: 'SSO implemented. Just-in-time access. Automated access reviews. Privileged access management.'
          },
          {
            level: 5,
            name: 'Optimised',
            description: 'Zero trust architecture. Continuous access evaluation. Biometric authentication. Advanced PAM.'
          }
        ]
      },
      'Vulnerability Management': {
        type: 'object',
        description: 'How effectively do you identify, assess, and remediate vulnerabilities?',
        recommendations: [
          'Implement automated vulnerability scanning',
          'Establish patch management process',
          'Use risk-based prioritisation',
          'Integrate threat intelligence'
        ],
        evidence: '',
        levels: [
          {
            level: 1,
            name: 'Basic',
            description: 'Ad-hoc vulnerability scanning. Manual patching. No formal process for vulnerability management.'
          },
          {
            level: 2,
            name: 'Developing',
            description: 'Regular vulnerability scanning. Basic patch management. Some prioritisation of vulnerabilities.'
          },
          {
            level: 3,
            name: 'Defined',
            description: 'Automated vulnerability scanning. Structured patch management. Risk-based prioritisation.'
          },
          {
            level: 4,
            name: 'Managed',
            description: 'Continuous vulnerability assessment. Automated patching. SLAs for remediation. Threat intelligence integration.'
          },
          {
            level: 5,
            name: 'Optimised',
            description: 'Real-time vulnerability detection. Automated remediation. Zero-day protection. Virtual patching.'
          }
        ]
      },
      'Security Testing': {
        type: 'object',
        description: 'How thoroughly do you test your security controls and applications?',
        recommendations: [
          'Implement SAST and DAST',
          'Regular penetration testing',
          'Establish bug bounty program',
          'Conduct red team exercises'
        ],
        evidence: '',
        levels: [
          {
            level: 1,
            name: 'Basic',
            description: 'Basic security testing. Manual code reviews. No regular penetration testing.'
          },
          {
            level: 2,
            name: 'Developing',
            description: 'Some automated security testing. Annual penetration testing. Basic SAST implementation.'
          },
          {
            level: 3,
            name: 'Defined',
            description: 'Regular security testing. SAST and DAST implemented. Structured penetration testing program.'
          },
          {
            level: 4,
            name: 'Managed',
            description: 'Continuous security testing. Advanced SAST/DAST. Regular red team exercises. Bug bounty program.'
          },
          {
            level: 5,
            name: 'Optimised',
            description: 'AI-powered security testing. Automated remediation. Advanced red team program. Active bug bounty.'
          }
        ]
      }
    }
  };

  const template = await prisma.maturityTemplate.create({
    data: {
      name: 'Security Maturity Matrix',
      description: 'Assess your security practices and controls across key domains.',
      templateSchema,
      version: '0.1.0',
      isCustom: false,
      facets: {
        create: [
          {
            name: 'Access Control',
            description: 'How well do you manage and control access to systems and data?',
            levels: {
              create: [
                {
                  number: 1,
                  name: 'Basic',
                  description: 'Basic password policies. No MFA. Shared accounts common. Limited access reviews.'
                },
                {
                  number: 2,
                  name: 'Developing',
                  description: 'Password complexity enforced. MFA for critical systems. Some role-based access control.'
                },
                {
                  number: 3,
                  name: 'Defined',
                  description: 'MFA widely implemented. Role-based access control. Regular access reviews. Password managers used.'
                },
                {
                  number: 4,
                  name: 'Managed',
                  description: 'SSO implemented. Just-in-time access. Automated access reviews. Privileged access management.'
                },
                {
                  number: 5,
                  name: 'Optimised',
                  description: 'Zero trust architecture. Continuous access evaluation. Biometric authentication. Advanced PAM.'
                }
              ]
            }
          },
          {
            name: 'Vulnerability Management',
            description: 'How effectively do you identify, assess, and remediate vulnerabilities?',
            levels: {
              create: [
                {
                  number: 1,
                  name: 'Basic',
                  description: 'Ad-hoc vulnerability scanning. Manual patching. No formal process for vulnerability management.'
                },
                {
                  number: 2,
                  name: 'Developing',
                  description: 'Regular vulnerability scanning. Basic patch management. Some prioritization of vulnerabilities.'
                },
                {
                  number: 3,
                  name: 'Defined',
                  description: 'Automated vulnerability scanning. Structured patch management. Risk-based prioritization.'
                },
                {
                  number: 4,
                  name: 'Managed',
                  description: 'Continuous vulnerability assessment. Automated patching. SLAs for remediation. Threat intelligence integration.'
                },
                {
                  number: 5,
                  name: 'Optimised',
                  description: 'Real-time vulnerability detection. Automated remediation. Zero-day protection. Virtual patching.'
                }
              ]
            }
          },
          {
            name: 'Security Testing',
            description: 'How thoroughly do you test your security controls and applications?',
            levels: {
              create: [
                {
                  number: 1,
                  name: 'Basic',
                  description: 'Basic security testing. Manual code reviews. No regular penetration testing.'
                },
                {
                  number: 2,
                  name: 'Developing',
                  description: 'Some automated security testing. Annual penetration testing. Basic SAST implementation.'
                },
                {
                  number: 3,
                  name: 'Defined',
                  description: 'Regular security testing. SAST and DAST implemented. Structured penetration testing program.'
                },
                {
                  number: 4,
                  name: 'Managed',
                  description: 'Continuous security testing. Advanced SAST/DAST. Regular red team exercises. Bug bounty program.'
                },
                {
                  number: 5,
                  name: 'Optimised',
                  description: 'Comprehensive security testing program. AI-powered testing. Chaos engineering. Advanced red teaming.'
                }
              ]
            }
          },
          {
            name: 'Incident Response',
            description: 'How well do you detect, respond to, and recover from security incidents?',
            levels: {
              create: [
                {
                  number: 1,
                  name: 'Basic',
                  description: 'Ad-hoc incident response. Limited monitoring. No formal incident response plan.'
                },
                {
                  number: 2,
                  name: 'Developing',
                  description: 'Basic incident response plan. Some security monitoring. Manual incident handling.'
                },
                {
                  number: 3,
                  name: 'Defined',
                  description: 'Documented incident response procedures. 24/7 monitoring. Regular incident response drills.'
                },
                {
                  number: 4,
                  name: 'Managed',
                  description: 'Automated incident detection and response. Advanced SIEM. Threat hunting capabilities.'
                },
                {
                  number: 5,
                  name: 'Optimised',
                  description: 'AI-powered incident response. Real-time threat detection. Automated containment and recovery.'
                }
              ]
            }
          }
        ]
      }
    }
  });

  console.log('Created Security Maturity Matrix template:', template.id);
}
