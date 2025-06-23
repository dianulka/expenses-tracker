
import axios from "axios"
import { Button } from "@/components/ui/button";
import React, { useState, useEffect } from "react";
import { ChartPieLabel } from "@/components/pie-chart";
import { DialogAddSubscription } from "./DialogAddSubscribtion";
import { ChartLineLabel } from "@/components/chart-line";
import Navbar from "./Navbar";

export interface Subscription {
    id: number;
    name: string;
    price: number;
    category: string;
    startDate: string;
    endDate: string | null;
    active: boolean;
}

import DialogCancelSubscribtion from "./DialogCancelSubscribtion";

type SubscribtionListProps = {
    subscriptions: Subscription[],
    setSubscriptions: React.Dispatch<React.SetStateAction<Subscription[]>>

}

export default function SubscribtionList({subscriptions, setSubscriptions} : SubscribtionListProps){

    
    useEffect(() => {
        axios.get("http://localhost:8080/api/subscriptions/me", {
            headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            }
        })
        .then(res => setSubscriptions(res.data))
        .catch(err => console.error(err));
        }, []);


    function updateSubscribtion(updatedSub: Subscription){
        setSubscriptions(prev =>
            prev.map(sub => (sub.id === updatedSub.id ? updatedSub: sub))
        );
    }

    function handleDelete(id: number){

        try {
            axios.delete(`http://localhost:8080/api/subscriptions/${id}`, {
                headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            }
            })
            .then(() => {
                setSubscriptions(prev => prev.filter(sub => sub.id !== id));
            })
            
        } catch (error) {
            console.log(error);
        }

    }

 

    return(
        <>
        
        <h2 className="text-2xl font-semibold mb-4">Twoje subskrypcje</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
            {subscriptions.map(sub => 
            <div key={sub.id} className="w-full p-6 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-100">
                 <div className="space-y-2 flex flex-col">
                <h3 className="text-lg font-semibold">{sub.name}</h3>
                <p className="text-sm text-gray-600">Kategoria: {sub.category}</p>
                <p className="text-sm text-gray-600">Cena: {sub.price} zł</p>
                <p className="text-sm text-gray-600">
                Status: {sub.active ? "Aktywna" : "Nieaktywna"}
                </p>
                <p className="text-sm text-gray-600">
                Od: {new Date(sub.startDate).toLocaleDateString("pl-PL")}{" "}
                {sub.endDate && `do ${new Date(sub.endDate).toLocaleDateString("pl-PL")}`}
                </p>

                <Button variant="destructive" className="max-w-sm mx-auto" onClick={() =>handleDelete(sub.id)}>Usuń subskrypcję</Button>
                {sub.active && <DialogCancelSubscribtion id={sub.id} onUpdate={updateSubscribtion}/>}
                </div>
            
            </div>)}

        </div>

        {subscriptions.length>0 && <ChartPieLabel/>}
        {subscriptions.length>0 && <ChartLineLabel/>}
        </>
    )
}