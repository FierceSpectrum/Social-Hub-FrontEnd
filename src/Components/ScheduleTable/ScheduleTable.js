import React, { useState, useEffect } from "react";
import Modal from "../Modal/Modal";
import Header from "../Header/Header";
import "./ScheduleTable.scss";

function ScheduleTable() {
  const userId = JSON.parse(localStorage.getItem("UserId"));
  const daysOfWeek = [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday",
  ];

  const [schedule, setSchedule] = useState({
    monday: "",
    tuesday: "",
    wednesday: "",
    thursday: "",
    friday: "",
    saturday: "",
    sunday: "",
  });
  const [selectedDay, setSelectedDay] = useState("");
  const [selectedTimeIndex, setSelectedTimeIndex] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [newTime, setNewTime] = useState("");
  const [scheduleExists, setScheduleExists] = useState(false);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `http://socialhub.codementoria.fsg/api/schedules/ByUserId?userId=${userId}`,
          {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        let data = await response.json();
        if (!response.ok) {
          if (data.message !== "Schedule not found") {
            throw new Error("Failed to fetch schedule");
          }
          data = null
        }

        if (data) {
          setSchedule(data);
          setScheduleExists(true);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSchedule();
  }, [userId]);

  const openModal = (day, index) => {
    setSelectedDay(day);
    setSelectedTimeIndex(index);
    setNewTime(index !== null ? schedule[day].split("/")[index] : "");
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const handleTimeChange = (event) => {
    setNewTime(event.target.value);
  };

  const handleSaveTime = () => {
    if (isValidTime(newTime)) {
      const updatedSchedule = { ...schedule };
      const times = updatedSchedule[selectedDay]
        ? updatedSchedule[selectedDay].split("/")
        : [];
      if (selectedTimeIndex !== null) {
        times[selectedTimeIndex] = newTime;
      } else {
        times.push(newTime);
      }
      updatedSchedule[selectedDay] = times
        .sort((a, b) => timeCompare(a, b))
        .join("/");
      setSchedule(updatedSchedule);
      closeModal();
    } else {
      alert("Invalid time format. Please use HH:MM.");
    }
  };

  const handleDeleteTime = () => {
    const updatedSchedule = { ...schedule };
    const times = updatedSchedule[selectedDay]
      ? updatedSchedule[selectedDay].split("/")
      : [];
    if (selectedTimeIndex !== null) {
      times.splice(selectedTimeIndex, 1);
      updatedSchedule[selectedDay] = times
        .sort((a, b) => timeCompare(a, b))
        .join("/");
      setSchedule(updatedSchedule);
      closeModal();
    }
  };

  const isValidTime = (time) => {
    return /^([01]\d|2[0-3]):([0-5]\d)$/.test(time);
  };

  const timeCompare = (a, b) => {
    const [hoursA, minutesA] = a.split(":").map(Number);
    const [hoursB, minutesB] = b.split(":").map(Number);
    return hoursA - hoursB || minutesA - minutesB;
  };

  const handleSave = async () => {
    try {
      const response = await fetch(
        `http://socialhub.codementoria.fsg/api/schedules${
          scheduleExists ? `?id=${schedule.id}` : ""
        }`,
        {
          method: scheduleExists ? "PATCH" : "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ ...schedule, userId }),
        }
      );

      if (!response.ok) throw new Error("Failed to save schedule");

      alert("Schedule saved successfully!");
    } catch (err) {
      alert(`Error: ${err.message}`);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <>
      <Header />
      <div className="Boddy">
        <div className="schedule-table">
          <table>
            <thead>
              <tr>
                {daysOfWeek.map((day, index) => (
                  <th key={index} onClick={() => openModal(day, null)}>
                    {capitalize(day)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                ...Array(
                  Math.max(
                    ...daysOfWeek.map(
                      (day) => schedule[day]?.split("/").length || 0
                    )
                  )
                ),
              ].map((_, rowIndex) => (
                <tr key={rowIndex}>
                  {daysOfWeek.map((day, colIndex) => {
                    const times = schedule[day]?.split("/") || [];
                    return (
                      <td
                        key={colIndex}
                        onClick={() => openModal(day, rowIndex)}
                        className={times[rowIndex] ? "editable" : "add"}
                      >
                        {times[rowIndex] || "Add Time"}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
          <button onClick={handleSave}>Guardar Cronograma</button>

          <Modal isOpen={modalIsOpen} onClose={closeModal}>
            <h2>{selectedTimeIndex !== null ? "Edit Time" : "Add Time"}</h2>
            <input
              type="time"
              value={newTime}
              onChange={handleTimeChange}
              className="time-input"
            />
            <div className="modal-buttons">
              <button onClick={closeModal}>Cancel</button>
              {selectedTimeIndex !== null && (
                <button className="delete-time" onClick={handleDeleteTime}>
                  Delete Time
                </button>
              )}
              <button onClick={handleSaveTime}>Save</button>
            </div>
          </Modal>
        </div>
      </div>
    </>
  );
}

const capitalize = (word) => {
  return word.charAt(0).toUpperCase() + word.slice(1);
};

export default ScheduleTable;
