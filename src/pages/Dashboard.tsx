import { useEffect, useState } from "react"
import { Button } from "../components/Button"
import { Card } from "../components/Card"
import { CreateContentModel } from "../components/CreateContentModel"
import { Add } from "../icons/Add"
import { Share } from "../icons/Share"
import { Sidebar } from "../components/Sidebar"
import { GetContent } from "../hooks/GetContent"
import axios from "axios"
import { SHARE_URL } from "./BackendUrl"

interface Content  {
      title: string;
      link: string;
      type: string;
};

export function Dashboard() {
      const [modelOpen, setModelOpen] = useState(false);
      const [searchQuery, setSearchQuery] = useState('');
      const [debouncequery, setDebounceQuery] = useState('');
      const { contents, handleContentChange } = GetContent();

      useEffect(() => {
            const handler = setTimeout(() => {
                  setDebounceQuery(searchQuery);
            }, 700)
            return () => {
                  clearTimeout(handler);
            }
      }, [searchQuery])

      const filteredContents = contents.filter(({ title }) => {
            try {
                  const regex = new RegExp(debouncequery, "i");
                  return regex.test(title);
            } catch (err) {
                  return title.toLowerCase().includes(debouncequery.toLowerCase());
            }
      });

      useEffect(() => {
            handleContentChange();
      }, [modelOpen])

      return (
            <div>
                  <Sidebar />
                  <div className="p-4 ml-15 min-h-screen bg-slate-100">
                        <CreateContentModel open={modelOpen} onClose={() => {
                              setModelOpen(false);
                        }} />
                        <div className="flex justify-end mr-10 mt-4 justify-center items-center gap-x-4">
                              <div className="font-normal text-4xl text-indigo-400 mr-188 hover:text-slate-600">
                                    <p>All Notes -&gt;</p>
                              </div>
                              <Button onClick={() => { setModelOpen(true) }} variant="primary" text="Add Content" startIcon={Add()} />
                              {/* <Button onClick={async() => {
                                    const response = await axios.post(SHARE_URL, {
                                          Share: true
                                    }, {
                                          headers: {
                                                Authorization: `${localStorage.getItem('token')}`
                                          }
                                    });
                                    console.log("Share response:", response.data); // 🔍 Inspect this
                                    const shareUrl = `http://localhost:5173/share/${response.data.hash}`;
                                    console.log("Share URL created:", shareUrl);

                              }} variant="secondary" text="Share" startIcon={Share()} /> */}

                              <Button
                                    onClick={async () => {
                                          try {
                                                const response = await axios.post(SHARE_URL, {
                                                      share: true, // Ensure you're sending 'share: true' here
                                                }, {
                                                      headers: {
                                                            Authorization: `${localStorage.getItem("token")}`,
                                                      },
                                                });

                                                const hash = response?.data?.link?.hash;
                                                if (!hash) {
                                                      throw new Error("No hash returned from backend");
                                                }

                                                const shareUrl = `http://localhost:5173/share/${hash}`;
                                                alert(`Share URL created: ${shareUrl}`);
                                                console.log("Share URL created:", shareUrl);
                                          } catch (err) {
                                                console.error("Error sharing link:", err);
                                          }
                                    }}
                                    variant="secondary"
                                    text="Share"
                                    startIcon={Share()}
                              />

                        </div>
                        <div className=" flex p-4 max-w-md mx-auto gap-1 items-end">
                              <input type="text" placeholder="Search..." className="w-full px-3 py-2 border rounded-md shadow-lg shadow-slate-500/50"
                                    onChange={(e) => setSearchQuery(e.target.value)}
                              />
                              <button onClick={() => {
                                    // optional: you could add more logic here later
                                    console.log("Search executed with query:", searchQuery);
                              }} className=" h-10 w-20 cursor-pointer bg-indigo-400 font-normal text-white rounded-md items-center px-3 border shadow-xl">Enter</button>
                        </div>
                        
                        <div className="flex mt-10 ml-35 max-h-150 overflow-y-auto flex-wrap grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
                              {filteredContents.length === 0 ? (
                                          <p className="text-gray-500">No results found</p>) : (
                              filteredContents.map(({type, link, title}, index) => (
                                    <Card key={`${link}-${index}`} title={title} link={link} contentType={type} />
                              ))
                              )}
                        </div>

                  </div>
            </div>

      )
}
