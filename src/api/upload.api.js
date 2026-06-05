import axios from "axios";

export async function updateAvatar(file, token) {
    const formData = new FormData();
    formData.append("avatar", file);

    const res = await axios.put(
"https://api-blog-q81q.onrender.com/api/users/avatar",        formData,
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );

    return res.data;
}