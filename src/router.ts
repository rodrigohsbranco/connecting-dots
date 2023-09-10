import { createRouter, createWebHashHistory } from "vue-router";
//@ts-ignore
import routes from "virtual:generated-pages";

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

console.log(routes);



export default router;
