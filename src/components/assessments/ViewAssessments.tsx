import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useServiceHierarchy } from '@/hooks/useServiceHierarchy';

interface Assessment {
  id: string;
  createdAt: string;
  template: {
    id: string;
    name: string;
  };
}

export function ViewAssessments() {
  const router = useRouter();
  const { organisedServices, isLoading: servicesLoading } = useServiceHierarchy();
  const [selectedService, setSelectedService] = useState('');
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selectedService) {
      setLoading(true);
      fetch(`/api/services/${selectedService}/assessments`)
        .then(res => res.json())
        .then(data => setAssessments(data))
        .catch(error => console.error('Error fetching assessments:', error))
        .finally(() => setLoading(false));
    }
  }, [selectedService]);

  const handleViewAssessment = (assessmentId: string) => {
    router.push(`/services/${selectedService}/assessments/${assessmentId}`);
  };

  if (servicesLoading) {
    return <div className="text-sm text-gray-500">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>View Service Assessments</CardTitle>
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
          </div>
        </CardContent>
      </Card>

      {selectedService && (
        <div className="space-y-4">
          {loading ? (
            <div className="text-sm text-gray-500">Loading assessments...</div>
          ) : assessments.length === 0 ? (
            <div className="text-sm text-gray-500">No assessments found for this service</div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {assessments.map((assessment) => (
                <Card key={assessment.id}>
                  <CardHeader>
                    <CardTitle className="text-sm">{assessment.template.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <p className="text-sm text-gray-500">
                        Created: {new Date(assessment.createdAt).toLocaleDateString()}
                      </p>
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => handleViewAssessment(assessment.id)}
                      >
                        View Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
