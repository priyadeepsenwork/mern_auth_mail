import { useState } from "react"
import Input from "./Input"
import {User} from 'lucide-react'

interface formData {
    name: string,
    email: string,
    password: string,
}

const SignupPage = () => {
    const [name, setName] = useState('')

    const handleSignUp = (e: FormData) => {
        e.preventDefault()
    }  
    return (
    <section>
        <div>
            <h2>Create an Account</h2>
        </div>
        <form onSubmit={handleSignUp}>
            <Input 
            icon={User}
            type="text"
            placeholder='Full name'
            value=''
            onChange={(e:String) => setName(e.target.value)}
            />
        </form>
    </section>
  )
}

export default SignupPage