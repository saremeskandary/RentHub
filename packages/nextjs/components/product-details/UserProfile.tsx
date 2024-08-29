import { FC } from "react";
import { CircleUserRound } from "lucide-react";

interface IUserProfile {
  isPopupOpen: boolean;
  rating: number;
  comments: { user: string; message: string }[];
  setIsPopupOpen: (i: boolean) => void;
  setRating: (i: number) => void;
}

const UserProfile: FC<IUserProfile> = ({ comments, setIsPopupOpen, isPopupOpen, rating, setRating }) => {
  return (
    <div
      className={`fixed inset-0 z-[999] flex items-center justify-center bg-black bg-opacity-50 px-3 transition-opacity ${isPopupOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"}`}
    >
      <div className="relative w-full max-w-[500px] rounded-lg bg-white p-6">
        <button
          className="absolute right-2 top-0 bg-none text-2xl text-gray-500 hover:text-gray-700"
          onClick={() => setIsPopupOpen(false)}
        >
          ×
        </button>

        <div className="mb-5 flex items-center gap-7">
          <div className="flex items-center gap-2">
            <CircleUserRound size={30} color="#4f4f4f" />
            <span className="text-xl font-semibold">Alex Ford</span>
          </div>
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <span
                onClick={() => setRating(i)}
                key={i}
                className={`mr-[2px] cursor-pointer text-xl text-[#ffc107] ${i > rating ? "text-gray-300" : ""}`}
              >
                ★
              </span>
            ))}
            <p className="ml-1">({comments.length})</p>
          </div>
        </div>

        <div>
          <h2 className="mb-4 font-semibold">{comments.length} comments</h2>
          <div className="scrollbar-none mb-4 max-h-60 overflow-y-auto">
            {comments.length > 0 ? (
              <ul className="space-y-2">
                {comments.map((c, index) => (
                  <li key={index} className="border-b border-gray-200 p-2">
                    <div className="flex items-center gap-3">
                      <CircleUserRound color="#4f4f4f" />
                      <span className="font-semibold">{c.user}</span>
                    </div>
                    {c.message}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">No comments yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
