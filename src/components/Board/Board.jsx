import { useState, useEffect, useRef } from "react";
import "./Board.css";
import axios from "axios";

// unsplash API for fetching random images
const API = 'https://api.unsplash.com/search/photos';
const NUM_IMAGES = 12;
const accessKey = 'wvQcdbpjhl_qzitAkLI3NLpEnb_GMZQnl5bhxWiBi8k';

// default search query (for article topic)
const DEFAULT_QUERY = 'mountain';



function Board() {
    const [data, setData] = useState([])
    const [queryInput, setQueryInput] = useState("");
    const [query, setQuery] = useState(DEFAULT_QUERY);
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);
  
    // set up an effect to fetch data using the API on every rendering of App component
    useEffect( () => {
      let didCancel = false;
  
      const fetchData = async () => {
        setIsLoading(true);
        setIsError(false);
  
        const url = `${API}?count=${NUM_IMAGES}`;
        const options = {
          params: {
            query: query,
            per_page: NUM_IMAGES
          },
          headers: {
            Authorization: `Client-ID ${accessKey}` // Include your Access Key
          }
        };
  
        try {
          const response = await axios.get(url, options); 
          // store the data received from API call in component state
          if (!didCancel) setData(response.data.results);
          console.log("Received data: ", response.data)  
        } catch (error) {
          if (!didCancel) setIsError(true);
          console.log("API call failed. Error: ", error)  
        }
  
        // disable setLoading state after data received
        setIsLoading(false); 
      };
      
      fetchData();
  
      // return cleanup function
      return () => {
        didCancel = true;
      };
  
    }, [query]);
  
  
    const handleSubmit = (e) => {
      e.preventDefault();
      setQuery(queryInput);
      setQueryInput("");
      console.log("Submitted new query: ", queryInput);
    };
  
    const handleChange = (e) => {
      setQueryInput(e.target.value);
    };
  
    
    return (
      <>
        <form onSubmit={handleSubmit}>
          <label>
            Enter Search Query: 
            <input type="text" name="search" id="search" onChange={handleChange} value={queryInput} />
          </label>
          <button type="submit">Submit</button>
        </form>
  
        {isError ? (<div>Oops... something went wrong.</div>):
          ( <>
            <h4>Images Found for: "{query}"</h4>
            <ul>
              {isLoading? (<div>Loading...</div>):
              (data.map( (item) => 
                (<li key={item.id}>
                  <div className="card">
                    <img src={item.urls.small} /> 
                  </div>
                </li>)
              ))}
            </ul>
           
            </>)}
      </>
    );
  
}


export default Board;