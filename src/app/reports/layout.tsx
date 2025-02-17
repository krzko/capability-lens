import { redirect } from 'next/navigation';

export default function ReportsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

export async function generateMetadata() {
  return {
    title: 'Reports & Analytics - Capability Lens',
    description: 'Comprehensive insights across your maturity assessments',
  };
}
