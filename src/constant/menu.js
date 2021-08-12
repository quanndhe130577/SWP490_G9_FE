import {
  UserOutlined,
  TableOutlined,
  SettingOutlined,
  CarOutlined,
  OrderedListOutlined,
  UsergroupAddOutlined,
  MoneyCollectOutlined,
  DollarOutlined,
  LineChartOutlined,
  UserSwitchOutlined
} from "@ant-design/icons";

// menu in layout
const MENU = [
  {
    type: "subMenu",
    title: "goodManagement",
    icon: <SettingOutlined />,
    menu: [
      {
        link: "/buy",
        title: "buyGood",
        role: "Thương lái",
      },
      {
        link: "/sell",
        title: "sellGood",
      },
    ],
  },
  {
    title: "pondOwnerManagement",
    icon: <UserOutlined />,
    link: "/pondOwner",
    role: "Thương lái",
  },
  {
    title: "reportManagement",
    icon: <LineChartOutlined />,
    type: "subMenu",
    menu: [
      {
        link: "/home",
        title: "dayReport",
      },
      {
        link: "/monthReport",
        title: "monthReport",
      },
    ],
  },
  {
    title: "historyPurchaseFishtype",
    icon: <OrderedListOutlined />,
    link: "/fishType",
    role: "Thương lái",
  },

  {
    title: "basketManagement",
    icon: <TableOutlined />,
    link: "/basket",
    role: "Thương lái",
  },
  {
    type: "subMenu",
    title: "truckManagement",
    icon: <CarOutlined />,
    role: "Thương lái",
    menu: [
      {
        link: "/truck",
        title: "truck",
        role: "Thương lái",
      },
      {
        link: "/drum",
        title: "drum",
        role: "Thương lái",
      },
      // {
      //   link: "/truck1",
      //   title: "truck",
      // },
    ],
  },
  {
    type: "subMenu",
    title: "EmployeeManagement",
    icon: <UsergroupAddOutlined />,
    link: "/employee",
    role: "Thương lái",
    menu: [
      {
        title: "EmployeeList",
        link: "/employee",
        role: "Thương lái",
      },
      {
        link: "/employeeSalary",
        title: "salary",
        role: "Thương lái",
      },
      {
        title: "Time keeping",
        link: "/timeKeeping",
        role: "Thương lái",
      },
    ],
  },
  {
    title: "CostIncurredManagement",
    icon: <MoneyCollectOutlined />,
    link: "/costIncurred",
  },
  {
    title: "Trader",
    icon: <UserOutlined />,
    link: "/trader",
    role: "Chủ bến",
  },
  {
    title: "Buyer",
    icon: <DollarOutlined />,
    link: "/buyer",
  },
  {
    title: "Debt Management",
    icon: <DollarOutlined />,
    link: "/debt",
  },
  {
    title: "weightRecorder",
    icon: <UserSwitchOutlined />,
    link: "/weightRecorder",
    role: "Thương lái",
  },
];
export default MENU;
