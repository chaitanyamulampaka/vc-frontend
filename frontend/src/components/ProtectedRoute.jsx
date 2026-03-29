import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";
function ProtectedRoute({ children, allowedRoles }) {
    const { user, loading } = useAuth();

    if (loading) return <div>Loading...</div>;

    if (!user) return <Navigate to="/login" />;

    if (allowedRoles) {
        const isAdmin = user.is_staff;

        if (
            !allowedRoles.includes(user.role) &&
            !(allowedRoles.includes("admin") && isAdmin)
        ) {
            return <Navigate to="/login" />;
        }
    }

    return children;
}
export default ProtectedRoute;