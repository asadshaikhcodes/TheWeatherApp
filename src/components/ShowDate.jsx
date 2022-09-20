import React, { useEffect, useState } from "react";

function ShowDate() {
  const [date, setDate] = useState();
  const [hour, setHour] = useState();

  useEffect(() => {
    const setHourTimer = setTimeout(
      () => setHour(new Date().toLocaleTimeString()),
      1000
    );
    // console.log(setHourTimer);
    return () => {
      console.log("set hour cleanup called");
      clearTimeout(setHourTimer);
    };
  });
  useEffect(() => {
    setDate(new Date().toDateString());
    return () => {
      console.log("set date cleanup called");
    };
  }, []);
  return (
    <div>
      <h3>{date}</h3>
      <h3>{hour}</h3>
    </div>
  );
}

export default ShowDate;
