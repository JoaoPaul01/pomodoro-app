"use client";
import React, { useEffect, useState } from 'react';
import './globals.css';
import './home.css';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import TimerComponent from './components/timer';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import{
  SheetClose,
  SheetFooter,
} from "@/components/ui/sheet";
import axios from 'axios';

type Task = {
  id: string;
  name: string;
  description: string;
  turn: string;
  status: string;
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode; }>) {
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [isTimerPaused, setIsTimerPaused] = useState(false);
  const [resetKey, setResetKey] = useState(0);
  const [timerType, setTimerType] = useState('pomodoro');
  const [email, setEmail] = useState('');
  const [showRegisterDialog, setShowRegisterDialog] = useState(false);
  const [newTaskName, setNewTaskName] = useState('');
  const [savedTaskName, setSavedTaskName] = useState('');
  const [taskList, setTaskList] = useState<Task[]>([]);
  const [showTaskBoxes, setShowTaskBoxes] = useState(false);
  const [editedTaskName, setEditedTaskName] = useState('');
  const [editedTaskDescription, setEditedTaskDescription] = useState('');

  const handleStartClick = () => {
    setIsTimerActive(true);
    setIsTimerPaused(false);
  };

  const handlePauseClick = () => {
    setIsTimerPaused(true);
  };

  const handlePomodoroClick = () => {
    setTimerType('pomodoro');
    setResetKey(prevKey => prevKey + 1);
  };

  const handleShortBreakClick = () => {
    setTimerType('short-break');
    setResetKey(prevKey => prevKey + 1);
  };

  const handleLongBreakClick = () => {
    setTimerType('long-break');
    setResetKey(prevKey => prevKey + 1);
  };  

  const handleNextTimerClick = () => {
    switch (timerType) {
      case 'pomodoro':
        setTimerType('short-break');
        break;
      case 'short-break':
        setTimerType('long-break');
        break;
      case 'long-break':
        setTimerType('pomodoro');
        break;
      default:
        setTimerType('pomodoro');
    }
    setIsTimerActive(false); 
    setIsTimerPaused(true); 
    
    setResetKey(0);
  };

  const getInitialTime = () => {
    switch (timerType) {
      case 'pomodoro':
        return '25:00';
      case 'short-break':
        return '5:00';
      case 'long-break':
        return '15:00';
      default:
        return '25:00';
    }
  };

  const convertTasks = (data: any[]): Task[] => {
    // Assumindo que a resposta da API é um array de objetos com os campos necessários
    return data.map((task) => ({
      id: task.id,
      name: task.name, 
      description: task.description,
      turn: task.turn, 
      status: task.status
    }));
  };

  const handleNewTask = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const taskName = formData.get('taskName') as string;
    const taskDescription = formData.get('description') as string; 
    const taskTurns = formData.get('turns') as string; 
    createTask({
      name: taskName,
      description: taskDescription,
      turn: taskTurns
    });
    
  };

  const handleEmailSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log("Email submitted:", email);
    setShowRegisterDialog(false);
  };

  const openRegisterDialog = () => {
    setShowRegisterDialog(true);
  };

  const handleEditTask = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

  };

  async function createTask(body: any) {
    await axios.post('https://pomodoro-app-backend-production.up.railway.app/v1/task', body,{
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',

        },
        withCredentials: false,
      })
      .then(response => {
        setTaskList(convertTasks(response.data)); 
      })
      .catch(error => {
        console.log(error)
      })
  }
  
  useEffect(() => {
    const getTasks = async () => {
      await axios.get('https://pomodoro-app-backend-production.up.railway.app/v1/tasks-list/', {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        withCredentials: false,
      })
      .then(response => {
        setTaskList(convertTasks(response.data)); 
      })
      .catch(error => {
        console.log(error)
      })
    };

    getTasks(); 
  }, []);
  
  const handleTaskDescriptionChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { value } = event.target;
    setEditedTaskDescription(value); 
  };
  
  const handleDeleteTask = (index: number) => {
    // Removendo a tarefa da lista
    setTaskList(prevTaskList => prevTaskList.filter((_, i) => i !== index));
  };
  
 // Função para cancelar a edição da tarefa
  const handleCancelEdit = () => {
    // Limpando os dados da tarefa editada
    setEditedTaskName('');
    setEditedTaskDescription('');
  };
  

  

  return (
    <html lang="pt-BR">
      <body>
        <div className="container">
          <header>
            <div className="menu">
              <span><h1>Pomofocus</h1></span>
              <ul>
                <li><a role='button'>Report</a></li>
                <li><a role='button'>Settings</a></li>
                
                <li><a role='button' onClick={openRegisterDialog}>Sign In</a></li>
              </ul>
            </div>
          </header>
          <section>
            <div className="container">
              <div className="count-box">
                <div className="modes">
                  <button className='pomodoro-btn' onClick={handlePomodoroClick}>Pomodoro</button>
                  <button className='inter-curto' onClick={handleShortBreakClick}>Short Break</button>
                  <button className='inter-longo' onClick={handleLongBreakClick}>Long Break</button>
                </div>
                <span className="timer">
                  <TimerComponent initialValue={getInitialTime()} isActive={isTimerActive} isPaused={isTimerPaused} resetKey={resetKey} />
                </span>
                <div className="button-group">
                  <button className='start-btn' onClick={handleStartClick}>START</button>
                  <button className='pause-btn' onClick={handlePauseClick}>PAUSE</button>
                  <button className='next-time-btn' onClick={handleNextTimerClick}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="1.9rem" height="1.9rem" viewBox="0 0 24 24">
                      <path fill="currentColor" d="M5.536 21.886a1.004 1.004 0 0 0 1.033-.064l13-9a1 1 0 0 0 0-1.644l-13-9A1 1 0 0 0 5 3v18a1 1 0 0 0 .536.886"></path>
                    </svg>
                  </button>
                </div>
              </div>
              <div className="tasks-container">
                <div className="tasks-header">
                  <span>Tasks</span>
                  
                </div>
              </div>
              <div className="pomofocus-container">
                {taskList.map((task, index) => (
                    <div key={index} className="task-box">
                      <div className="task-name">{task.name}</div>
                      

                      <Dialog>
                        <DialogTrigger asChild>
                          <div className='last-item'>
                            <div className="task-turn">{task.turn}/4</div>
                            <Button variant="outline" className="add-task-btn">
                              <svg xmlns="http://www.w3.org/2000/svg" width="1.4em" height="1.4em" viewBox="0 0 24 24">
                                <path fill="currentColor" d="M10 10h4v4h-4zm0-6h4v4h-4zm0 12h4v4h-4z"></path>
                              </svg>
                            </Button>
                          </div>
                        </DialogTrigger>
                        <DialogContent className="dialog-content-custom">
                          <DialogHeader className="dialog-header-custom">
                            <DialogTitle>Edit Task</DialogTitle>
                            <DialogDescription>
                              Edit the task details here.
                            </DialogDescription>
                          </DialogHeader>
                          <form onSubmit={handleEditTask}>
                            <div className="grid gap-4 py-4">
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="taskName" className="text-right">
                                  Task Name
                                </Label>
                                <Input
                                  id="taskName"
                                  name="taskName"
                                  className="col-span-3 input-custom"
                                  value={task.name} // Use o valor atual da tarefa
                                  onChange={(e) => setEditedTaskName(e.target.value)} 
                                  required
                                />
                              </div>
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="taskDescription" className="text-right">
                                  Description
                                </Label>
                                <textarea
                                  id="taskDescription"
                                  name="taskDescription"
                                  value={task.description} // Use o valor atual da tarefa
                                  onChange={handleTaskDescriptionChange}
                                  className="col-span-3 input-custom"
                                  required
                                />
                              </div>
                            </div>
                            <DialogFooter>
                              <SheetFooter>
                                <SheetClose>
                                  <Button type="button" onClick={handleCancelEdit}>Cancel</Button>
                                </SheetClose>
                              </SheetFooter>
                              <Button type="button" onClick={() => handleDeleteTask(index)}>Delete</Button>
                              <Button type="submit">Save</Button>
                            </DialogFooter>
                          </form>
                        </DialogContent>
                      </Dialog>
                    </div>
                  ))}
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" className="add-task-btn">Add a New Task</Button>
                </DialogTrigger>
                <DialogContent className="dialog-content-custom">
                  <DialogHeader className="dialog-header-custom">
                    <DialogTitle>Add a New Task</DialogTitle>
                    <DialogDescription>
                      Diga alguma atividade a ser feita.  
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleNewTask}>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="taskName" className="text-right">
                          Nome da atividade:
                        </Label>
                        <Input
                          id="taskName"
                          name="taskName"
                          className="col-span-3 input-custom"
                          required
                        />
                        <Label htmlFor="description" className="text-right">
                          Descrição:
                        </Label>
                        <Input
                          id="description"
                          name="description"
                          className="col-span-3 input-custom"
                          required
                        />
                        <Label htmlFor="turns" className="text-right">
                          Quantidade de turnos:
                        </Label>
                        <Input
                          id="turns"
                          name="turns"
                          className="col-span-3 input-custom"
                          required
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <SheetFooter>
                        <SheetClose>
                        <Button type="button" onClick={handleCancelEdit} className='cancel-btn'>Cancel</Button>
                          <Button type="submit">Save</Button>
                        </SheetClose>
                      </SheetFooter>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>

              <Dialog open={showRegisterDialog} onOpenChange={setShowRegisterDialog}>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Cadastro</DialogTitle>
                    <DialogDescription>Digite seu email para se cadastrar</DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleEmailSubmit}>
                    <div className="form-grid">
                      <div className="form-row">
                        <Label htmlFor="email" className="text-right">
                          Email
                        </Label>
                        <Input 
                          id="email"
                          name="email"
                          type="string"
                          className="input"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button type="submit">Submit</Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </section>
        </div>
        <div className="pomofocus-container">
        </div>
      </body>
    </html>
  );
}