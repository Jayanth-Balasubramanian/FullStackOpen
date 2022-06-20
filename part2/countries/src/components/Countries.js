export const Countries = ({ countries, setCountry }) => {
  return (
      countries.map(country => <p key={country.name.common}> {country.name.common}
        <button onClick={() => setCountry([country])}> show </button> </p> )
  )
}
