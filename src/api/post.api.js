const BASE_URL = "http://localhost:3000/api/posts";

export  function getToken(){
    const token = localStorage.getItem("token");
    if(!token){
        throw new Error("No token found");
    }
    return token;
}

//get post
export async function getPosts(page = 1, limit = 5) {
  
  const response = await fetch(
    `${BASE_URL}?page=${page}&limit=${limit}`
  );

  if (!response.ok) {
    throw new Error("Erreur API");
  }

  return response.json();
}

//create post
export async function createPost(data){
  const token= getToken();
  if(!token){
    throw new Error("No token found");
  }
  const response = await fetch(`${BASE_URL}`,{
    method:"POST",
    headers:{
      "Content-Type":"application/json",
      Authorization :`Bearer ${token}`
    },
    body : JSON.stringify(data)
    
  });

  if(!response.ok){
    throw new Error("Erreur API");
  }

  const result = await response.json();
  return result;

}

export async function deletePost(id) {
  const token = getToken();

  const response = await fetch(`${BASE_URL}/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  console.log("status =", response.status);

  if (!response.ok) {
    throw new Error("Erreur API");
  }

  const result = await response.json();
  return result;
}

//edition de posts
export async function editPost(id, data) {
  const token = getToken();
  const response = await fetch(`${BASE_URL}/${id}`, {
    method:"PUT",
    headers:{
      "Content-Type":"application/json",
      Authorization :`Bearer ${token}`
    },
    body : JSON.stringify(data)   
    })

  console.log("status =", response.status);
  if(!response.ok){
    throw new Error("Erreur API");
  }
  const result = await response.json();
  return result
}

  
//chercher un post
export async function searchPost(query){
  const response = await fetch(`${BASE_URL}/search?query=${query}`);
  if (!response.ok) {
    throw new Error("Erreur API");
  }
  return response.json();
}