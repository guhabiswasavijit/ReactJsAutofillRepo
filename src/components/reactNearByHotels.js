import React, { useState, useEffect } from 'react';
import '../App.css'
import { ReactSearchAutocomplete } from 'react-search-autocomplete'
import axios from "axios";
import ReactDOM from 'react-dom';

function HotelsAutoFill() {
  const [items, setDisplayData] = useState([]);
  const config = {
    shouldSort : true,
    threshold : 0.6,
    distance: 100,
    minMatchCharLength: 1,
    keys : ["title"]
  };
  const SOLR_SERVICE_URL = 'http://localhost:9090/services/hotels/fetchArticle/';
  const SEARCH_SERVICE_URL = 'http://localhost:9090/services/hotelsAutoFill/fetchAllHotelsWithStartingName/';

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(function(position) {
              axios.post('http://localhost:9090/services/hotelsAutoFill/fetchHotels',{
                "lat" : position.coords.latitude,
                "lng" : position.coords.longitude,
                "inAndAroundRadius": 10
            }).then(response => {
                console.log("got nearby hotels:",response.data);
                setDisplayData(response.data.map(
                    (row)=>{ 
                            return {"name" : row.name,
                                    "title" : row.title
                          };
                    }
                ))
            }).catch(err => {
                console.log("error in request", err);
            });
          })
          
  },[])
  const handleOnSearch = (srchStr) => {
    console.log("Called handleOnSearch:"+srchStr)
        axios.get(SEARCH_SERVICE_URL+srchStr).then(response => {
          console.log("got nearby hotels:",response.data);
          setDisplayData(response.data.map(
              (row)=>{ 
                      return {"name" : row.name,
                              "title" : row.title
                    };
              }
          ))
      }).catch(err => {
          console.log("error in request", err);
      });

  }

  const handleOnHover = (item) => {
    console.log("Called handleOnHover")
    return <div>{item.name}</div>;
  }

  const handleOnSelect = (item) => {
    console.log("Called handleOnSelect"+item.title)
    axios.post(SOLR_SERVICE_URL+item.title)
        .then(response => {
            console.log("Setting Html:"+ response.data);
            const HtmlToReactParser = require('html-to-react').Parser;
            let htmlToReactParser = new HtmlToReactParser();
            let reactElement = htmlToReactParser.parse(response.data); 
            ReactDOM.render(reactElement,document.getElementById("solrSearchData"));
        })
        .catch(error => {
            console.error('There was an error!', error);
        });
  }

  const handleOnFocus = () => {
    console.log("Called handleOnFocus")
  }

  const formatResult = (item) => {
    return <p className='largeText'>{item}</p>

  }
  return (
  <span>
      <div className="App">
        <header className="App-header">
          <div style={{ width: 400 }}>
            <ReactSearchAutocomplete
              items={items}
              fuseOptions={config}
              resultStringKeyName="title"
              inputDebounce= {1000}
              onSearch={handleOnSearch}
              onHover={handleOnHover}
              onSelect={handleOnSelect}
              onFocus={handleOnFocus}
              autoFocus
              formatResult={formatResult}
            />
          </div>
        </header>
      </div>
      <div id="solrSearchData"></div>
    </span>
  )
}
export default HotelsAutoFill