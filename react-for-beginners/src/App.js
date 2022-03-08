import Button from "./Button";
import styles from "./App.module.css";
import { useEffect, useState } from "react";


function App() {

  const [counter, setCounter] = useState(0);
  const [keyword, setKeyword] = useState("");

  useEffect(() => {
    console.log("run once, call API")
  }, [])

  useEffect(() => {
    if (keyword != null && keyword !== "")
      console.log("SEARCH FOR", keyword);
  }, [keyword])


  const onClick = () => setCounter((counter) => counter + 1);
  const onChange = (event) => setKeyword(event.target.value);

  return (
    <div>
      <input onChange={onChange} value={keyword}/>
      <h1 className={styles.title}>{counter}</h1>
      <button onClick={onClick}>Click</button>
      <Button text={"Continue"} />
    </div>
  );
}

export default App;
