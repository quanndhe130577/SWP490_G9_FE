import { Spin } from "antd";
import React from "react";
import Loadable from "react-loadable";

function Loading() {
  return (
    <div>
      <Spin />
    </div>
  );
}
const Home = Loadable({
  loader: () => import("./views/Home/index"),
  loading: Loading,
});
const ManaBuy = Loadable({
  loader: () => import("./views/Management/BuyFish"),
  loading: Loading,
});
const ManaSell = Loadable({
  loader: () => import("./views/Management/Sell"),
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

const TimeKeeping = Loadable({
  loader: () => import("./views/User/Traders/TimeKeeping/TimeKeeping"),
  loading: Loading,
});
const PondOwner = Loadable({
  loader: () => import("./views/User/Traders/PondOwner/PondOwner"),
  loading: Loading,
});
const FishType = Loadable({
  loader: () => import("./views/User/Traders/FishType/FishType"),
  loading: Loading,
});
const Basket = Loadable({
  loader: () => import("./views/User/Traders/Basket/Basket"),
  loading: Loading,
});
const Truck = Loadable({
  loader: () => import("./views/User/Traders/Truck/Truck"),
  loading: Loading,
});
const Drum = Loadable({
  loader: () => import("./views/User/Traders/Drum/Drum"),
  loading: Loading,
});
const Employee = Loadable({
  loader: () => import("./views/User/Traders/Employee/Employee"),
  loading: Loading,
});
const CostIncurred = Loadable({
  loader: () => import("./views/User/Traders/CostIncurred/CostIncurred"),
  loading: Loading,
});
const TruckComp = Loadable({
  loader: () => import("./views/User/Traders/Truck/Truck-1"),
  loading: Loading,
});
const Buyer = Loadable({
  loader: () => import("./views/User/Traders/Buyer/Buyer"),
  loading: Loading,
});
const SellFish = Loadable({
  loader: () => import("./views/User/SellFish/SellFish"),
  loading: Loading,
});
const Debt = Loadable({
  loader: () => import("./views/User/Debt/Debt"),
  loading: Loading,
});
const Trader = Loadable({
  loader: () => import("./views/User/WeightRecorder/Trader/Trader"),
  loading: Loading,
});
const EmployeeSalary = Loadable({
  loader: () => import("./views/User/Traders/EmployeeSalary/EmployeeSalary"),
  loading: Loading,
});
const ForgetPassword = Loadable({
  loader: () => import("./views/Entry/ForgetPassword/Forget"),
  loading: Loading,
});
const CheckOTP = Loadable({
  loader: () => import("./views/Entry/ForgetPassword/CheckOTP"),
  loading: Loading,
});
const EmployeeBaseSalary = Loadable({
  loader: () => import("./views/User/Traders/Salary/EmployeeBaseSalary/EmployeeBaseSalary"),
  loading: Loading,
});
const EmployeeHistorySalary = Loadable({
  loader: () => import("./views/User/Traders/Salary/EmployeeHistorySalary/EmployeeHistorySalary"),
  loading: Loading,
});
const routes = [

  {
    path: "/home",
    name: "Home",
    component: Home,
  },
  {
    path: "/buy",
    name: "ManaBuy",
    component: ManaBuy,
  },
  {
    path: "/buyFish",
    name: "BuyFish",
    component: BuyFish,
  },
  {
    path: "/ChangeUserInfo/",
    name: "ChangeUserInfo",
    component: ChangeUserInfo,
  },
  {
    path: "/pondOwner",
    name: "PondOwner",
    component: PondOwner,
  },
  {
    path: "/fishType",
    name: "FishType",
    component: FishType,
  },
  {
    path: "/basket",
    name: "Basket",
    component: Basket,
  },
  {
    path: "/truck",
    name: "Truck",
    component: Truck,
  },
  {
    path: "/drum",
    name: "Drum",
    component: Drum,
  },
  {
    path: "/employee",
    name: "Employee",
    component: Employee,
  },
  {
    path: "/timeKeeping",
    name: "TimeKeeping",
    component: TimeKeeping,
  },
  {
    path: "/costIncurred",
    name: "CostIncurred",
    component: CostIncurred,
  },
  {
    path: "/truck1",
    name: "Truck",
    component: TruckComp,
  },
  {
    path: "/buyer",
    name: "Buyer",
    component: Buyer,
  },
  {
    path: "/sellF",
    name: "SellFish",
    component: SellFish,
  },
  {
    path: "/debt",
    name: "Debt",
    component: Debt,
  },
  {
  },
  {
    path: "/trader",
    name: "Trader",
    component: Trader,
  },
  {
    path: "/sell",
    name: "ManaSell",
    component: ManaSell,
  },
  {
    path: "/salary",
    name: "EmployeeSalary",
    component: EmployeeSalary,
  },
  {
    path: "/checkOTP",
    name: "checkOTP_reset",
    component: CheckOTP,
  },
  {
    path: "/employeeBaseSalary",
    name: "EmployeeBaseSalary",
    component: EmployeeBaseSalary,
  },
  {
    path: "/employeeHistorySalary",
    name: "EmployeeHistorySalary",
    component: EmployeeHistorySalary,
  },
];

export default routes;
