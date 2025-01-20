import React, { useState, useEffect } from "react";
import Header from "../../components/Header";
import TeacherCard from "../../components/TeacherCard";
import SearchBar from "../../components/SearchBar";
import "./Teacher.css";

const Teacher = ({ onLogout }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [teachers, setTeachers] = useState([
    // {
    //   id: 1,
    //   name: "Adrian Spring",
    //   description:
    //     "I'm Adrian Spring, your teacher for this year. I'm excited to embark on this journey of learning and discovery with all of you.",
    //   filters: ["English", "Polish", "Spanish"],
    // },
    // {
    //   id: 2,
    //   name: "Emily Davis",
    //   description:
    //     "I'm Emily Davis, an experienced teacher passionate about sharing knowledge. Let’s explore the wonders of learning together!",
    //   filters: ["English", "French"],
    // },
    // {
    //   id: 3,
    //   name: "Michael Brown",
    //   description:
    //     "Michael here! I specialize in making complex topics simple and enjoyable for all learners.",
    //   filters: ["English", "German"],
    // },
  ]);

  const apiBaseUrl = "https://e-learning-platform-v1-bmdefngmcxdthqbn.westeurope-01.azurewebsites.net/api/Base";

  const fetchTeachers = async () => {
    try {
      const response = await fetch(`${apiBaseUrl}/getAllTeachers`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const data = await response.json();
      setTeachers(data); // Сохраняем полученные данные
    } catch (error) {
      console.error("Failed to fetch teachers:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTeachers();
  }, []);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };


  const filteredTeachers = teachers.filter((teacher) => {
    if (teacher) {
      const matchesName = teacher.firstName + teacher.lastName
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesFilter = teacher.tags.some((filter) => {
        if (filter) {
          filter.toLowerCase().includes(searchTerm.toLowerCase())
        }
      });
      return matchesName || matchesFilter;
    }
  });

  return (
    <div>
      <Header onLogout={onLogout} />
      <div className="content">
        {/* Пошуковий рядок */}
        <SearchBar
          searchTerm={searchTerm}
          onSearchChange={handleSearchChange}
        />

        {/* Заголовок */}
        <h1 className="headerText">Teacher list</h1>

        {/* Список карток вчителів */}
        <div className="cardContainer">
          {filteredTeachers.map((teacher) => (
            <TeacherCard
              key={teacher.id}
              name={teacher.firstName + " " + teacher.lastName}
              description={teacher.description}
              filters={teacher.filters}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Teacher;
