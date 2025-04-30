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

export function Dashboard() {
      const [modelOpen, setModelOpen] = useState(false);
      const { contents, handleContentChange } = GetContent();

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
                        <div className="flex justify-end mr-20 mt-4 justify-center items-center gap-x-4">
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
                        <div className="flex mt-10 ml-35 max-h-150 overflow-y-auto flex-wrap grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                              {contents.map(({ type, link, title }) => <Card key={link} title={title} link={link} contentType={type} />)}
                              {/* <Card title="CICD Tweet" link="https://x.com/pushkarmondal79/status/1871167395731226726" contentType="twitter" />
                              <Card title="Youtube Videos" link="https://www.youtube.com/watch?v=vsWxs1tuwDk" contentType="youtube" />
                              <Card title="Article" link="https://docs.gitlab.com/ci/" contentType="article" /> */}
                        </div>
                  </div>
            </div>

      )
}
