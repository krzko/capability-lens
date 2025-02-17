import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useMaturityTemplates } from '@/hooks/useMaturityAssessment';
import { useAllServicesHierarchy } from '@/hooks/useAllServicesHierarchy';

export function StartAssessment() {
  const router = useRouter();
  const { templates, isLoading: templatesLoading } = useMaturityTemplates();
  const { organisedServices, isLoading: servicesLoading } = useAllServicesHierarchy();
  const [selectedService, setSelectedService] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('');

  const handleStartAssessment = () => {
    if (selectedService && selectedTemplate) {
      router.push(`/services/${selectedService}/assessments?template=${selectedTemplate}`);
    }
  };

  if (templatesLoading || servicesLoading) {
    return <div className="text-sm text-gray-500">Loading...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Start New Assessment</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Select Service</label>
            <Select value={selectedService} onValueChange={setSelectedService}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a service" />
              </SelectTrigger>
              <SelectContent>
                {organisedServices?.map((org) => (
                  <div key={org.id}>
                    {org.teams.map((team) => (
                      <div key={team.id}>
                        {team.services.map((service) => (
                          <SelectItem key={service.id} value={service.id}>
                            {`${org.name} > ${team.name} > ${service.name}`}
                          </SelectItem>
                        ))}
                      </div>
                    ))}
                  </div>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Select Template</label>
            <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a template" />
              </SelectTrigger>
              <SelectContent>
                {templates?.map((template) => (
                  <SelectItem key={template.id} value={template.id}>
                    {template.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button
            className="w-full"
            disabled={!selectedService || !selectedTemplate}
            onClick={handleStartAssessment}
          >
            Start Assessment
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
