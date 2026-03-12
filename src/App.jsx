import { useState, useEffect } from "react";
import "./App.css";

function App(){

  // fallback quotes if api fails
  const fallbackquotes=[
    {_id:"f1",content:"Stay hungry, stay foolish.",author:"Steve Jobs"},
    {_id:"f2",content:"Success usually comes to those who are too busy to be looking for it.",author:"Henry David Thoreau"},
    {_id:"f3",content:"Dream big and dare to fail.",author:"Norman Vaughan"},
    {_id:"f4",content:"Believe you can and you're halfway there.",author:"Theodore Roosevelt"},
    {_id:"f5",content:"The only limit to our realization of tomorrow is our doubts of today.",author:"Franklin D. Roosevelt"}
  ];

  const getrandomfallback=()=>fallbackquotes[Math.floor(Math.random()*fallbackquotes.length)];

  const [quote,setquote]=useState(getrandomfallback());
  const [loading,setloading]=useState(false);
  const [likedquotes,setlikedquotes]=useState([]);

  // load likes
  useEffect(()=>{
    const stored=JSON.parse(localStorage.getItem("likedquotes"))||[];
    setlikedquotes(stored);
  },[]);

  // save likes
  useEffect(()=>{
    localStorage.setItem("likedquotes",JSON.stringify(likedquotes));
  },[likedquotes]);

  // fetch quote
  const fetchquote=async()=>{
    setloading(true);
    try{
      const res=await fetch("https://api.quotable.io/random");
      if(!res.ok) throw new Error();
      const data=await res.json();
      setquote(data?.content?data:getrandomfallback());
    }catch{
      setquote(getrandomfallback());
    }
    setloading(false);
  };

  useEffect(()=>{fetchquote()},[]);

  // like toggle
  const togglelike=()=>{
    if(!quote) return;
    const exists=likedquotes.find(q=>q._id===quote._id);
    exists
      ? setlikedquotes(likedquotes.filter(q=>q._id!==quote._id))
      : setlikedquotes([...likedquotes,quote]);
  };

  const isliked=quote&&likedquotes.some(q=>q._id===quote._id);

  return(
    <div className="container">
      <h1 className="title"> Daily Motivation Dashboard</h1>
      <p className="like-count">❤️ Total Liked Quotes: {likedquotes.length}</p>

      <button className="btn" onClick={fetchquote} disabled={loading}>
        {loading?"Loading...":"New Quote"}
      </button>

      {loading && <p className="loading">Fetching inspiration...</p>}

      {quote && !loading && (
        <div className="quote-card">
          <h3 className="quote-text">"{quote.content}"</h3>
          <p className="author">— {quote.author}</p>
          <button className="like-btn" onClick={togglelike}>
            {isliked?"Unlike 💔":"Like ❤️"}
          </button>
        </div>
      )}

      <hr className="divider"/>

      <h2>❤️ Liked Quotes</h2>

      {likedquotes.length===0
        ? <p className="empty">No liked quotes yet.</p>
        : likedquotes.map(q=>(
            <div key={q._id} className="liked-quote">
              <p>"{q.content}"</p>
              <small>— {q.author}</small>
            </div>
          ))
      }
    </div>
  );
}

export default App;