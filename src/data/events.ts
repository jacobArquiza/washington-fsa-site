export type WFSAEvent = {
  id: string;
  title: string;
  /** Calendar dates in the event's timezone: YYYY-MM-DD. */
  startDate: string;
  endDate?: string;
  /** Local 24-hour times: HH:mm. Omit when time is unconfirmed. */
  startTime?: string;
  endTime?: string;
  timeZone: string;
  location?: string;
  description?: string;
  /** Only verified internal paths or HTTPS destinations. */
  registrationUrl?: string;
  status?: "confirmed" | "cancelled" | "draft";
};

// Add only confirmed, approved public records. Test fixtures live in tests/.
export const events: readonly WFSAEvent[] = [];
