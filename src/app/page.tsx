"use client"

import Image from "next/image";
import styles from "./page.module.css";
import { useState, useActionState} from "react";

export default function Home() {
  const [getter, setter] = useState('')

  function onChange(event: any) {
    const value = event.target.value
    setter(value)
  }

  return (
    <div className={styles.button}>
      <p>asd</p>
      <br/>
      학년
      <br/>
      <input onChange={} /> <br/>
      <select className={}
      전체 학과

      <select className={styles.names}>
        <option value="dog">Dog</option>
        <option value="cat">Cat</option>
        <option value="hamster">Hamster</option>
        <option value="parrot">Parrot</option>
        <option value="spider">Spider</option>
        <option value="goldfish">Goldfish</option>
        </select><br/>
      <input onChange={onChange} /> <br/>
      ㅇㅇ학과<br/>
      <button>이전</button>
      <button className={styles.next_button}>다음</button>
    </div>
  );
}