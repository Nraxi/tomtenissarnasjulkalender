import React, { useState } from "react";
import { motion } from "framer-motion";
import "./index.css";

import bgImage from "./Image/Bg1.png";

// --- Bildimport ---
const importDoorImages = () => {
  const images = {};
  for (let i = 1; i <= 24; i++) {
    try {
      images[i] = new URL(
        `./christmas_calendar_images/day${i}.png`,
        import.meta.url
      ).href;
    } catch (e) {
      images[i] = null;
    }
  }
  return images;
};

const importElfImages = () => {
  const images = {};
  for (let i = 1; i <= 24; i++) {
    try {
      images[i] = new URL(
        `./christmas_calendar_images/elf${i}.png`,
        import.meta.url
      ).href;
    } catch (e) {
      images[i] = null;
    }
  }
  return images;
};

const doorImages = importDoorImages();
const elfImages = importElfImages();

// --- Kollar om dagen är upplåst ---
function isDayUnlocked(day) {
  const now = new Date();
  return now.getMonth() === 11 && now.getDate() >= day;
}
// function isDayUnlocked(day) {
//   return true; // ALLA luckor upplåsta
// }
// --- Elf Actions ---
const elfActions = [
  "En Tomtenisse som jonglerar med polkagrisar!",
  "Två Tomtenissar som har snöbollskrig!",
  "En Tomtenisse som åker skridskor!",
  "En Tomtenisse som rider på en liten ren!",
  "En Tomtenisse som bakar exploderande pepparkakor!",
  "Flera Tomtenissar som bygger en kaotisk snöborg!",
  "En Tomtenisse som åker skidor nerför en godis berg!",
  "En Tomtenisse som svingar sig i glitterrep!",
  "En Tomtenisse som har fastnat i en presentkartong!",
  "En Tomtenisse som jagar borttappade julgranskulor!",
  "En Tomtenisse som skjuter marshmallows med en slangbella!",
  "Flera Tomtenissar som har disco !",
  "En Tomtenisse som halkar på julpapper!",
  "En Tomtenisse som jonglerar med tomtebloss!",
  "En Tomtenisse som fångar julstjärnar med ett lasso!",
  "En Tomtenisse som jonglerar med julklapparna i tomtens verkstad!",
  "En Tomtenisse som hoppar bungeejump från en julgran!",
  "En Tomtenisse som leker med en godis tornado!",
  "En Tomtenisse som åker Snowboard!",
  "En Tomtenisse som brottas med en gigantisk pepparkaka!",
  "En Tomtenisse som surfar på en våg av julgodis!",
  "En Tomtenisse som fastnat i raketer av läsk!",
  "En Tomtenisse som råkade ta tomtens släde för en åktur!",
  "En Tomtenisse som blir påkommen av Rudolf när han försöker stjäla julklapparna ifrån tomten!",
];

// --- Snöanimation ---
function Snow() {
  const snowflakes = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    animationDuration: Math.random() * 3 + 2,
    opacity: Math.random() * 0.6 + 0.4,
    size: Math.random() * 4 + 2,
  }));

  return (
    <div className="snow-container">
      {snowflakes.map((flake) => (
        <div
          key={flake.id}
          className="snowflake"
          style={{
            left: `${flake.left}%`,
            animationDuration: `${flake.animationDuration}s`,
            opacity: flake.opacity,
            width: `${flake.size}px`,
            height: `${flake.size}px`,
          }}
        />
      ))}
    </div>
  );
}

export default function ChristmasCalendar() {
  const [openDoors, setOpenDoors] = useState([]);
  const [activeGifts, setActiveGifts] = useState([]);
  const [openDoorModal, setOpenDoorModal] = useState(null);

  const handleDoorClick = (day, unlocked) => {
    if (!unlocked) return;

    if (openDoors.includes(day)) {
      // Stäng dörren
      setActiveGifts(activeGifts.filter((d) => d !== day));
      setOpenDoors(openDoors.filter((d) => d !== day));
      return;
    }

    // Öppna dörren
    setOpenDoors([...openDoors, day]);
    setTimeout(() => {
      setActiveGifts([...activeGifts, day]);
    }, 700);
  };

  const handleModalClose = () => setOpenDoorModal(null);

  return (
    <div
      className="calendar-container"
      style={{
        backgroundImage: `linear-gradient(rgba(0,0,0,0.35), rgba(0,0,0,0.35)), url(${bgImage})`,
        backgroundSize: "cover",
        minHeight: "100vh",
      }}
    >
      <Snow />

      <h1 className="calendar-title">Tomtenissarnas Julkalendern</h1>

      <div className="calendar-grid">
        {Array.from({ length: 24 }, (_, i) => {
          const day = i + 1;
          const unlocked = isDayUnlocked(day);
          const doorIsOpening = openDoors.includes(day);
          const showGift = activeGifts.includes(day);

          return (
            <div className="door-wrapper" key={day}>
              {/* Dörrens perspektiv och ram */}
              <span
                onClick={() => handleDoorClick(day, unlocked)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleDoorClick(day, unlocked);
                }}
                className={`door ${unlocked ? "unlocked" : "locked"} ${
                  doorIsOpening ? "opening" : ""
                }`}
                role="button"
                tabIndex={unlocked ? 0 : -1}
              >
                {/* Dörrbladet med bakgrund + trästruktur */}
                <div
                  className="door-frame"
                  style={{
                    "--door-bg": doorImages[day]
                      ? `url(${doorImages[day]})`
                      : "none",
                  }}
                >
                  {/* Gul insida som följer dörrbladet */}
                  {doorIsOpening && <div className="door-inside" />}
                  <div className="door-number">{day}</div>
                  <div className="door-knob"></div>
                </div>
              </span>

              {/* Presenten */}
              {showGift && (
                <div
                  className="gift-icon visible"
                  onClick={() => setOpenDoorModal(day)}
                  tabIndex={0}
                >
                  🎁
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Modal */}
      {openDoorModal && (
        <div className="modal-overlay" onClick={handleModalClose}>
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="modal"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="modal-title">Dag {openDoorModal}</h2>

            {elfImages[openDoorModal] && (
              <img
                src={elfImages[openDoorModal]}
                alt={`Elf day ${openDoorModal}`}
                className="modal-elf"
              />
            )}

            <p className="modal-text">
              {elfActions[openDoorModal - 1] || "En mystisk överraskning!"} ✨
            </p>

            <button className="modal-close" onClick={handleModalClose}>
              Stäng
            </button>
          </motion.div>
        </div>
      )}
    </div>
  );
}
