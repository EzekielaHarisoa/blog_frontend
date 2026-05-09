const BASE_URL = "http://localhost:3000/api/auth";
export async function login(data){
    const response = await fetch(`${BASE_URL}/login`,{
        method:"POST",
        headers:{
            "Content-Type":"application/json"

        },
        body: JSON.stringify(data)
    })
    console.log("status =", response.status);

    const result = await response.json();
    console.log("result =", result);

    if(!response.ok){
        throw new Error("login erreuer");
    }
    return result;
}

export async function register(data){
    const response = await fetch(`${BASE_URL}/register`,{
        method : "POST",
        headers:{
            "Content-Type":"application/json"
        },
        body: JSON.stringify(data)
    })
    console.log("status :" + result.status)
    
    const result = await response.json()

    console.log("result :", result)

    if(!response.ok){
        throw new Error("Inscription error");
    }
    return result;
}