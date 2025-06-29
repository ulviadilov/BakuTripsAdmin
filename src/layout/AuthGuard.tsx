import { Navigate } from "react-router";
import { paths } from "../constants/path";

export default function AuthGuard({children}:{children:React.ReactNode}){
    const token = localStorage.getItem('token');
    console.log(token)
    if(!token){
        return <Navigate to={paths.AUTH.LOGIN}></Navigate>
    }

    return <>{children}</>

}
