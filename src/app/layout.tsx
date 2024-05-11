import './globals.css';

let timer = new Date().getMinutes();

export const metadata = {
  title: "Pomofocus",
  description: "Uma rede social para devs",
  time: '25:00'
};

export default function RootLayout({
  children,
}: Readonly<{children: React.ReactNode;}>) {
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
              <li><a role='button'>Login</a></li>
              <li><a role='button'>Sign In</a></li>
            </ul>
          </div>
        </header>
        <section>
          <div className="container">
            <div className="count-box">
              <div className="modes">
                <button>Pomodoro</button>
                <button>Short Break</button>
                <button>Long Break</button>
              </div>
              <span className="timer">
                {metadata.time}
              </span>
              <button className='start-btn'>START</button>
            </div>
            <div className="tasks-container">
              <div className="tasks-header">
                  <span>Tasks</span>

              </div>
            </div>
            <button className='new-task'>
              Add Task
            </button>
          </div>
        </section>
        </div>

        <div className="pomofocus-container">

        </div>
      </body>
    </html>
  );
}
