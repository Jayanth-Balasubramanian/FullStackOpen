
export const PersonForm = ({handleNameChange, handleNumberChange, handleSubmit}) => (
    <form>
      <div>
        name: <input onChange={handleNameChange}/>
      </div>
      <div>number: <input onChange={handleNumberChange}/></div>
      <div>
        <button type="submit" onClick={handleSubmit}>add</button>
      </div>
    </form>
)