import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"

export function RegisterForm({
  className,
  ...props
}: React.ComponentProps<"div">) {

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [username, setUsername] = useState("")
  const navigate = useNavigate()


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await axios.post("http://localhost:8080/auth/signup", {
        email,
        password,
        username
      })

      const status = response.status
      
      console.log(status)
      navigate("/login")
    } catch (err) {
        console.log(err)
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Rejestracja</CardTitle>
          <CardDescription>
            Wprowadź email, nazwę użytkownika i hasło, żeby założyć konto
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}> 
            <div className="flex flex-col gap-6">
              <div className="grid gap-3">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="grid gap-3">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                </div>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

            <div className="grid gap-3">
                <div className="flex items-center">
                  <Label htmlFor="password">Nazwa użytkownika</Label>
                </div>
                <Input
                  id="username"
                  type="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>


              <div className="flex flex-col gap-3">
                <Button type="submit" className="w-full">
                  Zarejestruj
                </Button>
                <Button variant="outline" onClick={()=> {navigate("/login")}}>Powrót</Button>
              </div>
            </div>
            
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
