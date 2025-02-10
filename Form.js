import React, { useState } from "react";

function Form() {
  const [name, setName] = useState("");

  return (
    <form>
      <input 
        type="text" 
        placeholder="Enter your name" 
        value={name} 
        onChange={(e) => setName(e.target.value)} 
      />
      <p>Your name: {name}</p>
    </form>
  );
}

export default Form;
