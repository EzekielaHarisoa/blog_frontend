import axios from "axios";

const BASE_URL = "http://localhost:3000/api/users";

// GET PROFILE
export async function getProfile(token) {
  const res = await axios.get(`${BASE_URL}/profile`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
}
// GET PROFILE other User
export async function getProfileUser(userId, token){
  const res = await axios.get(`${BASE_URL}/profile/${userId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
  
  );
console.log("URL =", `${BASE_URL}/profile/${userId}`);
  return res.data;
} 

// EDIT PROFILE
export async function editProfile(data, token) {
  const res = await axios.put(`${BASE_URL}/profile`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
}

// UPLOAD AVATAR
export async function uploadAvatar(formData, token) {
  const res = await axios.post(`${BASE_URL}/avatar`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
}