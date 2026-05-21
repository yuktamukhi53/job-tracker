import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Dashboard() {
  const [jobs, setJobs] = useState([]);
  const [company, setCompany] = useState('');
  const [position, setPosition] = useState('');
  const [status, setStatus] = useState('Applied');
  const [notes, setNotes] = useState('');
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem('user'));
  const token = localStorage.getItem('token');

  const fetchJobs = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/jobs', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setJobs(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleAddJob = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/jobs',
        { company, position, status, notes },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCompany('');
      setPosition('');
      setNotes('');
      fetchJobs();
    } catch (err) {
      console.log(err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/jobs/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchJobs();
    } catch (err) {
      console.log(err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const columns = ['Applied', 'Interview', 'Offer', 'Rejected'];

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Welcome, {user?.name}!</h2>
        <button onClick={handleLogout} style={{ padding: '8px 16px', background: 'red', color: 'white', border: 'none', cursor: 'pointer' }}>
          Logout
        </button>
      </div>

      <div style={{ background: '#f5f5f5', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
        <h3>New Job Add Karo</h3>
        <form onSubmit={handleAddJob} style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <input type="text" placeholder="Company" value={company} onChange={(e) => setCompany(e.target.value)} style={{ padding: '8px', flex: 1 }} required />
          <input type="text" placeholder="Position" value={position} onChange={(e) => setPosition(e.target.value)} style={{ padding: '8px', flex: 1 }} required />
          <select value={status} onChange={(e) => setStatus(e.target.value)} style={{ padding: '8px' }}>
            <option>Applied</option>
            <option>Interview</option>
            <option>Offer</option>
            <option>Rejected</option>
          </select>
          <input type="text" placeholder="Notes" value={notes} onChange={(e) => setNotes(e.target.value)} style={{ padding: '8px', flex: 2 }} />
          <button type="submit" style={{ padding: '8px 16px', background: 'blue', color: 'white', border: 'none', cursor: 'pointer' }}>Add Job</button>
        </form>
      </div>

      <div style={{ display: 'flex', gap: '16px', overflowX: 'auto' }}>
        {columns.map((col) => (
          <div key={col} style={{ flex: 1, minWidth: '200px', background: '#f0f0f0', borderRadius: '8px', padding: '12px' }}>
            <h3 style={{ textAlign: 'center' }}>{col}</h3>
            {jobs.filter(job => job.status === col).map(job => (
              <div key={job._id} style={{ background: 'white', padding: '12px', borderRadius: '6px', marginBottom: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                <h4 style={{ margin: '0 0 4px' }}>{job.company}</h4>
                <p style={{ margin: '0 0 4px', color: '#666' }}>{job.position}</p>
                {job.notes && <p style={{ margin: '0 0 8px', fontSize: '12px', color: '#999' }}>{job.notes}</p>}
                <button onClick={() => handleDelete(job._id)} style={{ padding: '4px 8px', background: 'red', color: 'white', border: 'none', cursor: 'pointer', fontSize: '12px' }}>Delete</button>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Dashboard;