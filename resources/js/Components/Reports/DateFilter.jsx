import { useState } from 'react';
import { router } from '@inertiajs/react';

export default function DateFilter({ currentDate }) {
  const [date, setDate] = useState(currentDate);

  const handleDateChange = (e) => {
    const newDate = e.target.value;
    setDate(newDate);
    
    router.get(route(route().current()), { date: newDate }, {
      preserveState: true,
      preserveScroll: true,
      replace: true
    });
  };

  return (
    <div className="flex items-center gap-2">
      <label htmlFor="date" className="font-medium">Select Month:</label>
      <input
        type="month"
        id="date"
        value={date}
        onChange={handleDateChange}
        className="rounded-md border-gray-300"
      />
    </div>
  );
} 