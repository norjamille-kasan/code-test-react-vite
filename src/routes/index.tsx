import LoadingLaunchesIndicator from "@/components/LoadingLaunchesIndicator";
import { Launch } from "@/types/launches";
import { useInfiniteQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useIntersectionObserver } from "usehooks-ts";
import { PartyPopperIcon } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { ChangeEvent, useState } from "react";
import LaunchCard from "@/components/LaunchCard";
export const Route = createFileRoute("/")({
  component: Index,
});

const getLaunches = async ({
  pageParam,
}: {
  pageParam: number;
}): Promise<{
  launches: Launch[];
  prevOffset: number;
  hasNextPage: boolean;
}> => {
  const response = await fetch(
    `https://api.spacexdata.com/v3/launches?limit=10&offset=${pageParam}`
  );
  const data = (await response.json()) as Launch[];
  return {
    launches: data,
    prevOffset: pageParam,
    hasNextPage: data.length > 0,
  };
};

function Index() {
  const [term, setTerm] = useState("");
  const [filteredList, setFilteredList] = useState<Launch[]>([]);

  const handleSearch = (event: ChangeEvent<HTMLInputElement>) => {
    setTerm(event.target.value);
    const filteredList = data?.pages
      .flatMap((page) => page.launches)
      .filter((launch) => {
        return (
          launch.mission_name
            .toLowerCase()
            .includes(event.target.value.toLowerCase()) ||
          launch.rocket.rocket_name
            .toLowerCase()
            .includes(event.target.value.toLowerCase())
        );
      });
    setFilteredList(filteredList || []);
  };

  const { ref } = useIntersectionObserver({
    onChange(isIntersecting, _) {
      if (isIntersecting) {
        fetchNextPage();
      }
    },
  });

  const {
    data,
    isLoading,
    isError,
    error,
    hasNextPage,
    isFetchingNextPage,
    isFetching,
    fetchNextPage,
  } = useInfiniteQuery({
    queryKey: ["launches"],
    queryFn: getLaunches,
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      if (!lastPage.hasNextPage) {
        return null;
      }
      return lastPage.prevOffset + 10;
    },
  });

  if (isLoading) return <LoadingLaunchesIndicator />;
  if (isError) return <div>Error: {error.message}</div>;

  return (
    <div className="mt-4 grid gap-4">
      <div className="">
        <Input
          type="search"
          className="bg-muted/40 sm:w-80"
          placeholder="Search by mission name or rocket name"
          value={term}
          onChange={handleSearch}
        />
      </div>
      <div className="gap-4  grid">
        {term.length === 0
          ? data?.pages.map((page, index) => (
              <div key={index} className="gap-4 grid">
                {page.launches.map((launch) => (
                  <LaunchCard key={launch.flight_number} launch={launch} />
                ))}
              </div>
            ))
          : filteredList.map((launch) => (
              <LaunchCard key={launch.flight_number} launch={launch} />
            ))}
      </div>
      {/* i don't want to trigger the intersection observer when searching because im just searching in the current array */}
      {term.length === 0 && (
        <>
          <div ref={ref}>
            {isFetchingNextPage ? (
              <LoadingLaunchesIndicator />
            ) : hasNextPage ? (
              ""
            ) : (
              <div className="my-10">
                <Alert>
                  <PartyPopperIcon className="h-4 w-4" />
                  <AlertTitle>All caught up</AlertTitle>
                  <AlertDescription>
                    There are no more launches
                  </AlertDescription>
                </Alert>
              </div>
            )}
          </div>
          <div>{isFetching && !isFetchingNextPage ? "Fetching..." : null}</div>
        </>
      )}
    </div>
  );
}
