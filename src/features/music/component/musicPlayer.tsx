"use client";
import React, { RefObject } from "react";
import { motion } from "framer-motion";
import { RiSpotifyFill } from "react-icons/ri";

interface MusicPlayerProps {
  constraintsRef: RefObject<HTMLDivElement | null>;
  // Ang ID na ito ay galing sa LifeAt LoFi playlist sa screenshot mo
  playlistId?: string; 
}

const MusicPlayer: React.FC<MusicPlayerProps> = ({ 
  constraintsRef, 
  playlistId = "0vvXsWCC9xrXsKd4FyS8kM" // LifeAt LoFi Playlist ID
}) => {
  
  // Eto ang tamang URL para lumabas yung playlist view na gaya ng nasa image
  const embedUrl = `https://open.spotify.com/embed/playlist/${playlistId}?utm_source=generator&theme=0`;

  return (
    <div className="fixed inset-0 pointer-events-none z-30">
      <motion.div
        drag
        dragConstraints={constraintsRef}
        dragMomentum={false}
        dragElastic={0.1}
        className="pointer-events-auto absolute p-2 rounded-3xl border border-white/20 bg-[#282828]/90 backdrop-blur-xl shadow-2xl w-100"
        style={{ top: "2%", left: "2%" }}
      >
        {/* Header Control */}
        <div className="flex justify-between items-center mb-2 px-3 pt-1">
          <div className="flex items-center gap-2 text-[#1DB954]">
            <RiSpotifyFill size={20} />
            <span className="text-[12px] font-bold text-white/80 uppercase tracking-wider">Media</span>
          </div>
          <div className="cursor-grab active:cursor-grabbing p-1">
            <div className="w-8 h-1 bg-white/20 rounded-full"></div>
          </div>
        </div>

        {/* Spotify Embed */}
        <div className="rounded-xl overflow-hidden shadow-lg bg-[#121212]">
          <iframe
            src={embedUrl}
            width="100%"
            height="152" // Standard height para lumabas yung listahan sa gilid
            frameBorder="0"
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"
            style={{ borderRadius: "12px" }}
          ></iframe>
        </div>

        <p className="text-[9px] text-center mt-2 text-white/40 italic">
          Tip: Log in to Spotify in browser to remove `Preview` mode
        </p>
      </motion.div>
    </div>
  );
};

export default MusicPlayer;