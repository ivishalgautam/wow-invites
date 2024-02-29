import { IoStatsChartOutline } from "react-icons/io5";
import { HiOutlineTemplate } from "react-icons/hi";
import { MdOutlineCategory } from "react-icons/md";

// Define the roles for each user type
const ROLES = {
  ADMIN: "admin",
  USER: "user",
};

export const AllRoutes = [
  {
    label: "Dashboard",
    link: "/",
    icon: IoStatsChartOutline,
    roles: [ROLES.ADMIN],
  },
  {
    label: "Categories",
    link: "/categories",
    icon: MdOutlineCategory,
    roles: [ROLES.ADMIN],
  },
  {
    label: "Banners",
    link: "/banners",
    icon: MdOutlineCategory,
    roles: [ROLES.ADMIN],
  },
  {
    label: "Templates",
    link: "/templates",
    icon: HiOutlineTemplate,
    roles: [ROLES.ADMIN],
  },

  {
    label: "Templates",
    link: "/templates/create",
    icon: HiOutlineTemplate,
    roles: [ROLES.ADMIN],
  },
  {
    label: "Templates",
    link: "/templates/[id]/edit",
    icon: HiOutlineTemplate,
    roles: [ROLES.ADMIN],
  },
  {
    label: "Templates",
    link: "/templates/[id]/view",
    icon: HiOutlineTemplate,
    roles: [ROLES.ADMIN],
  },
  {
    label: "Queries",
    link: "/queries",
    icon: HiOutlineTemplate,
    roles: [ROLES.ADMIN],
  },
  {
    label: "Queries",
    link: "/queries/[id]",
    icon: HiOutlineTemplate,
    roles: [ROLES.ADMIN],
  },
];

// export const AllRoutes = [
//   {
//     label: "Dashboard",
//     link: "/",
//     icon: IoStatsChartOutline,
//     roles: [ROLES.ADMIN],
//   },
//   {
//     label: "Products",
//     link: "/products",
//     icon: AiOutlineShop,
//     roles: [ROLES.ADMIN],
//   },
//   {
//     label: "Products",
//     link: "/products/create",
//     icon: AiOutlineShop,
//     roles: [ROLES.ADMIN],
//   },
//   {
//     label: "Products",
//     link: "/products/edit/[id]",
//     icon: AiOutlineShop,
//     roles: [ROLES.ADMIN],
//   },
//   {
//     label: "Categories",
//     link: "/categories",
//     icon: BiCategoryAlt,
//     roles: [ROLES.ADMIN],
//   },
//   {
//     label: "Attributes",
//     link: "/attributes",
//     icon: BiCategoryAlt,
//     roles: [ROLES.ADMIN],
//   },
//   {
//     label: "Attributes",
//     link: "/attributes/terms/create/[id]",
//     icon: BiCategoryAlt,
//     roles: [ROLES.ADMIN],
//   },
//   {
//     label: "Banners",
//     link: "/banners",
//     icon: BiCategoryAlt,
//     roles: [ROLES.ADMIN],
//   },
// ];
