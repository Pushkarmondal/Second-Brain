import axios from "axios";
import { useEffect, useState } from "react";

export function GetContent() {
      const [contents, setContent] = useState([]);
      function handleContentChange() {
            axios.get(`http://localhost:3009/api/v1/getcontent`, {
                  headers: {
                        Authorization: `${localStorage.getItem('token')}`
                  }
            }).then((response) => {
                  setContent(response.data.content);
            }).catch((err) => {
                  console.error('Failed to fetch content:', err);
            });
      }
      useEffect(() => {
            handleContentChange();
            const interval = setInterval(() => { 
                  handleContentChange()
            }, 10 * 1000)
            return () => clearInterval(interval);
      }, [])
      return { contents, handleContentChange };
}
