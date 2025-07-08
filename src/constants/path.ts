export const paths = {
    DASHBOARD: "/",
    SLIDER:{
        LIST:"/slider",
        CREATE:"/slider/create",
        EDIT:(id=":id")=>`/slider/${id}`
    },
    PARTNERS: {
        LIST: "/partners",
        CREATE: "/partners/create",
        EDIT:(id=":id")=>`/partner/${id}`
    },
    CATEGORY: {
        LIST: "/category",
        CREATE: "/category/create",
        EDIT: (id = ":id") => `/category/${id}`,
    },
    GROUP_TOUR: {
        LIST: "/group-tour",
        CREATE: "/group-tour/create",
        EDIT: (id = ":id") => `/group-tour/${id}`,
        DETAIL:(id = ":id")=> `/group-tour/detail/${id}`
    },
    PRIVATE_TOUR: {
        LIST: "/private-tour",
        CREATE: "/private-tour/create",
        EDIT: (id = ":id") => `/private-tour/${id}`,
        DETAIL:(id = ":id")=> `/private-tour/detail/${id}`
    },
    PRIVATE_PACKAGE:{
        LIST:"/private-package",
        CREATE:"/private-package/create",
        EDIT:(id=":id")=>`/private-package/${id}`
    },
    PACKAGE_TOUR_PACKAGE: {
        LIST: "/package-tour-package",
        CREATE: "/package-tour-package/create",
        EDIT:(id=":id")=>`/package-tour-package/${id}`
    },
    PACKAGE_TOUR_OPTION:{
        LIST:"/package-tour-option",
        CREATE:"/package-tour-option/create",
        EDIT:(id=":id")=>`/package-tour-option/${id}`,
        DETAIL:(id=":id")=>`/package-tour-option/detail/${id}`
    },
    PACKAGE_DAILY_PROGRAM:{
        LIST:"/package-daily-program",
        CREATE:"/package-daily-program/create",
        EDIT:(id=":id")=>`/package-daily-program/${id}`
    },
    DESTINATION: {
        LIST: "/destination",
        CREATE: "/destination/create",
        EDIT: (id = ":id") => `/destination/${id}`,
        DETAIL: (id = ":id") => `/destination/detail/${id}`,
    },
    USER: {
        LIST: "/user",
        CREATE: "/user/create",
        EDIT: (id = ":id") => `/user/${id}`,
    },
    SETTING: {
        CONTACT: {
            LIST: "/contact",
            CREATE: "/contact/create",
            EDIT: (id = ":id") => `/contact/${id}`,
            DETAIL:(id=":id")=>`/contact/detail/${id}`
        },
        SOCIAL: {
            LIST: "/social",
            CREATE: "/social/create",
            EDIT: (id = ":id") => `/social/${id}`,
        },
    },
    GUIDE:{
        LIST:"/guide",
        CREATE:"/guide/create",
        EDIT:(id=":id")=>`/guide/${id}`
    },
    AUTH:{
        LOGIN:"/login"
    }
};

import {
    Home,
    Package,
    Percent,
    Building2,
    Users2,
    Newspaper,
    Compass,
    Map,
    Layers3,
    Folder,
    Settings,
    Puzzle,
    MapPin,
    User,
    Contact,
    Share2,
    Calendar,
    UserCircle,
    Sliders
} from "lucide-react";

export const navItems = [
    { label: "Dashboard", icon: Home, path: paths.DASHBOARD },
    { label: "Slider", icon:Sliders, path: paths.SLIDER.LIST},
    { label: "Orders", icon: Package, path: "/orders" },
    { label: "Promos", icon: Percent, path: "/promos" },
    { label: "Partners", icon: Building2, path: paths.PARTNERS.LIST },
    { label: "Team Members", icon: Users2, path: "/team-members" },
    { label: "Blogs", icon: Newspaper, path: "/blogs" },
    { label: "Guide", icon: User,path:paths.GUIDE.LIST},
    {
        label: "Tours",
        icon: Compass,
        children: [
            {
                label: "Group Tours",
                icon: Map,
                path: paths.GROUP_TOUR.LIST,
            },
            {
                label: "Private Tours",
                icon: Folder,
                children:[
                    {
                        label:"Packages",
                        icon:Package,
                        path:paths.PRIVATE_PACKAGE.LIST
                    },
                    {
                        label:"Tours",
                        icon:Compass,
                        path:paths.PRIVATE_TOUR.LIST
                    }
                ]
            },
            {
                label: "Package Tours",
                icon: Layers3,
                children: [
                    {
                        label: "Packages",
                        icon: Package,
                        path: paths.PACKAGE_TOUR_PACKAGE.LIST,
                    },
                    {
                        label: "Tours",
                        icon: Compass,
                        path: paths.PACKAGE_TOUR_OPTION.LIST,
                    },
                    {
                        label: "Daily Program",
                        icon: Calendar ,
                        path: paths.PACKAGE_DAILY_PROGRAM.LIST,
                    },
                ],
            },
        ],
    },
    { label: "Destinations", icon: MapPin, path: paths.DESTINATION.LIST },
    { label: "Categories", icon: Puzzle, path: paths.CATEGORY.LIST },
    {
        label: "Settings",
        icon: Settings,
        children: [
            {
                label: "Contact",
                icon: Contact,
                path: paths.SETTING.CONTACT.LIST,
            },
            {
                label: "Social Medias",
                icon: Share2,
                path: paths.SETTING.SOCIAL.LIST,
            },
        ],
    },
    { label: "User", icon: UserCircle, path: paths.USER.LIST },
];
