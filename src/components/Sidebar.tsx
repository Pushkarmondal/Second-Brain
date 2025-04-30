import { Brain, Twitter, Youtube, FileText, Link, Hash } from "lucide-react";

export function Sidebar() {
      return (
            <div className="h-screen bg-white border-r w-60 fixed left-0 top-0 z-10 p-4">
                  {/* Logo section */}
                  <div className="flex items-center gap-2 mb-8">
                        <Brain className="text-indigo-500" size={50}/>
                        <span className="font-semibold text-2xl">Second Brain</span>
                  </div>

                  {/* Navigation items */}
                  <ul className="space-y-4 text-xl text-gray-700">
                        <li className="flex items-center gap-2 hover:text-indigo-500 cursor-pointer">
                              <Twitter size={40} />
                              <span>Tweets</span>
                        </li>
                        <li className="flex items-center gap-3 hover:text-indigo-500 cursor-pointer">
                              <Youtube size={40} />
                              <span>Videos</span>
                        </li>
                        <li className="flex items-center gap-3 hover:text-indigo-500 cursor-pointer">
                              <FileText size={40} />
                              <span>Documents</span>
                        </li>
                        <li className="flex items-center gap-3 hover:text-indigo-500 cursor-pointer">
                              <Link size={40} />
                              <span>Links</span>
                        </li>
                        <li className="flex items-center gap-3 hover:text-indigo-500 cursor-pointer">
                              <Hash size={40} />
                              <span>Tags</span>
                        </li>
                  </ul>
            </div>
      );
}
