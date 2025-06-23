"use client"

import { Key, TrendingUp } from "lucide-react"
import { Pie, PieChart } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

export const description = "A pie chart with a label"

import { useEffect, useState } from "react"
import axios from "axios"

type SummaryByCategoryResponse = Record<string, number>;

type ChartDataPoint = {
  name: string;
  value: number;
  fill: string;
};



const chartConfig = {
  visitors: {
    label: "Visitors",
  },
  chrome: {
    label: "Chrome",
    color: "var(--chart-1)",
  },
  safari: {
    label: "Safari",
    color: "var(--chart-2)",
  },
  firefox: {
    label: "Firefox",
    color: "var(--chart-3)",
  },
  edge: {
    label: "Edge",
    color: "var(--chart-4)",
  },
  other: {
    label: "Other",
    color: "var(--chart-5)",
  },
} satisfies ChartConfig




export function ChartPieLabel() {

    const [data, setData] = useState<ChartDataPoint[]>([]);
    const [total, setTotal] = useState<number|null>(null);

    useEffect(()=>{
        axios.get<SummaryByCategoryResponse>("http://localhost:8080/api/subscriptions/me/summary-by-category", {
            headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            }
        })
        .then( res => {
            const colors = ["#00BFFF", "#FF7F50", "#FFD700", "#32CD32"];
            const formattedData:ChartDataPoint[] = Object.entries(res.data).map(([name,value], index)=>({
                name,
                value,
                fill: colors[index % colors.length],
            }))

            setData(formattedData);

        })

    },[])

    useEffect(()=> {
        axios.get("http://localhost:8080/api/subscriptions/me/total", {
            headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            }
        })
        .then( res => setTotal(res.data.total))
        
    }, [])

    
    
    return (
    <Card className="flex flex-col">
        <CardHeader className="items-center pb-0">
         <CardTitle>Podział wydatków na kategorie</CardTitle>
        {/*<CardDescription>January - June 2024</CardDescription> */}
        </CardHeader>
        <CardContent className="flex-1 pb-0">
        <ChartContainer
            config={chartConfig}
            className="[&_.recharts-pie-label-text]:fill-foreground mx-auto aspect-square max-h-[250px] pb-0"
        >
            <PieChart>
            <ChartTooltip content={<ChartTooltipContent hideLabel />} />
            <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                label
                />
            </PieChart>
        </ChartContainer>
        </CardContent>
        <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 leading-none font-medium">
            Wykres z podziałem wydatków na kategorie na bieżący miesiąc
        </div>
        <div className="text-muted-foreground leading-none">
            Łącznie: {total}
        </div>
        </CardFooter>
    </Card>
    )
}
