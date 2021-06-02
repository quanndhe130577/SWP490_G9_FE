import React from "react";
import Loadable from "react-loadable";

function Loading() {
  return <div>Loading...</div>;
}

const Dashboard = Loadable({
  loader: () => import("./views/Dashboard/index"),
  loading: Loading,
});
const WR = Loadable({
  loader: () => import("./views/User/WeightRecoder/WR"),
  loading: Loading,
});
const Test = Loadable({
  loader: () => import("./views/User/Traders/Test"),
  loading: Loading,
});
const routes = [
  {
    path: "/dashboard",
    name: "Dashboard",
    component: Dashboard,
  },
  {
    path: "/home",
    name: "WR",
    component: WR,
  },
  {
    path: "/test",
    name: "Test",
    component: Test,
  },
];

export default routes;
