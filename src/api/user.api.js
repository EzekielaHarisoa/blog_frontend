import axios from "axios";
const BASE_URL = "http://localhost:3000/api/users";
//get profile
export async function getProfile(token){
    const res = await axios.get(
        `${BASE_URL}/profile`,{
            headers:{
                Authorization: `Bearer ${token}`,

            }
        }
    )
    return res.data;
}

//edit profile
export async function editProfile(data,token){
    const res = await axios.put(
        `${BASE_URL}/profile`,data,{
            headers:{
                Authorization: `Bearer ${token}`,
            }
        }   
    )
    return res.data;
}

//upload avatar 
export async function uploadAvatar(formData, token) {
  const res = await axios.post(`${BASE_URL}/avatar`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });

  return res.data;
}