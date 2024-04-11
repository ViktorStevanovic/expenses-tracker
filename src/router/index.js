import { createRouter, createWebHistory } from "vue-router";
import Home from "../components/Home.vue";
import Analytics from "../components/Analytics.vue";

const router = createRouter({
   history: createWebHistory(import.meta.env.BASE_URL),
   routes: [
      {
         path: "/",
         name: "home",
         component: Home,
      },
      {
         path: "/analytics",
         name: "analytics",
         component: Analytics,
      },
   ],
});

export default router;
