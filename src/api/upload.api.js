import axios from "axios";

export async function updateAvatar(file, token) {
    const formData = new FormData();
    formData.append("avatar", file);

    const res = await axios.put(
        "http://localhost:3000/api/users/avatar",
        formData,
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );

    return res.data;
}