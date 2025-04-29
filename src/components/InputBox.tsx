import { useState } from "react";

export function InputBox() {
      const [title, setTitle] = useState("");
      const [link, setLink] = useState("");

      const handleSubmit = () => {
            alert(`Title: ${title}\nType: ${type}`);
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
                  <button
                        onClick={handleSubmit}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                        Submit
                  </button>
            </div>
      );
}
