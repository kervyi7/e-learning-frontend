import React, { useState, useEffect } from "react";
import Header from "../../components/Header";
import { getUserFromToken } from "../../utils/token";
import "./Course.css";

const AddCourse = ({ onLogout }) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    level: "",
    videoLink: "",
    image: "",
    tags: [],
  });

  const [tags, setTags] = useState([]);
  const [userId, setUserId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [tokenData, setTokenData] = useState(getUserFromToken());

  const apiBaseUrl =
    "https://e-learning-platform-v1-bmdefngmcxdthqbn.westeurope-01.azurewebsites.net/api/Teacher";

  // Загружаем список тегов с сервера
  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await fetch(`${apiBaseUrl}/getTags`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }

        const data = await response.json();
        setTags(data);
      } catch (error) {
        console.error("Failed to fetch tags:", error);
        setErrorMessage("Failed to load tags. Please refresh the page.");
      }
    };

    fetchTags();
  }, []);

  // Получаем userId по username
  useEffect(() => {
    const fetchUserId = async () => {
      if (!tokenData.username) return;

      try {
        const response = await fetch(
          `${apiBaseUrl}/getIdByUsername/${tokenData.username}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }

        const id = await response.json();
        setUserId(id);
      } catch (error) {
        console.error("Failed to fetch user ID:", error);
        setErrorMessage("Failed to retrieve user ID. Please refresh the page.");
      }
    };

    fetchUserId();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleTagChange = (tagId) => {
    setFormData((prevState) => {
      const tags = prevState.tags.includes(tagId)
        ? prevState.tags.filter((id) => id !== tagId)
        : [...prevState.tags, tagId];
      return { ...prevState, tags };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userId) {
      setErrorMessage("User ID is not available. Please try again later.");
      return;
    }

    setIsSubmitting(true);
    setSuccessMessage("");
    setErrorMessage("");

    const courseData = {
      author: {id: userId}, 
      name: formData.name,
      description: formData.description,
      level: formData.level,
      videoLink: formData.videoLink,
      image: formData.image,
      tags: formData.tags.map((tagId) => ({ id: tagId })), // Преобразуем массив ID в объекты
    };

    try {
      const response = await fetch(`${apiBaseUrl}/createCourse`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(courseData),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      setSuccessMessage("Course added successfully!");
      setFormData({
        name: "",
        description: "",
        level: "",
        videoLink: "",
        image: "",
        tags: [],
      });
    } catch (error) {
      setErrorMessage("Failed to add course. Please try again.");
      console.error("Error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <Header onLogout={onLogout} />
      <div className="add-course-container">
        <h1>Add a New Course</h1>
        <form onSubmit={handleSubmit} className="add-course-form">
          <div className="form-group">
            <label htmlFor="name">Course Name:</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="description">Description:</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
            ></textarea>
          </div>
          <div className="form-group">
            <label htmlFor="level">Level:</label>
            <select
              id="level"
              name="level"
              value={formData.level}
              onChange={handleInputChange}
              required
            >
              <option value="">Select level</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="videoLink">Video Link (YouTube):</label>
            <input
              type="text"
              id="videoLink"
              name="videoLink"
              value={formData.videoLink}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="image">Image (Base64 or URL):</label>
            <input
              type="text"
              id="image"
              name="image"
              value={formData.image}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <label>Tags:</label>
            <div className="tags-container">
              {tags.length > 0 ? (
                tags.map((tag) => (
                  <div key={tag.id} className="tag-checkbox">
                    <input
                      type="checkbox"
                      id={`tag-${tag.id}`}
                      checked={formData.tags.includes(tag.id)}
                      onChange={() => handleTagChange(tag.id)}
                    />
                    <label htmlFor={`tag-${tag.id}`}>{tag.name}</label>
                  </div>
                ))
              ) : (
                <p>Loading tags...</p>
              )}
            </div>
          </div>
          <button type="submit" disabled={isSubmitting} className="button">
            {isSubmitting ? "Submitting..." : "Add Course"}
          </button>
        </form>
        {successMessage && <p className="success-message">{successMessage}</p>}
        {errorMessage && <p className="error-message">{errorMessage}</p>}
      </div>
    </div>
  );
};

export default AddCourse;
