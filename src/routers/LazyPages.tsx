import React from "react";

const lazyPages = [
  {
    path: "/listitem",
    element: React.lazy(() => import("../pages/ListItem")),
    name:"Todo List",
  },
  {
    path: "/activity",
    element: React.lazy(() => import("../pages/Activity")),
    name:"Activity",
  },
];

export default lazyPages;