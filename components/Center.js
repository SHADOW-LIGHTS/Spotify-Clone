import { ChevronDownIcon } from "@heroicons/react/outline";
import { signOut, useSession } from "next-auth/react";
import { shuffle } from "lodash";
import { useEffect, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { playlistIdState, playlistState } from "../atoms/playlistAtom";
import useSpotify from "../hooks/useSpotify";
import Songs from "./Songs";

const colors = [
  "from-yellow-700",
  "from-indigo-700",
  "from-blue-700",
  "from-green-700",
  "from-purple-700",
  "from-pink-700",
  "from-red-700",
];

function Center() {
  const { data: session } = useSession();
  const spotifyApi = useSpotify();
  const [color, setColor] = useState(null);
  const playlistId = useRecoilValue(playlistIdState);
  const [playlist, setPlaylist] = useRecoilState(playlistState);

  useEffect(() => {
    setColor(shuffle(colors).pop());
  }, [playlistId]);

  useEffect(() => {
    spotifyApi
      .getPlaylist(playlistId)
      .then((data) => {
        setPlaylist(data.body);
      })
      .catch((err) => console.log("Something went wrong!", err));
  }, [spotifyApi, playlistId]);

  //console.log(playlist);

  return (
    <div className="flex-grow h-screen overflow-y-scroll overflow-x-hidden scrollbar-hide select-none relative ">
      <header className=" absolute top-5 right-8">
        <div
          className="flex items-center bg-black space-x-3 bg-opacity-80 hover:bg-zinc-800
          cursor-pointer rounded-full p-1 pr-2"
          onClick={signOut}
        >
          <img
            className="rounded-full w-10 h-10"
            src={session?.user.image}
            alt="user image"
          />

          <h2 className="text-white font-bold">{session?.user.name}</h2>
          <ChevronDownIcon className="text-white h-5 w-6" />
        </div>
      </header>

      <section
        className={`flex items-end space-x-7 bg-gradient-to-b to-black ${color} h-80
        text-white p-8`}
      >
        <img
          className="h-44 w-44 shadow-2xl"
          src={playlist?.images?.[0]?.url}
          alt="image"
        />
        <div className="shrink-0">
          <p>PLAYLIST</p>
          <h1 className="text-4xl md:text-6xl lg:text-8xl font-bold shrink-0 ">
            {playlist?.name}
          </h1>
        </div>
      </section>

      <div>
        <Songs />
      </div>
    </div>
  );
}

export default Center;
