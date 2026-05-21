import axios from "axios";

const BASE_URL = "http://localhost:3000/api/suivi";

function getToken() {
  const token = localStorage.getItem("token");
  return token;
}

export async function followUserApi(userId) {
  try {
    const token = getToken();
    const response = await axios.post(
      `${BASE_URL}/follow/${userId}`,
      {}, 
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;

  } catch (error) {
    console.error("Follow error:", error);
    throw error;
  }
}

export async function unfollowUserApi(userId) {
    try {
        const token = getToken();
        const response = await axios.delete(
            `${BASE_URL}/unfollow/${userId}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        )
        return response.data;
    } catch (error) {
        console.error("Unfollow error:", error);
        throw error;
    }
}