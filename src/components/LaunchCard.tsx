import { Launch } from "@/types/launches";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { MapPinIcon, RocketIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

export default function LaunchCard({ launch }: { launch: Launch }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl inline-flex items-center">
          <RocketIcon
            className={cn(
              "mr-2",
              launch.launch_success ? "text-green-500" : "text-red-600"
            )}
          />
          {launch.mission_name}
        </CardTitle>
        <CardDescription>
          {launch.launch_date_local
            ? format(new Date(launch.launch_date_local), "PPP")
            : ""}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="bg-muted/40 border text-sm border-border p-3 rounded-lg">
          <p>{launch.details ? launch.details : "No details available"}</p>
        </div>
        {!launch.launch_success && (
          <div className="mt-2">
            <p className="text-xs italic">
              <span className="text-muted-foreground"> Failure Reason : </span>{" "}
              <span className="text-red-500 ">
                {" "}
                {launch.launch_failure_details?.reason}
              </span>
            </p>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <div className="flex flex-wrap space-x-2 items-center">
          <div className="py-1.5 text-xs px-4 bg-secondary rounded-xl">
            🚀 {launch.rocket.rocket_name}
          </div>
          <div className="py-1.5 text-xs inline-flex items-center px-4 bg-secondary rounded-xl">
            <MapPinIcon className="h-3 w-3 mr-2" />
            {launch.launch_site.site_name}
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
