import React, { useState, useEffect } from 'react';
import './index.css';

function App() {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [plData, setPlData] = useState({});
  const [theme, setTheme] = useState('dark');

  useEffect(() => {
    const data = localStorage.getItem('ceePLData');
    if (data) setPlData(JSON.parse(data));
  }, []);

  useEffect(() => {
    localStorage.setItem('ceePLData', JSON.stringify(plData));
  }, [plData]);

  const daysInMonth = new Date(year, month+1, 0).getDate();

  const handlePLChange = (day) => {
    const value = prompt(`Enter P&L for ${month+1}/${day}/${year} (use - for loss):`);
    if (value !== null) {
      const num = parseFloat(value);
      setPlData({...plData, [`${year}-${month+1}-${day}`]: num});
    }
  };

  const resetData = () => {
    if (window.confirm("Clear all P&L data?")) setPlData({});
  }

  const toggleTheme = () => setTheme(theme==='dark'?'light':'dark');

  const getPL = (day) => {
    const key = `${year}-${month+1}-${day}`;
    return plData[key];
  }

  const monthNames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

  return (
    <div className={theme==='dark'?'bg-gray-900 text-white min-h-screen':'bg-gray-100 text-gray-900 min-h-screen'}>
      <header className="p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Cee's Trading P&L Calendar</h1>
        <div className="flex gap-4">
          <select value={month} onChange={e=>setMonth(parseInt(e.target.value))} className="text-black">
            {monthNames.map((m,i)=> <option key={i} value={i}>{m}</option>)}
          </select>
          <select value={year} onChange={e=>setYear(parseInt(e.target.value))} className="text-black">
            {Array.from({length:10},(_,i)=>today.getFullYear()-5+i).map(y=> <option key={y} value={y}>{y}</option>)}
          </select>
          <button onClick={toggleTheme} className="px-3 py-1 rounded bg-neon text-black">{theme==='dark'?'Light':'Dark'} Mode</button>
          <button onClick={resetData} className="px-3 py-1 rounded bg-red-600">Reset</button>
        </div>
      </header>
      <table className="table-auto border-collapse border border-gray-500 mx-auto mt-6">
        <thead>
          <tr>
            {["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].map(d=> <th key={d} className="border border-gray-400 px-4 py-2">{d}</th>)}
          </tr>
        </thead>
        <tbody>
  {Array.from({length:3},(_,row)=>{
    return <tr key={row}>
      {Array.from({length:10},(_,col)=>{
        const dayNum = row*10 + col + 1;
        if(dayNum > daysInMonth) return <td key={col} className="border border-gray-400 w-20 h-16"></td>;
        const pl = getPL(dayNum);
        const bg = pl==null ? '' : pl>=0 ? 'bg-green-600/30' : 'bg-red-600/30';
        return (
          <td key={col} className={`border border-gray-400 w-20 h-16 cursor-pointer ${bg} flex items-center justify-center`}
              onClick={()=>handlePLChange(dayNum)}>
            {pl!=null ? (pl>=0?'+':'')+'$'+pl.toFixed(2) : dayNum}
          </td>
        )
      })}
    </tr>
  })}
</tbody>
      </table>
    </div>
  );
}

export default App;

