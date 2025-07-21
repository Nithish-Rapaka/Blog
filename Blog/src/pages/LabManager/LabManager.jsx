import React, { useState, useEffect } from 'react';
import axios from 'axios';

function LabsManager() {
  const [year, setYear] = useState('');
  const [semester, setSemester] = useState('');
  const [labs, setLabs] = useState([]);
  const [newLab, setNewLab] = useState('');
  const apiBase = 'http://localhost:3000'; // Your backend URL

  // Fetch labs for selected year & semester
  useEffect(() => {
    if (year && semester) {
      fetchLabs();
    }
  }, [year, semester]);

  const fetchLabs = async () => {
    try {
      const res = await axios.get(`${apiBase}/labs`);
      const filtered = res.data.filter(
        (lab) => lab.year === year && lab.semester === semester
      );
      setLabs(filtered);
    } catch (err) {
      console.error('Failed to fetch labs:', err);
    }
  };

  const addLab = async () => {
    if (!newLab.trim()) return alert('Enter a lab name!');
    try {
      const res = await axios.post(`${apiBase}/labs`, {
        year,
        semester,
        labName: newLab.trim(),
      });
      setLabs([...labs, res.data.data]);
      setNewLab('');
    } catch (err) {
      console.error('Failed to add lab:', err);
    }
  };

  const deleteLab = async (id) => {
    if (window.confirm('Are you sure you want to delete this lab?')) {
      try {
        await axios.delete(`${apiBase}/labs/${id}`);
        setLabs(labs.filter((lab) => lab._id !== id));
      } catch (err) {
        console.error('Failed to delete lab:', err);
      }
    }
  };

  const addLinkToLab = async (labId, link, description) => {
    try {
      const res = await axios.post(`${apiBase}/labs/${labId}/links`, { url: link, description });
      setLabs(labs.map((lab) => (lab._id === labId ? res.data.data : lab)));
    } catch (err) {
      console.error('Failed to add link:', err);
    }
  };

  const deleteLinkFromLab = async (labId, linkIndex) => {
    try {
      const res = await axios.delete(`${apiBase}/labs/${labId}/links/${linkIndex}`);
      setLabs(labs.map((lab) => (lab._id === labId ? res.data.data : lab)));
    } catch (err) {
      console.error('Failed to delete link:', err);
    }
  };

  return (
    <div>
      <h2>🧪 Labs PDFs</h2>

      {/* Step 1: Year Selection */}
      {!year ? (
        <div>
          <h3>Select Year</h3>
          <select value={year} onChange={(e) => setYear(e.target.value)}>
            <option value="">-- Select Year --</option>
            <option value="1st Year">1st Year</option>
            <option value="2nd Year">2nd Year</option>
            <option value="3rd Year">3rd Year</option>
            <option value="4th Year">4th Year</option>
          </select>
        </div>
      ) : !semester ? (
        // Step 2: Semester Selection
        <div>
          <h3>Year: {year}</h3>
          <h3>Select Semester</h3>
          <select value={semester} onChange={(e) => setSemester(e.target.value)}>
            <option value="">-- Select Semester --</option>
            <option value="Semester 1">Semester 1</option>
            <option value="Semester 2">Semester 2</option>
          </select>
          <br />
          <button onClick={() => setYear('')}>🔙 Back to Year</button>
        </div>
      ) : (
        <>
          {/* Step 3: Lab & Link Manager */}
          <h3>Year: {year} | Semester: {semester}</h3>
          <button onClick={() => setSemester('')}>🔙 Back to Semester</button>
          <br /><br />

          <div>
            <input
              type="text"
              placeholder="Enter lab name"
              value={newLab}
              onChange={(e) => setNewLab(e.target.value)}
            />
            <button onClick={addLab}>+ Add Lab</button>
          </div>

          {labs.map((lab) => (
            <div
              key={lab._id}
              style={{
                border: '1px solid #ccc',
                borderRadius: '8px',
                margin: '10px 0',
                padding: '10px',
                backgroundColor: '#f9f9f9',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3>{lab.labName}</h3>
                <button
                  onClick={() => deleteLab(lab._id)}
                  style={{
                    backgroundColor: '#ff4d4d',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '4px',
                    padding: '5px 10px',
                    cursor: 'pointer',
                  }}
                >
                  🗑️ Delete Lab
                </button>
              </div>

              <LinkManager
                links={lab.links}
                onAddLink={(link, desc) => addLinkToLab(lab._id, link, desc)}
                onDeleteLink={(linkIndex) => deleteLinkFromLab(lab._id, linkIndex)}
              />
            </div>
          ))}
        </>
      )}
    </div>
  );
}

function LinkManager({ links, onAddLink, onDeleteLink }) {
  const [newLink, setNewLink] = useState('');
  const [newDesc, setNewDesc] = useState('');

  const addLink = () => {
    if (newLink.trim() && newDesc.trim()) {
      onAddLink(newLink.trim(), newDesc.trim());
      setNewLink('');
      setNewDesc('');
    }
  };

  return (
    <div>
      <h4>📄 Available Lab PDFs</h4>
      {links.length === 0 ? (
        <p>No PDFs uploaded yet.</p>
      ) : (
        <ul>
          {links.map((link, index) => (
            <li key={index}>
              <a
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: 'blue', textDecoration: 'underline' }}
              >
                {link.description}
              </a>
              <button
                onClick={() => onDeleteLink(index)}
                style={{ marginLeft: '10px', color: 'red', cursor: 'pointer' }}
              >
                🗑️ Delete Link
              </button>
            </li>
          ))}
        </ul>
      )}

      <h5>Add Lab PDF Link</h5>
      <input
        type="text"
        placeholder="https://..."
        value={newLink}
        onChange={(e) => setNewLink(e.target.value)}
      />
      <input
        type="text"
        placeholder="Description"
        value={newDesc}
        onChange={(e) => setNewDesc(e.target.value)}
      />
      <button onClick={addLink}>+ Add Link</button>
    </div>
  );
}

export default LabsManager;
