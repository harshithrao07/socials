import axios from "axios";

export function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
}

export function formatDate(dateString) {
  const date = new Date(dateString);
  const formatter = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  return formatter.format(date);
}

export async function fetchQuote() {
  const options = {
    method: "GET",
    url: "https://api.api-ninjas.com/v1/quotes",
    params: { language: "en" },
    headers: {
      "X-Api-Key": process.env.rapidAPIKey,
    },
  };

  try {
    const response = await axios.request(options);
    const newQuote = response.data[0];
    return newQuote;
  } catch (error) {
    console.error(error);
  }
}

export async function signUpUser(signupBody) {
  const response = await axios.post(
    "http://localhost:8787/api/v1/user/signup",
    signupBody
  );
  return response;
}

export async function signInUser(signinBody) {
  const response = await axios.post(
    "http://localhost:8787/api/v1/user/signin",
    signinBody
  );
  return response;
}

export async function fetchAllBlogs(active) {
  const response = await axios.get(
    `http://127.0.0.1:8787/api/v1/posts?page=${active}`
  );
  return response;
}

export async function getBlog(id) {
  const response = await axios.get(`http://localhost:8787/api/v1/posts/${id}`);
  return response;
}

export async function savePost(toSave, savedBy) {
  const response = await axios.put(
    "http://localhost:8787/api/v1/auth/post",
    {
      id: toSave,
      savedBy: savedBy,
    },
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token_socials")}`,
      },
    }
  );
  return response;
}

export async function followOrUnfollow(toFollow) {
  try {
    const response = await axios.put(
      `http://localhost:8787/api/v1/auth/user/${toFollow}`,
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
