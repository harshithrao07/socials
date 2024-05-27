import axios from "axios";

export function formatDate(dateString) {
  const date = new Date(dateString);
  const formatter = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  return formatter.format(date);
}

export async function followOrUnfollow(toFollow) {
  try {
    const response = await axios.put(
      `http://localhost:8787/api/v1/auth/profile/${toFollow}/follow`,
      {},
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token_socials")}`,
        },
      }
    );
  } catch (error) {
    console.error("Error following/unfollowing user:", error);
  }
}
