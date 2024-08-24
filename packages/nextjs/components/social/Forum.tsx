import { FC, useEffect, useRef, useState } from "react";
import PostCard from "./PostCard";
import styles from "./Social.module.scss";
import { ChevronDown, Search } from "lucide-react";

const sort = ["Photography", "Outdoors"];

const forum = [
  { user: "Oleg", img: "/social/f3.png", text: "A common question when getting started is, “What size paddle board do I need?” The most important thing is getting the right size board. Many people have a poor experience because they jump on a board way too small or way too advance for them. The best beginner stand up paddle board to start learning is called an All Arounder. Its the best paddle board for a beginner because All Arounders are design to go anywhere and have a lot of extra stability. The minimum length of the board is reflected a lot on your weight. This also applies to Inflatable Paddle Boards.  Interested in learning more about inflatables? Check out my blog, “6 Crucial Things You Need to Know Before Buying an Inflatable SUP.”" },
  {
    user: "Nina",
    img: "/social/f4.png",
    text: "The Ultimate Guide to Sail Types and Rigs - What is that sail for? Generally, I dont know. So I have come up with a system. I will explain you everything there is to know about sails and rigs in this article. What are the different types of sails? Most sailboats have one mainsail and one headsail. Typically, the mainsail is a fore-and-aft bermuda rig (triangular shaped). A jib or genoa is used for the headsail. Most sailors use additional sails for different conditions: the spinnaker (a common downwind sail), gennaker, code zero (for upwind use), and stormsail.Each sail has its own use. Want to go downwind fast? Use a spinnaker. But you cant just raise any sail and go for it. Its important to understand when (and how) to use each sail. Your rigging also impacts what sails you can use.",
  },
  { user: "Alice", img: "/social/f1.png", text: "Lawn Mower Blade Wont Engage (Here How to Fix This) There is nothing more frustrating than heading out on a Sunday morning to mow your lawn only to find out that your lawn mower blades wont engage. No matter how many times you pull the lever or flip the switch, your John Deere, Cub Cadet, or whatever brand you have refuses to engage its blades. Well, depending on your mowers design, there could be several reasons why your mower deck wont engage. So lets dig into these reasons and figure out what is messing with your Sunday morning." },

  { user: "Michale", img: "/social/f2.png", text: "To stand up on your paddle board, start from a kneeling position on your board and then:Move one foot at a time: Put your hands on the sides of the board to stabilize it and move one foot at a time to place your feet where your knees are. Weight your hands: When moving from kneeling to standing, put the majority of your weight onto your hands so you'll feel more stable as you move your feet.Raise your chest and stand: With your feet on the board, rather than standing up in one motion, start by raising your chest up while keeping your knees bent. Once your chest is vertical, extend your legs to stand up.Practice on land: It can be helpful to practice standing up on land to get used to the movements without the instability of water. To do so, take the fin off your board and lay the board down on a soft surface, such as grass or sand. Lie down or kneel on the board and go through the motion of standing up"},
  // { user: "Oleg", img: "/social/f3.png", text: "A common question when getting started is, “What size paddle board do I need?” The most important thing is getting the right size board. Many people have a poor experience because they jump on a board way too small or way too advance for them. The best beginner stand up paddle board to start learning is called an All Arounder. Its the best paddle board for a beginner because All Arounders are design to go anywhere and have a lot of extra stability. The minimum length of the board is reflected a lot on your weight. This also applies to Inflatable Paddle Boards.  Interested in learning more about inflatables? Check out my blog, “6 Crucial Things You Need to Know Before Buying an Inflatable SUP.”" },
  // {
  //   user: "Nina",
  //   img: "/social/f4.png",
  //   text: "The Ultimate Guide to Sail Types and Rigs - What is that sail for? Generally, I dont know. So I have come up with a system. I will explain you everything there is to know about sails and rigs in this article. What are the different types of sails? Most sailboats have one mainsail and one headsail. Typically, the mainsail is a fore-and-aft bermuda rig (triangular shaped). A jib or genoa is used for the headsail. Most sailors use additional sails for different conditions: the spinnaker (a common downwind sail), gennaker, code zero (for upwind use), and stormsail.Each sail has its own use. Want to go downwind fast? Use a spinnaker. But you cant just raise any sail and go for it. Its important to understand when (and how) to use each sail. Your rigging also impacts what sails you can use.",
  // },
];

const Forum: FC = () => {
  const sortRef = useRef<HTMLDivElement>(null);
  const [listVisible, setListVisible] = useState<boolean>(false);
  const [sortType, setSortType] = useState<string>(sort[0]);

  useEffect(() => {
    const closeSort = (e: MouseEvent) => {
      if (sortRef.current && !e.composedPath().includes(sortRef.current)) setListVisible(false);
    };
    document.body.addEventListener("click", closeSort);
    return () => document.body.removeEventListener("click", closeSort);
  }, []);

  return (
    <div className={styles.tab_forum}>
      <div className={styles.tab_forum__filter}>
        <div className={styles.tab_forum__search}>
          <Search size={20} color="#9095a9" />
          <input
            type="text"
            className="block w-full appearance-none bg-white text-sm outline-none"
            placeholder="Search"
          />
        </div>

        <div ref={sortRef} className={styles.tab_forum__sort}>
          <label onClick={() => setListVisible(!listVisible)}>
            <div>
              <span>Sort by: </span>
              <span>{sortType}</span>
            </div>
            <ChevronDown size={20} color="#9095a9" className={listVisible ? `${styles.active}` : ""} />
          </label>
          {listVisible && (
            <ul>
              {sort.map(item => (
                <li
                  className={sortType === item ? `${styles.active}` : ""}
                  onClick={() => {
                    setSortType(item);
                    setListVisible(false);
                  }}
                  key={item}
                >
                  {item}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className={styles.tab_forum__posts}>
        {forum.map(obj => (
          <PostCard key={obj.img} {...obj} />
        ))}
      </div>
    </div>
  );
};

export default Forum;
