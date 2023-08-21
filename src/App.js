import React, { useState, useEffect, useRef } from "react";
import "./styles.css";
function App() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const loaderRef = useRef(null);

  const fetchData = async () => {
    setLoading(true);
    // Simulating an API call with a delay
    const response = await fetch(
      "https://data.cityofnewyork.us/resource/5uac-w243.json"
    );
    const newData = await response.json();

    setData((prevData) => [...prevData, ...newData]);
    setLoading(false);
    setPage((prevPage) => prevPage + 1);
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !loading) {
        fetchData();
      }
    });

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => {
      if (loaderRef.current) {
        observer.unobserve(loaderRef.current);
      }
    };
  }, [loading]);

  return (
    <div>
      <div className="card-container">
        {data.map((card, index) => (
          <div className="card" key={index}>
            <h2>{card.cmplnt_num}</h2>
            <p>{card.patrol_boro}</p>
          </div>
        ))}
      </div>
      {loading && <p>Loading...</p>}
      <div ref={loaderRef}></div>
    </div>
  );
}

export default App;
