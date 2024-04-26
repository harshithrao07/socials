import axios from 'axios'
import React, { useEffect } from 'react'

const Blog = () => {
  useEffect(() => {
    async function fetchPosts() {
      try {
        const response = await axios.get("http://127.0.0.1:8787/api/v1/post/bulk", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        });
        console.log(response);
      } catch (error) {
        console.error(error);
      }
    }

    fetchPosts()
  }, [])

  return (
    <div>Blog</div>
  )
}

export default Blog