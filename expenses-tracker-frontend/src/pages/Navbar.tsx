import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { DialogAddSubscription } from "./DialogAddSubscribtion";
import type React from "react";
import type { SetStateAction } from "react";
import type { Subscription } from "./SubscribtionList";


type NavbarProps = {
    setSubscriptions: React.Dispatch<React.SetStateAction<Subscription[]>>
}

export default function Navbar({setSubscriptions}: NavbarProps){

    const navigate = useNavigate()
    function handleLogout(){
        localStorage.removeItem('token')
        navigate('/login')
    }
    return(
        <div className="w-full bg-gray-100 p-4 shadow-md flex justify-between items-center">
        <div className="flex flex-row gap-x-4">
            <Link to={"/"}>
            <Button variant="outline">Strona główna</Button>
            </Link>
            <DialogAddSubscription setSubscriptions={setSubscriptions}/>

        </div>
        <Button onClick={handleLogout}>Wyloguj</Button>
        </div>
    )
}