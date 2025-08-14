"use client"

import axios from "@/api/axios"
import { useEffect } from "react"

export default function TestPage() {
  useEffect(() => {
    connectServer()
  }, [])

  async function connectServer() {
    try {
      await axios.get("/api/health")
      console.log("서버 연결 성공")
    } catch (error) {
      console.error("서버 연결 실패:", error)
      alert("서버 연결 실패. 콘솔을 확인하세요.")
      return
    }
  }

  return (
    <div>
      <h1>서버 연결 테스트</h1>
    </div>
  )
}
