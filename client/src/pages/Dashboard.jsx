import React, { useState, useEffect } from 'react';
import api from '../api/axiosConfig';
import NewNoteForm from '../components/NewNoteForm';
import NoteCard from '../components/NoteCard';

export default function Dashboard() {
    const [notes, setNotes] = useState([]);
    const [loading, setLoading] = useState(true);
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');

    useEffect(() => {
        const fetchNotes = async () => {
        try {
            const { data } = await api.get('/notes', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setNotes(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    fetchNotes();
    }, [token]);

    const createNote = async noteData => {
        try {
            const { data } = await api.post('/notes', noteData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setNotes(prev => [data, ...prev]);
        } catch (err) {
            console.error(err);
        }
    };

    const updateNote = async (id, noteData) => {
        try {
            const { data } = await api.put(`/notes/${id}`, noteData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setNotes(prev => prev.map(n => n._id === id ? data : n));
        } catch (err) {
            console.error(err);
        }
    };

    const deleteNote = async id => {
        if (!window.confirm('Are you sure you want to delete this note?')) return;
        try {
            await api.delete(`/notes/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setNotes(prev => prev.filter(n => n._id !== id));
        } catch (err){
            console.error(err);
        }
    }

    if (loading) return <p>Loading notes…</p>;

    const displayNotes = role === 'manager' ? notes : notes.filter(n => n.showToWorkers);

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Dashboard</h1>

            {role === 'manager' && (
                <NewNoteForm onCreate={createNote} />
            )}

            {displayNotes.length === 0 && role === 'worker' && (
                <p>No notes</p>
            )}

            <div className="space-y-4">
                {displayNotes
                .sort((a,b) => b.pinned - a.pinned)
                .map(note => (
                    <NoteCard
                    key={note._id}
                    note={note}
                    isManager={role === 'manager'}
                    onUpdate={updateNote}
                    onDelete={deleteNote}
                    />
                ))}
            </div>
        </div>
    );
}