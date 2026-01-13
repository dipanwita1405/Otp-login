import { useEffect, useState } from "react"
import axios from "axios"

export default function Welcome() {
    const [user, setUser] = useState("")

    useEffect(() => {
        axios.get("http://localhost:5000/auth/me", {
            headers: {
                Authorization: "Bearer " + localStorage.getItem("token")
            }
        })
            .then(res => setUser(res.data.identifier))
            .catch(() => {
                localStorage.removeItem("token")
                window.location.href = "/"
            })
    }, [])

    return (
        <div>
            <h2>Welcome</h2>
            <p>{user}</p>
            <button onClick={() => {
                localStorage.clear()
                window.location.href = "/"
            }}>Logout</button>
        </div>
    )
}
