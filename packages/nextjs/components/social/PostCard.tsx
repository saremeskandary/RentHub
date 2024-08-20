import { FC, useState } from "react";
import Popup from "./Popup";
import styles from "./Social.module.scss";
import { CircleUserRound, MessagesSquare, Redo2, ThumbsUp } from "lucide-react";
import { useMediaQuery } from "react-responsive";

const PostCard: FC<Record<string, string>> = ({ user, text, img }) => {
  const isMobile = useMediaQuery({ maxWidth: 479.98 });

  const [like, setLike] = useState<number>(0);
  const [comments, setComments] = useState(["Great post!", "Thanks for sharing!", "Interesting read!"]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  return (
    <div className={styles.post_card}>
      <Popup isOpen={isPopupOpen} setIsPopupOpen={setIsPopupOpen} comments={comments} setComments={setComments} />

      <div className={styles.post_card__user}>
        <CircleUserRound color="#4f4f4f" />
        <span>{user}</span>
      </div>

      {text && <p>{text}</p>}

      <div className={styles.post_card__image}>
        <img src={img} alt="..." />
      </div>

      <div className={styles.post_card__social}>
        <button onClick={() => setLike(like + 1)}>
          <ThumbsUp size={18} color="#4f4f4f" />
          <span>{like}</span>
        </button>

        <button onClick={() => setIsPopupOpen(true)}>
          <MessagesSquare size={18} color="#4f4f4f" />
          <span>
            {comments.length} {!isMobile && "comments"}
          </span>
        </button>

        <button>
          <Redo2 size={18} color="#4f4f4f" />
          <span>69 {!isMobile && "shares"}</span>
        </button>
      </div>
    </div>
  );
};

export default PostCard;
