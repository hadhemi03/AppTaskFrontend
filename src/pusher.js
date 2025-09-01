import Echo from "laravel-echo";
import Pusher from "pusher-js";

window.Pusher = Pusher;

export const createEcho = (token) => {
  return new Echo({
    broadcaster: "pusher",
    key: import.meta.env.VITE_PUSHER_APP_KEY,
    cluster: import.meta.env.VITE_PUSHER_APP_CLUSTER,
    forceTLS: true,
    authEndpoint: "http://localhost:8000/broadcasting/auth", 
    auth: {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    },
  });
};
