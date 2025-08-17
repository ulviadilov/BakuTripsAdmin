import { createBrowserRouter } from "react-router";
import MainLayout from "../layout/MainLayout";
import { paths } from "../constants/path";
import Dashboard from "../pages/Dashboard";
import PartnersList from "../pages/Partners/Partners";
import AddPartner from "../pages/Partners/AddPartner";
import CategoryList from "../pages/Category/CategoryList";
import CategoryCreate from "../pages/Category/CategoryCreate";
import CategoryEdit from "../pages/Category/CategoryEdit";

import GroupTour from "../pages/GroupTour/TourList";
import GroupTourEdit from "../pages/GroupTour/TourEdit";
import GroupTourCreate from "../pages/GroupTour/TourCreate";
import GroupTourDetail from "../pages/GroupTour/TourDetail";

import PrivateTour from "../pages/PrivateTour/TourList";
import PrivateTourEdit from "../pages/PrivateTour/TourEdit";
import PrivateTourCreate from "../pages/PrivateTour/TourCreate";
import PrivateTourDetail from "../pages/PrivateTour/TourDetail";

import PrivatePackageCreate from "../pages/PrivateTour/Package/PrivatePackageCreate";
import PrivatePackageList from "../pages/PrivateTour/Package/PrivatePackageList";

import PackageTour from "../pages/PackageTour/TourList";
import DestinationList from "../pages/Destination/DestinationList";
import DestinationCreate from "../pages/Destination/DestinationCreate";
import PackageTourCreate from "../pages/PackageTour/TourCreate";
import UserList from "../pages/User/UserList";
import ContactList from "../pages/Settings/Contact/ContactList";
import ContactCreate from "../pages/Settings/Contact/ContactCreate";
import ContactEdit from "../pages/Settings/Contact/ContactEdit";
import DestinationEdit from "../pages/Destination/DestinationEdit";
import TourOptionCreate from "../pages/PackageTour/TourOption/TourOptionCreate";
import TourOptionList from "../pages/PackageTour/TourOption/TourOptionList";
import PackageTourEdit from "../pages/PackageTour/TourEdit";
import ContactDetail from "../pages/Settings/Contact/ContactDetail";
import DestinationDetail from "../pages/Destination/DestinationDetail";
import PrivatePackageEdit from "../pages/PrivateTour/Package/PrivatePackageEdit";
import TourOptionEdit from "../pages/PackageTour/TourOption/TourOptionEdit";
import TourOptionDetail from "../pages/PackageTour/TourOption/TourOptionDetail";
import DailyProgramList from "../pages/PackageTour/DailyProgram/DailyProgramList";
import DailyProgramCreate from "../pages/PackageTour/DailyProgram/DailyProgramCreate";
import DailyProgramEdit from "../pages/PackageTour/DailyProgram/DailyProgramEdit";
import LoginPage from "../pages/Login/Login";
import AuthGuard from "../layout/AuthGuard";
import EditPartner from "../pages/Partners/EditPartner";
import GuideList from "../pages/Guide/GuideList";
import GuideCreate from "../pages/Guide/GuideCreate";
import GuideEdit from "../pages/Guide/GuideEdit";
import SliderCreate from "../pages/Slider/SliderCreate";
import SliderList from "../pages/Slider/SliderList";
import SliderUpdate from "../pages/Slider/SliderUpdate";
import MemberList from "../pages/TeamMembers/MemberList";
import MemberCreate from "../pages/TeamMembers/MemberCreate";
import MemberUpdate from "../pages/TeamMembers/MemberUpdate";
import PromoCodeList from "../pages/PromoCode/PromoCodeList";
import PromoCodeCreate from "../pages/PromoCode/PromoCodeCreate";
import PromoCodeUpdate from "../pages/PromoCode/PromoCodeUpdate";

export const router = createBrowserRouter([
    {
        path: "/",
        element: (
            <AuthGuard>
                <MainLayout />
            </AuthGuard>
        ),
        children: [
            {
                index: true,
                path: paths.DASHBOARD,
                element: <Dashboard />,
            },
            {
                path: paths.SLIDER.LIST,
                element: <SliderList />,
            },
            {
                path: paths.SLIDER.EDIT(),
                element: <SliderUpdate />,
            },
            {
                path: paths.SLIDER.CREATE,
                element: <SliderCreate />,
            },
            {
                path: paths.PARTNERS.LIST,
                element: <PartnersList />,
            },
            {
                path: paths.PARTNERS.CREATE,
                element: <AddPartner />,
            },
            {
                path: paths.PARTNERS.EDIT(),
                element: <EditPartner />,
            },
            {
                path: paths.CATEGORY.LIST,
                element: <CategoryList />,
            },
            {
                path: paths.CATEGORY.CREATE,
                element: <CategoryCreate />,
            },
            {
                path: paths.CATEGORY.EDIT(),
                element: <CategoryEdit />,
            },
            {
                path: paths.MEMBER.LIST,
                element: <MemberList />,
            },
            {
                path: paths.MEMBER.CREATE,
                element: <MemberCreate />,
            },
            {
                path: paths.MEMBER.EDIT(),
                element: <MemberUpdate />,
            },
            {
                path: paths.GUIDE.LIST,
                element: <GuideList />,
            },
            {
                path: paths.GUIDE.CREATE,
                element: <GuideCreate />,
            },
            {
                path: paths.GUIDE.EDIT(),
                element: <GuideEdit />,
            },
            {
                path: paths.GROUP_TOUR.LIST,
                element: <GroupTour />,
            },
            {
                path: paths.GROUP_TOUR.CREATE,
                element: <GroupTourCreate />,
            },
            {
                path: paths.GROUP_TOUR.EDIT(),
                element: <GroupTourEdit />,
            },
            {
                path: paths.GROUP_TOUR.DETAIL(),
                element: <GroupTourDetail />,
            },
            {
                path: paths.PACKAGE_TOUR_PACKAGE.LIST,
                element: <PackageTour />,
            },
            {
                path: paths.PACKAGE_TOUR_PACKAGE.CREATE,
                element: <PackageTourCreate />,
            },
            {
                path: paths.PACKAGE_TOUR_PACKAGE.EDIT(),
                element: <PackageTourEdit />,
            },
            {
                path: paths.PACKAGE_TOUR_OPTION.LIST,
                element: <TourOptionList />,
            },
            {
                path: paths.PACKAGE_TOUR_OPTION.DETAIL(),
                element: <TourOptionDetail />,
            },
            {
                path: paths.PACKAGE_TOUR_OPTION.CREATE,
                element: <TourOptionCreate />,
            },
            {
                path: paths.PACKAGE_TOUR_OPTION.EDIT(),
                element: <TourOptionEdit />,
            },
            {
                path: paths.PACKAGE_DAILY_PROGRAM.LIST,
                element: <DailyProgramList />,
            },
            {
                path: paths.PACKAGE_DAILY_PROGRAM.CREATE,
                element: <DailyProgramCreate />,
            },
            {
                path: paths.PACKAGE_DAILY_PROGRAM.EDIT(),
                element: <DailyProgramEdit />,
            },
            {
                path: paths.PRIVATE_TOUR.LIST,
                element: <PrivateTour />,
            },
            {
                path: paths.PRIVATE_TOUR.CREATE,
                element: <PrivateTourCreate />,
            },
            {
                path: paths.PRIVATE_TOUR.EDIT(),
                element: <PrivateTourEdit />,
            },
            {
                path: paths.PRIVATE_TOUR.DETAIL(),
                element: <PrivateTourDetail />,
            },
            {
                path: paths.PRIVATE_PACKAGE.LIST,
                element: <PrivatePackageList />,
            },
            {
                path: paths.PRIVATE_PACKAGE.CREATE,
                element: <PrivatePackageCreate />,
            },
            {
                path: paths.PRIVATE_PACKAGE.EDIT(),
                element: <PrivatePackageEdit />,
            },
            {
                path: paths.DESTINATION.LIST,
                element: <DestinationList />,
            },
            {
                path: paths.DESTINATION.DETAIL(),
                element: <DestinationDetail />,
            },
            {
                path: paths.DESTINATION.CREATE,
                element: <DestinationCreate />,
            },
            {
                path: paths.DESTINATION.EDIT(),
                element: <DestinationEdit />,
            },
            {
                path: paths.USER.LIST,
                element: <UserList />,
            },
            {
                path: paths.SETTING.CONTACT.LIST,
                element: <ContactList />,
            },
            {
                path: paths.SETTING.CONTACT.DETAIL(),
                element: <ContactDetail />,
            },
            {
                path: paths.SETTING.CONTACT.CREATE,
                element: <ContactCreate />,
            },
            {
                path: paths.SETTING.CONTACT.EDIT(),
                element: <ContactEdit />,
            },
            {
                path: paths.PROMO_CODES.LIST,
                element: <PromoCodeList />,
            },
            {
                path: paths.PROMO_CODES.CREATE,
                element: <PromoCodeCreate />,
            },
            {
                path: paths.PROMO_CODES.EDIT(),
                element: <PromoCodeUpdate />,
            },
        ],
    },
    {
        path: paths.AUTH.LOGIN,
        element: <LoginPage />,
    },
    {
        path: "*",
        element: (
            <AuthGuard>
                <MainLayout />
            </AuthGuard>
        ),
    },
]);
