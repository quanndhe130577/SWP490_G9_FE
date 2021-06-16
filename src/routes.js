import React from "react";
import Loadable from "react-loadable";

function Loading() {
  return <div>Loading...</div>;
}

const Dashboard = Loadable({
  loader: () => import("./views/Home/index"),
  loading: Loading,
});
// const TableViewer = Loadable({
//   loader: () => import("./views/AutoGenerate/TableViewer"),
//   loading: Loading,
// });
const BuyFish = Loadable({
  loader: () => import("./views/User/Traders/BuyFish/BuyFish"),
  loading: Loading,
});
const ChangeUserInfo = Loadable({
  loader: () => import("./views/User/ChangeUserInfo/ChangeUserInfo"),
  loading: Loading,
});
const Basket = Loadable({
  loader: () => import("./views/User/Traders/Basket/Basket"),
  loading: Loading,
});
const PondOwner = Loadable({
  loader: () => import("./views/User/Traders/PondOwner/PondOwner"),
  loading: Loading,
});
const routes = [
  {
    path: "/home",
    name: "Dashboard",
    component: Dashboard,
  },
  // {
  //   path: "/tableViewer",
  //   name: "TableViewer",
  //   component: TableViewer,
  // },
  {
    path: "/buyF",
    name: "BuyFish",
    component: BuyFish,
  },
  {
    path: "/ChangeUserInfo/",
    name: "ChangeUserInfo",
    component: ChangeUserInfo,
  },
  {
    path: "/basket",
    name: "Basket",
    component: Basket,
  },
  {
    path: "/pondOwner",
    name: "PondOwner",
    component: PondOwner,
  },
];

export default routes;
