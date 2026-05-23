import axios from "axios";

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
  const token = getToken();

  const response = await fetch(
    `${BASE_URL}?page=${page}&limit=${limit}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    throw new Error("Erreur API getPosts");
  }

  return response.json();
}

//get posts by user
export async function getPostByUser(userId) {
  if (!userId) throw new Error("userId is required");

  const token = getToken();
  if (!token) throw new Error("No token found");

    const res = await axios.get(
      `${BASE_URL}/userPost/${userId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log("API response =", res.data);

    return res.data;
}

//create post
export async function createPost(data) {
  const token = getToken();

  if (!token) {
    throw new Error("No token found");
  }

  const formData = new FormData();
  formData.append("title", data.title);
  formData.append("content", data.content);

  if (data.image) {
    formData.append("image", data.image);
  }

  const res = await axios.post(`${BASE_URL}`, formData, {
    headers: {
      Authorization: `Bearer ${token}`
    },
  });

  return res.data;
}
//delet post
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

//edition posts
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

  
//seach post
export async function searchPost(query){
  const response = await fetch(`${BASE_URL}/search?query=${query}`);
  if (!response.ok) {
    throw new Error("Erreur API");
  }
  return response.json();

}
