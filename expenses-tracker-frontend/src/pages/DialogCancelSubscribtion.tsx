import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DialogClose } from "@radix-ui/react-dialog"


import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import axios, { type Cancel } from "axios"
import type { Subscription } from "./SubscribtionList"

const formSchema = z.object({
  endDate: z.string(),
})

type CancelDialogProps = {
    id:number
    onUpdate: (updatedSub: Subscription)=> void;
}

export default function DialogCancelSubscribtion({id, onUpdate}: CancelDialogProps){

    const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
        endDate: "",
    },
    })


    async function onSubmit(values:any){
        // await axios.put("http://localhost:8080/api/subscriptions/me")
        console.log(values);
        console.log(id);

        await axios.put(
          `http://localhost:8080/api/subscriptions/${id}/cancel`,
          { endDate: values.endDate },
          {
            headers: {
              "Authorization": `Bearer ${localStorage.getItem("token")}`,
              "Content-Type": "application/json",
            },
          }
        )
        .then(res => {
            console.log(res)
            onUpdate(res.data)
        })
        .catch(err => console.error(err));

        
    }

     return (
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" className="max-w-sm mx-auto">Anuluj subskrypcję</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Anuluj subskrypcję</DialogTitle>
              <DialogDescription>Wpisz datę zakończenia subskrypcji</DialogDescription>
            </DialogHeader>
    
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        
                <FormField
                  control={form.control}
                  name="endDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Data anulowania subskrybcji</FormLabel>
                      <FormControl><Input type="date" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />    
                <DialogFooter className="pt-4">
                  <DialogClose asChild>
                    <Button type="button" variant="outline">Anuluj</Button>
                  </DialogClose>
                  <Button type="submit">Zapisz</Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      )
}