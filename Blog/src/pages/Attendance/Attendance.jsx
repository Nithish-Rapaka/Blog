import React, { useState, useEffect } from 'react';
import './Attendance.css';

function Attendance() {
  const [selectedDate, setSelectedDate] = useState('');
  const [present, setPresent] = useState(null);
  const [stats, setStats] = useState(null);

  const userId = 'Nithish'; // Replace with dynamic user if needed

  function submitAttendance(e) {
    e.preventDefault();

    if (!selectedDate || present === null) {
      alert("Please select a date and an attendance status.");
      return;
    }

    fetch('https://blog-backend-gktd.onrender.com/user/attendance', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId,
        date: selectedDate,
        present,
      })
    })
      .then(res => res.json())
      .then(data => {
        alert(data.message || "Attendance recorded.");
        setSelectedDate('');
        setPresent(null);
        fetchStats(); // Refresh stats after submission
      })
      .catch(err => {
        console.error(err);
        alert("Failed to submit attendance.");
      });
  }

  function fetchStats() {
    fetch(`https://blog-backend-gktd.onrender.com/user/attendance/${userId}`)
      .then(res => res.json())
      .then(data => {
        if (data.percentage) {
          setStats(data);
        } else {
          setStats(null);
        }
      })
      .catch(err => console.error("Stats fetch failed", err));
  }

  function deleteAllAttendance() {
    if (window.confirm("⚠️ Are you sure you want to delete ALL your attendance records? This cannot be undone.")) {
      fetch(`https://blog-backend-gktd.onrender.com/user/attendance/${userId}`, {
        method: 'DELETE'
      })
        .then(res => res.json())
        .then(data => {
          alert(data.message || "All attendance data deleted.");
          setStats(null);
        })
        .catch(err => {
          console.error("Delete all attendance failed", err);
          alert("Failed to delete attendance data.");
        });
    }
  }

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <div className="attendance-form">
      <h2>Mark Attendance</h2>
      <form onSubmit={submitAttendance}>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          required
        />

        <div className="radio-options">
          <label>
            <input
              type="radio"
              name="attendance"
              checked={present === true}
              onChange={() => setPresent(true)}
            />
            Yes (Present)
          </label>
          <label>
            <input
              type="radio"
              name="attendance"
              checked={present === false}
              onChange={() => setPresent(false)}
            />
            No (Absent)
          </label>
        </div>

        <button type="submit">Submit</button>
      </form>

      {stats && (
        <div className="attendance-stats">
          <h3>Attendance Stats</h3>
          <p>Total Days: {stats.totalDays}</p>
          <p>Present Days: {stats.presentDays}</p>
          <p><strong>Attendance Percentage: {stats.percentage}</strong></p>
          {stats.lastDate && (
            <p>
              📅 Last Entry Date: {new Date(stats.lastDate).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
              })}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export default Attendance;
