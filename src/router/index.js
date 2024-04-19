import { createRouter, createWebHistory } from "vue-router";
import Home from "../components/Home.vue";
import Analytics from "../components/Analytics.vue";
import Transactions from "../components/Transactions.vue";

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
      {
         path: "/transactions",
         name: "transactions",
         component: Transactions,
      },
   ],
});

export default router;
