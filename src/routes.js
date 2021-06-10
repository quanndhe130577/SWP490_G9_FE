import React from "react";
import Loadable from "react-loadable";

function Loading() {
  return <div>Loading...</div>;
}

const Dashboard = Loadable({
  loader: () => import("./views/Home/index"),
  loading: Loading,
});
const WR = Loadable({
  loader: () => import("./views/User/WeightRecoder/WR"),
  loading: Loading,
});
const BuyFish = Loadable({
  loader: () => import("./views/User/Traders/BuyFish/BuyFish"),
  loading: Loading,
});
const ChangeUserInfo = Loadable({
  loader: () => import("./views/User/ChangeUserInfo/ChangeUserInfo"),
  loading: Loading,
});
const routes = [
  {
    path: "/home",
    name: "Dashboard",
    component: Dashboard,
  },
  {
    path: "/wr",
    name: "WR",
    component: WR,
  },
  {
    path: "/buyF",
    name: "BuyFish",
    component: BuyFish,
  },
  {
    path: "/ChangeUserInfo/:action",
    name: "ChangeUserInfo",
    component: ChangeUserInfo,
  },
];

export default routes;
