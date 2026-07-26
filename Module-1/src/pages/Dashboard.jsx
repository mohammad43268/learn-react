import React, { useContext } from 'react';
import { DataContext } from '../context/DataContext';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { CheckCircle2, Circle } from 'lucide-react';
import './Dashboard.css';

export const Dashboard = () => {
  const { state, dispatch } = useContext(DataContext);
  const { items, loading, error } = state;

  const handleDelete = (id) => {
    dispatch({ type: 'DELETE_ITEM', payload: id });
  };

  const handleAdd = () => {
    const newItem = {
      id: Date.now(),
      title: 'New Dashboard Task',
      completed: false
    };
    dispatch({ type: 'ADD_ITEM', payload: newItem });
  };

  return (
    <div className="dashboard-page animate-fade-in container">
      <div className="dashboard-header">
        <h2>Dashboard</h2>
        <Button onClick={handleAdd}>Add Task</Button>
      </div>

      <Card title="Task Overview">
        {loading && <div className="loading-spinner">Loading tasks...</div>}
        {error && <div className="error-message">Error: {error}</div>}
        
        {!loading && !error && (
          <div className="task-list">
            {items.length === 0 ? (
              <p className="empty-state">No tasks available. Add some!</p>
            ) : (
              items.map((item) => (
                <div key={item.id} className="task-item">
                  <div className="task-content">
                    {item.completed ? (
                      <CheckCircle2 className="icon-success" size={24} />
                    ) : (
                      <Circle className="icon-pending" size={24} />
                    )}
                    <span className={item.completed ? 'task-title completed' : 'task-title'}>
                      {item.title}
                    </span>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => handleDelete(item.id)}>
                    Delete
                  </Button>
                </div>
              ))
            )}
          </div>
        )}
      </Card>
    </div>
  );
};
