import {useEffect, useState} from "react";
import axios from "axios";
import {Country} from "./components/Country";
import {Countries} from "./components/Countries";
import {Filter} from "./components/Filter";

function App() {
  const [countries, setCountries] = useState([])
  const [display, setDisplay] = useState([])

  const fetchData = () => {
    axios.get('https://restcountries.com/v3.1/all').then(response => setCountries(response.data))
  }

  useEffect(() => {
    fetchData()
  }, []);

  const handleCountryChange = e => {
    const filteredCountries = countries
        .filter(country => country.name.common.toLowerCase()
        .includes(e.target.value.toLowerCase()))
    setDisplay(filteredCountries)
  }


  return (
    <div className="App">
      <Filter handleCountryChange={handleCountryChange} />
      {
        display.length > 10? <p> Too many matches, specify another filter </p>:
            display.length === 1? <Country country={display[0]} />:
                <Countries countries={display} setCountry={setDisplay} />
      }
    </div>
  );
}

export default App;
