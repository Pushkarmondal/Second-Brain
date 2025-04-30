import { Cross } from "../icons/Cross";
import { InputBox } from "./InputBox";

interface CreateContentModelProps {
      open: boolean;
      onClose: () => void;
}

export function CreateContentModel({ open, onClose }: CreateContentModelProps) {
      return (
            <div>
                  {open && (
                        <div className="fixed inset-0 flex items-center justify-center z-50">
                              <div className="relative bg-white rounded-lg shadow-lg w-[500px] p-6">
                                    <button
                                          onClick={onClose}
                                          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 cursor-pointer">
                                          <Cross />
                                    </button>
                                    <h2 className="text-lg font-semibold text-center mb-6">Create Content</h2>
                                    <div>
                                          <InputBox onClose={onClose} />
                                    </div>
                              </div>
                        </div>
                  )}
                  {open && <div className="fixed inset-0 bg-black opacity-50 z-40"></div>}
            </div>
      );
}
