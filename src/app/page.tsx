"use client";
import Image from "next/image"
import styles from "./page.module.css"
import { TextField, Select ,MenuItem, Button, Stack} from "@mui/material"
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';

export default function Home() {
  return (
    <div style={{
      height: '100vh'
    }}>
    <TextField id="outlined-basic" label="Outlined" variant="outlined" />
    <TextField id="filled-basic" label="Filled" variant="filled" />
    <TextField id="standard-basic" label="Standard" variant="standard" />

    <Select value="1" >
      <MenuItem value="1">메뉴1</MenuItem>
      <MenuItem>메뉴2</MenuItem>
      <MenuItem>메뉴3</MenuItem>
    </Select>
      
      <Stack direction="row" gap="12px" p="12px" overflow="scroll" maxHeight="600px">
        <button
          style={{
            border: '1px solid blue',
            backgroundColor: 'white',
            padding: '8px',
            color: 'blue',
            fontSize: '12px'
          }}
        >일반적인 버튼</button>
        <Button variant="outlined">MUI 버튼</Button>
        <Button variant="outlined">MUI 버튼</Button>
        <Button variant="outlined">MUI 버튼</Button>
        <Button variant="outlined">MUI 버튼</Button>
        <Button variant="outlined">MUI 버튼</Button>
        <Button variant="outlined">MUI 버튼</Button>
        <Button variant="outlined">MUI 버튼</Button>
        <Button variant="outlined">MUI 버튼</Button>
        <Button variant="outlined">MUI 버튼</Button>
        <Button variant="outlined">MUI 버튼</Button>
        <Button variant="outlined">MUI 버튼</Button>
        <Button variant="outlined">MUI 버튼</Button>
        <Button variant="outlined">MUI 버튼</Button>
        <Button variant="outlined">MUI 버튼</Button>
        <Button variant="outlined">MUI 버튼</Button>
        <Button variant="outlined">MUI 버튼</Button>
        <Button variant="outlined">MUI 버튼</Button>
        <Button variant="outlined">MUI 버튼</Button>
        <Button variant="outlined">MUI 버튼</Button>
        <Button variant="outlined">MUI 버튼</Button>
        <Button variant="outlined">MUI 버튼</Button>
        <Button variant="outlined">MUI 버튼</Button>
        <Button variant="outlined">MUI 버튼</Button>
        <Button variant="outlined">MUI 버튼</Button>
        <Button variant="outlined">MUI 버튼</Button>
        <Button variant="outlined">MUI 버튼</Button>
        <Button variant="outlined">MUI 버튼</Button>
        <Button variant="outlined">MUI 버튼</Button>
        <Button variant="outlined">MUI 버튼</Button>
        <Button variant="outlined">MUI 버튼</Button>
        <Button variant="outlined">MUI 버튼</Button>
        <Button variant="outlined">MUI 버튼</Button>
        <Button variant="outlined">MUI 버튼</Button>
      </Stack>
      
      <Card variant="outlined" sx={{
        margin: '12px',
        padding: '12px'
      }}>content</Card> 
   </div>
  )
}
