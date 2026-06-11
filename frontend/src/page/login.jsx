import axios from "axios";
import { useState } from "react";

function Login(){

const [email,setEmail]=useState("");
const [password,setPassword]=useState("");

const submit=async(e)=>{

e.preventDefault();

const res=await axios.post(
"http://localhost:5000/api/auth/login",
{
email,
password
}
);

localStorage.setItem(
"token",
res.data.token
);

alert("Login Success");

};

return(
<form onSubmit={submit}>

<input
placeholder="Email"
onChange={(e)=>
setEmail(e.target.value)
}
/>

<input
type="password"
placeholder="Password"
onChange={(e)=>
setPassword(e.target.value)
}
/>

<button>
Login
</button>

</form>
);
}

export default Login;