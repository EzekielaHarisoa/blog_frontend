const BASE_URL = "http://localhost:3000/api/auth";
export async function login(data){
    const response = await fetch(`${BASE_URL}/login`,{
        method:"POST",
        headers:{
            "content-Type":"application/json"

        },
        body: JSON.stringify(data)
    })
    if(!response.ok){
        throw new Error("login erreuer");
    }
    return response.json();
}
