import { useQuery } from "@tanstack/react-query";

import { animeService } from "../api/services/animeServices";
import { getListItems } from "../utils/helpers";

export function useSchedule(day: string) {
  return useQuery({
    queryFn: () => animeService.getSchedule(day),
    queryKey: ["schedule", day],
    select: getListItems,
  });
}
