import { useState, useEffect, useRef } from "react";
import "./Board.css";
import axios from "axios";

// unsplash API for fetching random images
const API = 'https://api.unsplash.com/search/photos';
const NUM_IMAGES = 12;
const accessKey = 'wvQcdbpjhl_qzitAkLI3NLpEnb_GMZQnl5bhxWiBi8k';

// default search query (for article topic)
const DEFAULT_QUERY = 'mountain';



export default function Board() {
    const [data, setData] = useState([])
    const [queryInput, setQueryInput] = useState("");
    const [query, setQuery] = useState(DEFAULT_QUERY);
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);
    const [currentScore, setCurrentScore] = useState(0);
    const [bestScore, setBestScore] = useState(0);
    let imageSelectedRef = useRef({});
    
    // console.log("Images selected: ", imageSelectedRef.current);

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
          if (!didCancel) {
            const images = response.data.results; 
            setData(images);
            // console.log("Received data: ", response.data)
            images.forEach(item => {
              imageSelectedRef.current[item.id] = false;
            });

        }  
        } catch (error) {
          if (!didCancel) {
            setIsError(true);
            console.log("API call failed. Error: ", error);
          }  
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

    const handleImageClick = (item, index) => {
      console.log(`Clicked on image#${index} with id ${item.id}`);
      
      // reset game if this image has already been selected
      if (imageSelectedRef.current[item.id]) {
        setBestScore(Math.max(bestScore, currentScore));
        setCurrentScore(0);
        for (let id in imageSelectedRef.current){
          imageSelectedRef.current[id] = false;
        }
        console.log("Game over!");
      } else {
        setCurrentScore(currentScore+1);
        imageSelectedRef.current[item.id] = true;
      }
      
      // console.log("Images selected: ", imageSelectedRef.current);

      // shuffle the images
      shuffle(data);
      setData([...data]);
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
            <h4>Current Score - {currentScore}</h4>
            <h4>Best Score - {bestScore}</h4>
            <ul>
              {isLoading? (<div>Loading...</div>):
              (data.map( (item, index) => 
                (<li key={item.id}>
                  <div className="card">
                    <img src={item.urls.small} onClick={(event) => {handleImageClick(item, index)}}/> 
                  </div>
                </li>)
              ))}
            </ul>
           
            </>)}
      </>
    );
  
}


// helper function for random shuffling of images array
function shuffle(array) {
  let currentIndex = array.length;

  // While there remain elements to shuffle...
  while (currentIndex != 0) {
    // Pick a remaining element...
    let randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }
}














