import { useState } from "react"
import axios from "axios"

export default function Login() {
    const [identifier, setIdentifier] = useState("")

    const sendOtp = async () => {
        try {
            await axios.post("http://localhost:5000/auth/request-otp", {
                identifier
            })
            localStorage.setItem("identifier", identifier)
            window.location.href = "/verify"
        } catch (err) {
            alert(err.response.data.error)
        }
    }

    return (
        <div>
            <h2>Login</h2>
            <input
                placeholder="Email or Phone"
                onChange={(e) => setIdentifier(e.target.value)}
            />
            <br /><br />
            <button onClick={sendOtp}>Send OTP</button>
        </div>
    )
}
