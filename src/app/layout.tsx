"use client";
import React, { useState } from 'react';
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

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode; }>) {
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [isTimerPaused, setIsTimerPaused] = useState(false);
  const [resetKey, setResetKey] = useState(0);
  const [timerType, setTimerType] = useState('pomodoro');
  const [email, setEmail] = useState('');
  const [showRegisterDialog, setShowRegisterDialog] = useState(false);

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
    setResetKey(prevKey => prevKey + 1);
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

  const handleNewTask = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const taskName = formData.get('taskName') as string;
    console.log("New Task Added:", taskName);
  };

  const handleEmailSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log("Email submitted:", email);
    setShowRegisterDialog(false);
  };

  const openRegisterDialog = () => {
    setShowRegisterDialog(true);
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
                  <Popover>
                    <PopoverTrigger>
                      <div className='action-icon'>
                        <svg xmlns="http://www.w3.org/2000/svg" width="1.4em" height="1.4em" viewBox="0 0 24 24">
                          <path fill="currentColor" d="M10 10h4v4h-4zm0-6h4v4h-4zm0 12h4v4h-4z"></path>
                        </svg>
                      </div>
                    </PopoverTrigger>
                    <PopoverContent>Place content for the popover here.</PopoverContent>
                  </Popover>
                </div>
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
                          Task Name
                        </Label>
                        <Input
                          id="taskName"
                          name="taskName"
                          className="col-span-3 input-custom"
                          required
                        />
                        <div className="delete-btn">Delete</div>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button type="submit">Save</Button>
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
