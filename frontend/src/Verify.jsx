import { useState } from "react"
import axios from "axios"

export default function Verify() {
    const [otp, setOtp] = useState("")
    const identifier = localStorage.getItem("identifier")

    const verifyOtp = async () => {
        try {
            const res = await axios.post("http://localhost:5000/auth/verify-otp", {
                identifier,
                otp
            })

            localStorage.setItem("token", res.data.token)
            window.location.href = "/welcome"
        } catch (err) {
            alert(err.response.data.error)
        }
    }

    return (
        <div>
            <h2>Enter OTP</h2>
            <input
                placeholder="6 digit OTP"
                onChange={(e) => setOtp(e.target.value)}
            />
            <br /><br />
            <button onClick={verifyOtp}>Verify</button>
        </div>
    )
}
