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
  service: {
    id: string;
    name: string;
    team: {
      name: string;
      organisation: {
        name: string;
      };
    };
  };
  overallScore?: number;
}

export function ViewAssessments() {
  const router = useRouter();
  const { organisedServices, isLoading: servicesLoading } = useServiceHierarchy();
  const [selectedService, setSelectedService] = useState('');
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Get serviceId from URL query parameters
    const params = new URLSearchParams(window.location.search);
    const serviceId = params.get('serviceId');
    if (serviceId) {
      setSelectedService(serviceId);
    }
  }, []);

  useEffect(() => {
    if (selectedService) {
      setLoading(true);
      console.log('Fetching assessments for service:', selectedService);
      fetch(`/api/services/${selectedService}/assessments`)
        .then(async res => {
          if (!res.ok) {
            const errorData = await res.json();
            throw new Error(`API Error: ${errorData.error || res.statusText}`);
          }
          return res.json();
        })
        .then(data => {
          console.log('Received assessments:', data);
          setAssessments(data);
        })
        .catch(error => {
          console.error('Error fetching assessments:', error);
          // You might want to show this error to the user
        })
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
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="animate-pulse">
                  <CardHeader>
                    <div className="h-4 bg-gray-200 rounded w-3/4" />
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="h-4 bg-gray-200 rounded w-1/2" />
                      <div className="h-8 bg-gray-200 rounded w-full" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : assessments.length === 0 ? (
            <Card>
              <CardContent className="py-8">
                <div className="text-center text-muted-foreground">
                  <p>No assessments found for this service</p>
                  <Button
                    variant="outline"
                    className="mt-4"
                    onClick={() => router.push(`/services/${selectedService}/assessments/new`)}
                  >
                    Create New Assessment
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {assessments.map((assessment) => (
                <Card key={assessment.id} className="hover:bg-accent/5">
                  <CardHeader>
                    <CardTitle className="text-lg">{assessment.template.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {assessment.service.team.organisation.name} / {assessment.service.team.name}
                    </p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <div className="text-sm text-muted-foreground">
                          {new Date(assessment.createdAt).toLocaleDateString('en-AU', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                          })}
                        </div>
                        {assessment.overallScore && (
                          <div className="text-lg font-semibold">
                            {assessment.overallScore.toFixed(1)}/5
                          </div>
                        )}
                      </div>
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => handleViewAssessment(assessment.id)}
                      >
                        View Assessment
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
