import axios from "axios";
import { useState } from "react";

function Signup(){

const [form,setForm]=useState({
name:"",
email:"",
password:""
});

const submit=async(e)=>{
e.preventDefault();

await axios.post(
"http://localhost:5000/api/auth/register",
form
);

alert("Registration Success");
};

return(
<form onSubmit={submit}>
<input
placeholder="Name"
onChange={(e)=>
setForm({...form,name:e.target.value})
}
/>

<input
placeholder="Email"
onChange={(e)=>
setForm({...form,email:e.target.value})
}
/>

<input
type="password"
placeholder="Password"
onChange={(e)=>
setForm({...form,password:e.target.value})
}
/>

<button>
Signup
</button>

</form>
);
}

export default Signup;