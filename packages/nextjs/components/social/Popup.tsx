import { FC, useEffect, useState } from "react";
import { CircleUserRound, SendHorizontal } from "lucide-react";

const Popup: FC<{
  isOpen: boolean;
  comments: string[];
  setIsPopupOpen: (i: boolean) => void;
  setComments: (arr: string[]) => void;
}> = ({ isOpen, setIsPopupOpen, comments, setComments }) => {
  const [comment, setComment] = useState("");

  const handleSubmit = (event: any) => {
    event.preventDefault();
    if (comment.trim()) {
      setComments([...comments, comment.trim()]);
      setComment("");
    }
  };

  useEffect(() => {
    if (isOpen) document.body.classList.add("lock");
    else document.body.classList.remove("lock");
  }, [isOpen]);

  return (
    <div
      className={`fixed inset-0 z-[999] flex items-center justify-center bg-black bg-opacity-50 px-3 transition-opacity ${isOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"}`}
    >
      <div className="relative w-full max-w-[500px] rounded-lg bg-white p-6">
        <button
          className="absolute right-2 top-2 text-2xl text-gray-500 hover:text-gray-700"
          onClick={() => setIsPopupOpen(false)}
        >
          ×
        </button>
        <h2 className="mb-4 text-xl font-semibold">{comments.length} comments</h2>

        <div className="scrollbar-none mb-4 max-h-60 overflow-y-auto">
          {comments.length > 0 ? (
            <ul className="space-y-2">
              {comments.map((c, index) => (
                <li key={index} className="border-b border-gray-200 p-2">
                  <div className="flex items-center gap-3">
                    <CircleUserRound color="#4f4f4f" />
                    <span className="font-semibold">Alex</span>
                  </div>
                  {c}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No comments yet.</p>
          )}
        </div>

        <form onSubmit={handleSubmit} className="flex items-center gap-5">
          <textarea
            className="block w-full resize-none appearance-none rounded border bg-white p-3 text-sm outline-none"
            value={comment}
            rows={1}
            onChange={e => setComment(e.target.value)}
            placeholder="Write your comment here..."
          />
          <button
            type="submit"
            className="flex items-center gap-1 rounded-md bg-gray-400 px-4 py-2 text-white transition-colors hover:bg-gray-300"
          >
            <span className="md4:hidden">Send</span>
            <SendHorizontal color="#fff" size={18} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default Popup;
