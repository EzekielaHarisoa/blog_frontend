import axios from "axios";

export function updateAvatar(file, token){
    const formData = new FormData();
    formData.append("avatar",file)

    const res = axios.put("http://localhost:3000/api/uploads/profil/avatar",formData, {
        headers:{
            Authorization: `Bearer ${token}`,
            "Content-Type":"multipart/form-data"
        }
    })
    return res.data;
}