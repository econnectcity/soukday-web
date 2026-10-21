import { useEffect, useState } from "react"
import { useLocalizedRouter } from "@/utils/localizedNav"
import { useSelector } from "react-redux";
import Loader from "@/components/loader/Loader";

const withAuth = (WrappedComponent) => {
    const Wrapper = (props) => {
        const router = useLocalizedRouter();
        const user = useSelector(state => state.User)
        const setting = useSelector(state => state.Setting?.setting);
        const [isAuthorized, setIsAuthorized] = useState(false);
        const [authChecked, setAuthChecked] = useState(false)

        useEffect(() => {
            if (!setting) {
                return;
            }
            const privateRoutes = ['/profile', '/checkout', '/profile/address', '/profile/activeorders', '/profile/orderhistory', '/profile/wishlist', '/profile/wallethistory', "/profile/transaction", '/profile/notifications', '/profile/subscription'];
            const isPrivateRoute = privateRoutes.includes(router.pathname);
            const isGuestCheckout =
                Number(setting?.guest_checkout) === 1 ||
                Number(setting?.guest_cart) === 1 ||
                setting?.guest_checkout === true ||
                setting?.guest_cart === true;

            if (router.pathname === '/checkout' && !user?.jwtToken) {
                if (isGuestCheckout) {
                    setIsAuthorized(true);
                } else {
                    router.push("/cart");
                }
            } else if (isPrivateRoute && !user?.jwtToken) {
                router.push("/");
            } else if (router.pathname === "/profile/subscription" && !user?.user?.is_subscription_plans) {
                router.push("/");
            } else {
                setIsAuthorized(true)
            }
            setAuthChecked(true)
        }, [user, router, setting])
        if (!authChecked) {
            return <Loader screen="full" />;
        }

        return isAuthorized ? <WrappedComponent {...props} /> : null;
    }
    return Wrapper;
}

export default withAuth;