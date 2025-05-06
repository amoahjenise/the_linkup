import { useEffect, useState } from "react";
import { getSentRequests } from "../api/linkupRequestAPI";

export function useSentRequests(userId) {
  const [sentRequests, setSentRequests] = useState(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;

    const fetchSentRequests = async () => {
      try {
        const response = await getSentRequests(userId);
        if (response.success) {
          setSentRequests(
            new Set(response.linkupRequestList.map((req) => req.linkup_id))
          );
        }
      } catch (error) {
        console.error("Failed to fetch sent requests:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSentRequests();
  }, [userId]);

  return { sentRequests, loading };
}
