import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getUserFromToken } from "../../utils/token";
import VideoCard from "../../components/VideoCard";
import Header from "../../components/Header";
import "./Courses.css";
import SearchBar from "../../components/SearchBar";

const Courses = ({ onLogout }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [videos, setVideos] = useState([]);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);

  const apiBaseUrl =
    "https://e-learning-platform-v1-bmdefngmcxdthqbn.westeurope-01.azurewebsites.net/api/Base";

  const fetchRecommendedVideos = async () => {
    try {
      const response = await fetch(`${apiBaseUrl}/getAllCourses`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const data = await response.json();
      setVideos(data);
    } catch (error) {
      console.error("Failed to fetch recommended videos:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const userData = getUserFromToken();
    setUser(userData);
    fetchRecommendedVideos();
  }, []);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredVideos = videos.filter((video) =>
    video.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const videosToDisplay = searchTerm ? filteredVideos : videos;

  const handleCardClick = (video) => {
    setSelectedVideo(video);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedVideo(null);
  };

  return (
    <div>
      <Header onLogout={onLogout} />
      <div className="content">
        {isLoading ? (
          <div className="loading-container">
            <p>Loading...</p>
          </div>
        ) : (
          <>
            <SearchBar searchTerm={searchTerm} onSearchChange={handleSearchChange} />
            <h1 className="headerText">
              Hi, {user?.firstName} <br />
              Here are recommendations
            </h1>
            <div className="cardContainer">
              {videosToDisplay.map((video) => (
                <div
                  key={video.id}
                  onClick={() => handleCardClick(video)}
                  style={{ cursor: "pointer" }}
                >
                  <VideoCard
                    title={video.name}
                    teacher={video.author.firstName + " " + video.author.lastName}
                  />
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {isModalOpen && selectedVideo && (
        <div className="modal-overlay" onClick={closeModal}>
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()} // Предотвращает закрытие при клике внутри модального окна
          >
            <button className="modal-close-button" onClick={closeModal}>
              &times;
            </button>
            <div className="video-player-container">
              <iframe
                width="100%"
                height="400"
                src={`https://www.youtube.com/embed/${selectedVideo.videoLink}`}
                title={selectedVideo.name}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
            <h2>{selectedVideo.name}</h2>
            <p>{selectedVideo.description}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Courses;
