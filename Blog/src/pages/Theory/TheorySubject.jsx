import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './TheorySubjec.css';

function SubjectManager() {
  const [year, setYear] = useState('');
  const [semester, setSemester] = useState('');
  const [subjects, setSubjects] = useState([]);
  const [newSubject, setNewSubject] = useState('');
  const apiBase = 'http://localhost:3000'; // Backend URL

  useEffect(() => {
    if (year && semester) fetchSubjects();
  }, [year, semester]);

  const fetchSubjects = async () => {
    try {
      const res = await axios.get(`${apiBase}/theory`);
      const filtered = res.data.filter(
        subj => subj.year === year && subj.semester === semester
      );
      setSubjects(filtered);
    } catch (err) {
      console.error('Fetch Theory error:', err);
    }
  };

  const addSubject = async () => {
    if (!newSubject.trim()) return alert('Enter subject name!');
    try {
      const res = await axios.post(`${apiBase}/theory`, {
        year,
        semester,
        subjectName: newSubject.trim(),
      });
      setSubjects([...subjects, res.data.data]);
      setNewSubject('');
    } catch (err) {
      console.error('Add Theory error:', err);
    }
  };

  const deleteSubject = async id => {
    if (window.confirm('Delete this subject?')) {
      try {
        await axios.delete(`${apiBase}/theory/${id}`);
        setSubjects(subjects.filter(subj => subj._id !== id));
      } catch (err) {
        console.error('Delete Theory error:', err);
      }
    }
  };

  const addLinkToSubject = async (subjectId, url, description) => {
    try {
      const res = await axios.post(`${apiBase}/theory/${subjectId}/links`, { url, description });
      setSubjects(subjects.map(subj => (subj._id === subjectId ? res.data.data : subj)));
    } catch (err) {
      console.error('Add link error:', err);
    }
  };

  const deleteLinkFromSubject = async (subjectId, linkIndex) => {
    try {
      const res = await axios.delete(`${apiBase}/theory/${subjectId}/links/${linkIndex}`);
      setSubjects(subjects.map(subj => (subj._id === subjectId ? res.data.data : subj)));
    } catch (err) {
      console.error('Delete link error:', err);
    }
  };

  return (
    <div>
      <h2>📚 Theory PDFs</h2>
      {!year ? (
        <YearSelector setYear={setYear} />
      ) : !semester ? (
        <SemesterSelector year={year} setYear={setYear} setSemester={setSemester} />
      ) : (
        <SubjectList
          year={year}
          semester={semester}
          subjects={subjects}
          newSubject={newSubject}
          setNewSubject={setNewSubject}
          addSubject={addSubject}
          deleteSubject={deleteSubject}
          addLinkToSubject={addLinkToSubject}
          deleteLinkFromSubject={deleteLinkFromSubject}
          setSemester={setSemester}
        />
      )}
    </div>
  );
}

function YearSelector({ setYear }) {
  return (
    <div>
      <h3>Select Year</h3>
      <select onChange={e => setYear(e.target.value)}>
        <option value="">-- Select Year --</option>
        <option value="1st Year">1st Year</option>
        <option value="2nd Year">2nd Year</option>
        <option value="3rd Year">3rd Year</option>
        <option value="4th Year">4th Year</option>
      </select>
    </div>
  );
}

function SemesterSelector({ year, setYear, setSemester }) {
  return (
    <div>
      <h3>Year: {year}</h3>
      <h3>Select Semester</h3>
      <select onChange={e => setSemester(e.target.value)}>
        <option value="">-- Select Semester --</option>
        <option value="Semester 1">Semester 1</option>
        <option value="Semester 2">Semester 2</option>
      </select>
      <br />
      <button onClick={() => setYear('')}>🔙 Back to Year</button>
    </div>
  );
}

function SubjectList({
  year, semester, subjects, newSubject, setNewSubject,
  addSubject, deleteSubject, addLinkToSubject, deleteLinkFromSubject, setSemester
}) {
  return (
    <>
      <h3>Year: {year} | Semester: {semester}</h3>
      <button onClick={() => setSemester('')}>🔙 Back to Semester</button>
      <br /><br />
      <div>
        <input
          type="text"
          placeholder="Enter subject name"
          value={newSubject}
          onChange={e => setNewSubject(e.target.value)}
        />
        <button onClick={addSubject}>+ Add Subject</button>
      </div>
      {subjects.map(subject => (
        <div
          key={subject._id}
          style={{
            border: '1px solid #ccc', borderRadius: '8px',
            margin: '10px 0', padding: '10px', backgroundColor: '#f9f9f9'
          }}
        >
          <h3>{subject.subjectName}</h3>
          <button onClick={() => deleteSubject(subject._id)} style={{ color: 'red' }}>
            🗑️ Delete Subject
          </button>
          <LinkManager
            links={subject.links}
            onAddLink={(url, desc) => addLinkToSubject(subject._id, url, desc)}
            onDeleteLink={index => deleteLinkFromSubject(subject._id, index)}
          />
        </div>
      ))}
    </>
  );
}

function LinkManager({ links, onAddLink, onDeleteLink }) {
  const [newLink, setNewLink] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [showAddLinkForm, setShowAddLinkForm] = useState(false); // 👈 New state

  const handleAdd = () => {
    if (!newLink.trim() || !newDesc.trim()) {
      alert('Enter both URL and description!');
      return;
    }
    onAddLink(newLink, newDesc);
    setNewLink('');
    setNewDesc('');
    setShowAddLinkForm(false); // 👈 Hide form after adding
  };

  return (
    <div className='body'>
      <h4>📄 PDFs</h4>
      {links.length === 0 ? (
        <p>No PDFs uploaded yet.</p>
      ) : (
        <ul>
          {links.map((link, index) => (
            <li key={index}>
              <a href={link.url} target="_blank" rel="noopener noreferrer">
                {link.description}
              </a>
              <button onClick={() => onDeleteLink(index)} style={{ marginLeft: '10px', color: 'red' }}>
                🗑️ Delete Link
              </button>
            </li>
          ))}
        </ul>
      )}

      {/* Add Link Toggle */}
      {showAddLinkForm ? (
        <>
          <input
            type="text"
            placeholder="https://..."
            value={newLink}
            onChange={e => setNewLink(e.target.value)}
          />
          <input
            type="text"
            placeholder="Description"
            value={newDesc}
            onChange={e => setNewDesc(e.target.value)}
          />
          <button onClick={handleAdd}>✅ Save Link</button>
          <button onClick={() => setShowAddLinkForm(false)} style={{ marginLeft: '10px' }}>
            ❌ Cancel
          </button>
        </>
      ) : (
        <button onClick={() => setShowAddLinkForm(true)}>+ Add Link</button>
      )}
    </div>
  );
}

export default SubjectManager;
