import { FC } from "react";
import PostCard from "./PostCard";
import styles from "./Social.module.scss";

const users = [
  { id: 1, username: "William" },
  { id: 2, username: "Ashley" },
  { id: 3, username: "James" },
  { id: 4, username: "John" },
];

const events = [
  {
    user: "Admin",
    img: "/social/05.png",
    text: "Join the Bitcoin Olympics Hackathon Hosted by Bitcoin Startup Lab: Unleash Innovation and Shape the Future of Bitcoin. Build, Learn, and Win !",
  },
];

const Events: FC = () => {
  return (
    <div className={styles.tab_events}>
      <div className={styles.tab_events__table}>
        <table>
          <thead>
            <tr>
              <th>№</th>
              <th>Username</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.username}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className={styles.tab_forum__posts}>
        {events.map(obj => (
          <PostCard key={obj.img} {...obj} />
        ))}
      </div>
    </div>
  );
};

export default Events;
