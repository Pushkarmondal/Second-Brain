import { useState } from "react";
import { CardProps } from "./Card";
import axios from "axios";
import { ADD_CONTENT_URL } from "../pages/AddContent";
import { CreateContentModel } from "./CreateContentModel";

type InputBoxProps = {
      onClose: () => void;
}

export function InputBox({onClose}: InputBoxProps) {
      const [title, setTitle] = useState("");
      const [link, setLink] = useState("");
      const [type, setType] = useState<CardProps['contentType']>('youtube');

      const handleSubmit = async () => {
            try {
                  const response = await axios.post(ADD_CONTENT_URL, {
                        title,
                        link,
                        type
                  }, {
                        headers: {
                              Authorization: `${localStorage.getItem('token')}`
                        }
                  })
                  onClose();
                  // console.log('Content added successfully:', response.data);
            } catch (error) {
                  console.error('Error adding content:', error);
            }
      };

      return (
            <div className="p-4 border border-gray-300 rounded-md max-w-md mx-auto">
                  <div className="mb-4">
                        <label className="block mb-1 text-sm font-medium text-gray-700">Title</label>
                        <input
                              type="text"
                              value={title}
                              onChange={(e) => setTitle(e.target.value)}
                              placeholder="Enter title..."
                              className="w-full px-3 py-2 border rounded-md"
                        />
                  </div>
                  <div className="mb-4">
                        <label className="block mb-1 text-sm font-medium text-gray-700">Paste Link</label>
                        <input
                              type="text"
                              value={link}
                              onChange={(e) => setLink(e.target.value)}
                              placeholder="Enter Link (e.g., youtube, twitter, article)"
                              className="w-full px-3 py-2 border rounded-md"
                        />
                  </div>
                  <div className="mb-4">
                        <label className="block mb-1 text-sm font-medium text-gray-700">Content Type</label>
                        <select
                              value={type}
                              onChange={(e) => setType(e.target.value as CardProps['contentType'])}
                              className="w-full px-3 py-2 border rounded-md"
                        >
                              <option value="youtube">YouTube</option>
                              <option value="twitter">Twitter</option>
                              <option value="article">Article</option>
                        </select>
                  </div>

                  <button
                        onClick={handleSubmit}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                        Submit
                  </button>
            </div>
      );
}
