import React, { useCallback, useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { Button, Form } from 'react-bootstrap';
import './index.css';

const API_URL = 'https://api.unsplash.com/search/photos';
const IMAGES_PER_PAGE = 20;

const App = () => {
  const searchInput = useRef(null);
  const [images, setImages] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchImages = useCallback(async () => {
    try {
      if(searchInput.current.value) {
        setLoading(true);
        const { data } = await axios.get(
          `${API_URL}?query=${searchInput.current.value}&page=${page}&per_page=${IMAGES_PER_PAGE}&client_id=${process.env.REACT_APP_UNSPLASH}`
        )
        setLoading(false);
        setImages(data.results);
        setTotalPages(data.total_pages);
      }
    }
    catch(error) {
      setLoading(false);
      console.log(error)
    }
  }, [page])
  
  useEffect(() => {
    fetchImages();
  }, [fetchImages])

  const handleSearch = (event) => {
    event.preventDefault();
    resetSearch()
  }

  const handleSelection = (selection) => {
    searchInput.current.value = selection;
    resetSearch();
  }

  const resetSearch = () =>  {
    setPage(1);
    fetchImages()  
  }

  return (
    <div className='container'>
      <h1 className='title'>Image Search</h1>
      <div className='search-section'>
        <Form onSubmit={handleSearch}>
          <Form.Control 
            type='search'
            placeholder='Type something to search..'
            className='search-input'
            ref={searchInput}
          />
        </Form>
      </div>
      <div className='filters'>
        <div onClick={() => handleSelection('flair')}>flair</div>
        <div onClick={() => handleSelection('realme')}>realme</div>
        <div onClick={() => handleSelection('milton')}>milton</div>
        <div onClick={() => handleSelection('moto')}>moto</div>
      </div>
      {
        loading ? <p className='loading'>...Loading</p> : (
          <>
            <div className='images'>
              {
                images.map(image => (
                  <img 
                    key={image.id}
                    src={image.urls.small}
                    alt={image.alt_description}
                    className='image'
                  />
                ))
              }
            </div>
            <div className='buttons'>
              {page > 1 && <Button onClick={() => setPage(page - 1)}>Previous</Button>}
              {page < totalPages && <Button onClick={() => setPage(page + 1)}>Next</Button>}
            </div>
          </>
        )
      }
    </div>
  )
};

export default App;
