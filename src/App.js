import React, { useState, useEffect } from 'react';
import PomodoroTimer from "./components/PomodoroTimer";
import TaskColumn from "./components/TaskColumn";

import styled, { ThemeProvider, createGlobalStyle } from 'styled-components';
import './App.css';

const GlobalStyle = createGlobalStyle`
  body {
    background: ${({ theme }) => theme.bodyBg} !important;
    color: ${({ theme }) => theme.textColor} !important;
    font-family: 'Montserrat', sans-serif !important;
    margin: 0;
    padding: 0;
    transition: all 0.3s ease-in-out;
    height: 100vh;
    width: 100vw;
    display: flex;
    justify-content: center;
    align-items: center;
  }
`;

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  width: 100vw;
  height: 100vh;
  background: ${({ theme }) => theme.bodyBg};
`;

const Title = styled.h1`
  color: ${({ theme }) => theme.headingColor};
  text-align: center;
  font-size: 6vw;
  margin: 0;
  padding: 0;
`;

const ThemeSwitchButton = styled.button`
  position: absolute;
  right: 20px;
  top: 1px;
  background: ${({ theme }) => theme.switchButtonBg};
  border: none;
  border-radius: 50px;
  padding: 10px 20px;
  margin: 20px 0;
  cursor: pointer;
  font-size: 18px;
  color: ${({ theme }) => theme.switchButtonTextColor};
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.3s ease-in-out;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);

  &:hover {
    background: ${({ theme }) => theme.switchButtonHoverBg};
  }

  & .icon {
    margin-right: 8px;
  }
`;

const SearchContainer = styled.div`
  display: flex;
  align-items: center;
  margin: 20px 0 ;
`;

const SearchInput = styled.input`
  width: 300px;
  padding: 10px;
  border: 2px solid ${({ theme }) => theme.addTaskInputBorder};
  border-radius: 25px; 
  font-size: 16px;
  outline: none;
  background: ${({ theme }) => theme.addTaskInputBg};
  color: red;
  transition: border-color 0.3s ease-in-out;

  &:focus {
    border-color: ${({ theme }) => theme.addTaskInputFocusBorder};
  }
`;


const SearchButton = styled.button`
  padding: 10px 20px;
  border: 2px solid ${({ theme }) => theme.addTaskInputBorder};
  border-left: none;
  border-radius: 0 5px 5px 0;
  font-size: 16px;
  cursor: pointer;
  border-radius:25px;
  background: ${({ theme }) => theme.switchButtonBg};
  color: ${({ theme }) => theme.switchButtonTextColor};
  transition: background 0.3s ease-in-out;

  &:hover {
    background: ${({ theme }) => theme.switchButtonHoverBg};
  }
`;

const lightTheme = {
  bodyBg: '#d95550',
  textColor: '#fff',
  headingColor: '#fff',
  pomodoroBg: '#ae3f3c',
  pomodoroTitleColor: '#ede6e6',
  pomodoroModeColor: '#ecc011',
  pomodoroTimeColor: '#fff',
  pomodoroStartButtonBg: 'linear-gradient(135deg, #4caf50, #66bb6a)',
  pomodoroPauseButtonBg: 'linear-gradient(135deg, #ffa726, #ff9800)',
  pomodoroResetButtonBg: 'linear-gradient(135deg, #f44336, #e57373)',
  taskColumnBg: '#ae3f3c',
  taskColumnHoverBoxShadow: '0 8px 20px rgba(0, 0, 0, 0.1)',
  taskTitleColor: '#f4f3f3',
  addTaskInputBg: '#f8f2f2',
  addTaskInputBorder: '#090404',
  addTaskInputFocusBorder: '#00796b',
  addTaskButtonBg: '#00796b',
  addTaskButtonHoverBg: '#004d40',
  taskItemBg: '#b62828',
  taskItemBoxShadow: '0 2px 6px rgba(0, 0, 0, 0.05)',
  taskActionButton1Bg: '#fbc02d',
  taskActionButton1HoverBg: '#f9a825',
  taskActionButton2Bg: '#fbc02d',
  taskActionButton2HoverBg: '#f9a825',
  taskActionButton3Bg: '#d32f2f',
  taskActionButton3HoverBg: '#c62828',
  switchButtonBg: '#67030f',
  switchButtonTextColor: '#f8f7f7',
  switchButtonHoverBg: '#f9a825',
};

const darkTheme = {
  bodyBg: '#090909',
  textColor: '#757474',
  headingColor: '#e0ffe0',
  pomodoroBg: '#444544',
  pomodoroTitleColor: '#ADD8E6',
  pomodoroModeColor: '#90EE90',
  pomodoroTimeColor: '#ffffff',
  pomodoroStartButtonBg: 'linear-gradient(135deg, #357a38, #4caf50)',
  pomodoroPauseButtonBg: 'linear-gradient(135deg, #ff8f00, #ff6f00)',
  pomodoroResetButtonBg: 'linear-gradient(135deg, #c62828, #b71c1c)',
  taskColumnBg: '#424242',
  taskColumnHoverBoxShadow: '0 8px 20px rgba(255, 255, 255, 0.1)',
  taskTitleColor: '#ffffff',
  addTaskInputBg: '#616161',
  addTaskInputBorder: '#9e9e9e',
  addTaskInputFocusBorder: '#00796b',
  addTaskButtonBg: '#00796b',
  addTaskButtonHoverBg: '#004d40',
  taskItemBg: '#757575',
  taskItemBoxShadow: '0 2px 6px rgba(0, 0, 0, 0.2)',
  taskActionButton1Bg: '#388e3c',
  taskActionButton1HoverBg: '#2e7d32',
  taskActionButton2Bg: '#fbc02d',
  taskActionButton2HoverBg: '#f9a825',
  taskActionButton3Bg: '#d32f2f',
  taskActionButton3HoverBg: '#c62828',
  switchButtonBg: '#5a030a',
  switchButtonTextColor: '#ffffff',
  switchButtonHoverBg: '#090404',
};

function App() {
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem('tasks');
    return savedTasks
        ? JSON.parse(savedTasks)
        : {
          todo: [],
          inProgress: [],
          completed: [],
        };
  });

  const [theme, setTheme] = useState('light');
  const [searchInput, setSearchInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (title) => {
    setTasks((prev) => ({
      ...prev,
      todo: [...prev.todo, { id: Date.now(), title }],
    }));
  };

  const moveTask = (taskId, fromColumn, toColumn) => {
    const task = tasks[fromColumn].find((t) => t.id === taskId);
    setTasks((prev) => ({
      ...prev,
      [fromColumn]: prev[fromColumn].filter((t) => t.id !== taskId),
      [toColumn]: [...prev[toColumn], task],
    }));
  };

  const deleteTask = (taskId, columnName) => {
    setTasks((prev) => ({
      ...prev,
      [columnName]: prev[columnName].filter((task) => task.id !== taskId),
    }));
  };

  const onEditTask = (taskId, newTitle, columnName) => {
    setTasks((prev) => {
      const updatedColumn = prev[columnName].map((task) =>
          task.id === taskId ? { ...task, title: newTitle } : task
      );
      return {
        ...prev,
        [columnName]: updatedColumn,
      };
    });
  };

  const filteredTasks = {
    todo: tasks.todo.filter((task) =>
        task.title.toLowerCase().includes(searchQuery.toLowerCase())
    ),
    inProgress: tasks.inProgress.filter((task) =>
        task.title.toLowerCase().includes(searchQuery.toLowerCase())
    ),
    completed: tasks.completed.filter((task) =>
        task.title.toLowerCase().includes(searchQuery.toLowerCase())
    ),
  };

  return (
      <ThemeProvider theme={theme === 'light' ? lightTheme : darkTheme}>
        <GlobalStyle />
        <AppContainer>
          <Title>To-Do List</Title>
          <ThemeSwitchButton onClick={toggleTheme}>
            <span className="icon">{theme === 'light' ? '🌙' : '☀️'}</span>
            Switch to {theme === 'light' ? 'Dark' : 'Light'} Theme
          </ThemeSwitchButton>
          <SearchContainer>
            <SearchInput
                type="text"
                placeholder="Find Tasks"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
            />
            <SearchButton onClick={() => setSearchQuery(searchInput)}>
              Поиск
            </SearchButton>
          </SearchContainer>
          <PomodoroTimer />
          <div className="columns-container" style={{ display: 'flex', justifyContent: 'space-between', width: '100%', margin: 0, padding: 0 }}>
            <TaskColumn
                title="To Do"
                tasks={filteredTasks.todo}
                onAddTask={addTask}
                onMoveTask={moveTask}
                onDeleteTask={deleteTask}
                onEditTask={onEditTask}
                columnName="todo"
            />
            <TaskColumn
                title="In Progress"
                tasks={filteredTasks.inProgress}
                onMoveTask={moveTask}
                onDeleteTask={deleteTask}
                onEditTask={onEditTask}
                columnName="inProgress"
            />
            <TaskColumn
                title="Completed"
                tasks={filteredTasks.completed}
                onMoveTask={moveTask}
                onDeleteTask={deleteTask}
                onEditTask={onEditTask}
                columnName="completed"
            />
          </div>
        </AppContainer>
      </ThemeProvider>
  );
}

export default App;
