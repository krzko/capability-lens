import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Performer {
  name: string;
  score: number;
  change: number;
  matrix: string;
}

interface PerformersTableProps {
  topPerformers?: Performer[];
  bottomPerformers?: Performer[];
  isLoading?: boolean;
}

export function PerformersTable({ topPerformers, bottomPerformers, isLoading }: PerformersTableProps) {
  const renderLoadingRows = () => (
    <>
      {[...Array(3)].map((_, index) => (
        <TableRow key={index}>
          <TableCell>
            <div className="h-4 w-24 bg-muted rounded animate-pulse" />
          </TableCell>
          <TableCell>
            <div className="h-4 w-20 bg-muted rounded animate-pulse" />
          </TableCell>
          <TableCell>
            <div className="h-4 w-12 bg-muted rounded animate-pulse" />
          </TableCell>
          <TableCell>
            <div className="h-4 w-16 bg-muted rounded animate-pulse" />
          </TableCell>
        </TableRow>
      ))}
    </>
  );

  const renderPerformers = (performers: Performer[] | undefined, title: string) => (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Matrix</TableHead>
              <TableHead>Score</TableHead>
              <TableHead>Change</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              renderLoadingRows()
            ) : performers?.length ? (
              performers.map((performer, index) => (
                <TableRow key={index}>
                  <TableCell>{performer.name}</TableCell>
                  <TableCell>{performer.matrix}</TableCell>
                  <TableCell>{performer.score.toFixed(1)}</TableCell>
                  <TableCell className={performer.change > 0 ? "text-green-600" : "text-red-600"}>
                    {performer.change > 0 ? "↑" : "↓"} {Math.abs(performer.change).toFixed(1)}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-muted-foreground">
                  No data available
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {renderPerformers(topPerformers, "Top Performers")}
      {renderPerformers(bottomPerformers, "Bottom Performers")}
    </div>
  );
}
