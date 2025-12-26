import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/api";
import { useAuth } from "../context/AuthContext";

export default function ProjectDetails() {
    const { projectId } = useParams();
    const { loading: authLoading } = useAuth(); // rename to avoid conflict
    const navigate = useNavigate();

    const [project, setProject] = useState(null);
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [showTaskForm, setShowTaskForm] = useState(false);
    const [newTask, setNewTask] = useState({ title: "", description: "", priority: "medium", dueDate: "" });

    useEffect(() => {
        if (authLoading) return;

        const fetchData = async () => {
            try {
                setLoading(true);
                // Fetch project
                const pRes = await api.get(`/projects/${projectId}`);
                setProject(pRes.data.data);

                // Fetch tasks
                const tRes = await api.get(`/projects/${projectId}/tasks`);
                // Handle inconsistent API response structure (tasks vs data.tasks)
                const taskData = tRes.data.data?.tasks || tRes.data.data || [];
                setTasks(taskData);
            } catch (err) {
                console.error(err);
                setError("Failed to load project details");
                if (err.response?.status === 404) navigate("/projects");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [projectId, authLoading, navigate]);

    const handleAddTask = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post(`/projects/${projectId}/tasks`, newTask);
            setTasks([...tasks, res.data.data]);
            setShowTaskForm(false);
            setNewTask({ title: "", description: "", priority: "medium", dueDate: "" });
        } catch (err) {
            alert("Failed to create task");
        }
    };

    const updateTaskStatus = async (taskId, newStatus) => {
        try {
            // Optimistic update
            setTasks(tasks.map(t => t.id === taskId ? { ...t, status: newStatus } : t));
            await api.patch(`/tasks/${taskId}/status`, { status: newStatus });
        } catch {
            alert("Failed to update status");
            // Revert (reload tasks)
        }
    };

    const getPriorityColor = (p) => {
        switch (p) {
            case 'high': return 'text-red-400';
            case 'medium': return 'text-yellow-400';
            default: return 'text-green-400';
        }
    };

    if (loading) return <div className="p-4 text-center">Loading...</div>;
    if (error) return <div className="p-4 text-center text-red-500">{error}</div>;
    if (!project) return null;

    return (
        <div>
            <div className="card mb-6" style={{ marginBottom: '2rem' }}>
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h2 className="text-2xl font-bold mb-2">{project.name}</h2>
                        <p>{project.description}</p>
                    </div>
                    <div className={`badge ${project.status === 'active' ? 'badge-success' : 'badge-neutral'}`}>
                        {project.status.toUpperCase()}
                    </div>
                </div>
            </div>

            <div className="flex justify-between items-center mb-4" style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'space-between' }}>
                <h3 className="text-xl font-semibold">Tasks ({tasks.length})</h3>
                <button className="btn btn-primary" onClick={() => setShowTaskForm(!showTaskForm)}>
                    {showTaskForm ? 'Cancel' : '+ Add Task'}
                </button>
            </div>

            {showTaskForm && (
                <div className="card mb-6 animate-fade-in" style={{ marginBottom: '2rem' }}>
                    <form onSubmit={handleAddTask}>
                        <div className="form-group">
                            <label className="form-label">Task Title</label>
                            <input
                                className="form-input"
                                value={newTask.title}
                                onChange={e => setNewTask({ ...newTask, title: e.target.value })}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Description</label>
                            <textarea
                                className="form-input"
                                value={newTask.description}
                                onChange={e => setNewTask({ ...newTask, description: e.target.value })}
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Priority</label>
                            <select
                                className="form-input"
                                value={newTask.priority}
                                onChange={e => setNewTask({ ...newTask, priority: e.target.value })}
                            >
                                <option value="low">Low</option>
                                <option value="medium">Medium</option>
                                <option value="high">High</option>
                            </select>
                        </div>
                        <button type="submit" className="btn btn-primary">Create Task</button>
                    </form>
                </div>
            )}

            {tasks.length === 0 ? (
                <div className="text-center p-8 border rounded border-dashed border-gray-700 text-gray-400">
                    No tasks yet. Create one above!
                </div>
            ) : (
                <div className="grid gap-4">
                    {tasks.map(task => (
                        <div key={task.id} className="card flex justify-between items-center" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <h4 className="font-medium mb-1" style={{ marginBottom: '0.25rem' }}>{task.title}</h4>
                                <p className="text-sm">{task.description}</p>
                                <div className="mt-2 text-xs flex gap-3" style={{ marginTop: '0.5rem', display: 'flex', gap: '1rem', fontSize: '0.75rem' }}>
                                    <span className={getPriorityColor(task.priority)}>● {task.priority.toUpperCase()}</span>
                                    <span>DueDate: {task.due_date ? new Date(task.due_date).toLocaleDateString() : 'None'}</span>
                                </div>
                            </div>
                            <div>
                                <select
                                    className="form-input text-sm p-1"
                                    style={{ padding: '0.25rem' }}
                                    value={task.status}
                                    onChange={(e) => updateTaskStatus(task.id, e.target.value)}
                                >
                                    <option value="todo">To Do</option>
                                    <option value="in_progress">In Progress</option>
                                    <option value="completed">Completed</option>
                                </select>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
