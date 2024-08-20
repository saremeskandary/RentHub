"use client";

import { useState } from "react";
import { CalendarClock, HandHeart, MessageSquareText, Newspaper } from "lucide-react";
import ContentFeed from "~~/components/social/ContentFeed";
import Contribution from "~~/components/social/Contribution";
import Events from "~~/components/social/Events";
import Forum from "~~/components/social/Forum";
import styles from "~~/components/social/Social.module.scss";

export default function SocialFi() {
  const [tab, setTab] = useState("1");

  const items = [
    {
      id: 1,
      title: "Forum",
      icon: <MessageSquareText color="#9095a9" />,
      children: <Forum />,
    },
    {
      id: 2,
      title: "Contributions",
      icon: <HandHeart color="#9095a9" />,
      children: <Contribution />,
    },
    {
      id: 3,
      title: "Events",
      icon: <CalendarClock color="#9095a9" />,
      children: <Events />,
    },
    {
      id: 4,
      title: "Content Feed",
      icon: <Newspaper color="#9095a9" />,
      children: <ContentFeed />,
    },
  ];

  return (
    <section className={styles.social}>
      <div className="mx-auto max-w-[1200px] px-3">
        <div className={styles.social__body}>
          <div className={styles.social__column}>
            <div className={styles.social__tabs}>
              {items.map(obj => (
                <button
                  onClick={() => setTab(String(obj.id))}
                  type="button"
                  key={obj.id}
                  className={tab === `${obj.id}` ? styles.active : ""}
                >
                  {obj.icon}
                  <span>{obj.title}</span>
                </button>
              ))}
            </div>
          </div>

          <div className={styles.social__column}>
            {items.map(obj => (
              <div key={obj.id}>{tab === `${obj.id}` && obj.children}</div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
