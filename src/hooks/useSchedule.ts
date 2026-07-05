import { useQuery } from "@tanstack/react-query";

import { newAnimeService } from "../api/services/newAnimeService";
import { getNewScheduleItems } from "../utils/helpers";

export function useSchedule(day: string) {
  return useQuery({
    queryFn: newAnimeService.getSchedule,
    queryKey: ["newApi", "schedule", day],
    select: (response) => getNewScheduleItems(response, day),
  });
}
