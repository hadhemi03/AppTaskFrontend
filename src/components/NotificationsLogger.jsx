import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createEcho } from "../pusher";
import axios from "axios";
import { setNotifications, addNotification } from "../redux/notificationSlice";

export default function NotificationsLogger({ addNotification: addNotifFromParent }) {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);
  const userId = useSelector((state) => state.auth.user?.id);

  useEffect(() => {
    if (!userId || !token) return;

    // Fetch existing notifications from API
    axios
      .get("/api/notifications", { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => {
        const apiNotifs = Array.isArray(res.data) ? res.data : [];
        const localNotifs = JSON.parse(localStorage.getItem("notifications")) || [];

        // Merge API + local storage, avoiding duplicates
        const merged = [
          ...apiNotifs,
          ...localNotifs.filter((l) => !apiNotifs.some((r) => r.id === l.id)),
        ];

        // Ensure task is always top-level
        const normalized = merged.map((notif) => ({
          ...notif,
          task: notif.task || notif.data?.task || null,
        }));

        dispatch(setNotifications(normalized));
        if (addNotifFromParent) normalized.forEach((n) => addNotifFromParent(n));
      })
      .catch((err) => console.error("Failed to fetch notifications:", err));

    // Real-time listener
    const echo = createEcho(token);
    const channel = echo.private(`user.${userId}`);

    channel.listen(".test-notification", (e) => {
      console.log("Raw Echo event:", e);

      // Laravel broadcasts as plain object, so take e directly
      const payload = {
        ...e,
        task: e.task || e.data?.task || null, // ✅ Always normalize task
      };

      console.log("Normalized notification:", payload);

      dispatch(addNotification(payload));

      if (addNotifFromParent) addNotifFromParent(payload);
    });

    // Cleanup
    return () => {
      channel.stopListening(".test-notification");
      channel.unsubscribe();
    };
  }, [token, userId, dispatch, addNotifFromParent]);

  return null;
}
