import { useEffect } from "react";
import echo from "../pusher";

export default function NotificationsLogger() {

  useEffect(() => {
 
    console.log("This is test log");

    const channel = echo.channel("notifications")
        .listen(".test-notification", (e) => {
            console.log("Test notification received:", e.message);
        });

    return () => {
      echo.leaveChannel("notifications");
    };
  }, []);

  return null;
}