import { useState } from "react";
import {
      Brain,
      Twitter,
      Youtube,
      FileText,
      Link,
      Hash,
      ChevronsLeft,
      ChevronsRight,
} from "lucide-react";

export function Sidebar() {
      const [collapsed, setCollapsed] = useState(false);

      return (
            <div
                  className={`h-screen w-30 bg-white shadow-xl/30 fixed left-0 top-0 z-10 p-4 transition-all duration-300 ${collapsed ? "w-20" : "w-60"
                        }`}
            >
                  {/* Collapse Button */}
                  <button
                        onClick={() => setCollapsed(!collapsed)}
                        className="absolute -right-4 top-4 cursor-pointer bg-white border shadow p-1 rounded-full hover:bg-gray-100"
                        title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
                  >
                        {collapsed ? <ChevronsRight size={20} /> : <ChevronsLeft size={20} />}
                  </button>

                  {/* Logo section */}
                  <div
                        className={`flex items-center mb-8 transition-all duration-300 ${collapsed ? "justify-center" : "gap-2"
                              }`}
                  >
                        <Brain className="text-indigo-500" size={40} />
                        <span
                              className={`font-semibold text-2xl whitespace-nowrap overflow-hidden transition-all duration-300 ${collapsed ? "opacity-0 w-0" : "opacity-100 w-auto ml-2"
                                    }`}
                        >
                              Second Brain
                        </span>
                  </div>
                  
                  {/* Navigation items */}
                  <ul className={`space-y-6 text-xl text-gray-700`}>
                        {[
                              { icon: Twitter, label: "Tweets" },
                              { icon: Youtube, label: "Videos" },
                              { icon: FileText, label: "Documents" },
                              { icon: Link, label: "Links" },
                              { icon: Hash, label: "Tags" },
                        ].map(({ icon: Icon, label }, idx) => (
                              <li
                                    key={idx}
                                    className={`flex items-center transition-all duration-300 hover:text-indigo-500 cursor-pointer ${collapsed ? "justify-center" : "gap-3"
                                          }`}
                              >
                                    <Icon size={28} />
                                    <span
                                          className={`whitespace-nowrap overflow-hidden transition-all duration-300 origin-left ${collapsed ? "opacity-0 w-0" : "opacity-100 w-auto"
                                                }`}
                                    >
                                          {label}
                                    </span>
                              </li>
                        ))}
                        </ul>
                  </div>
      );
}
