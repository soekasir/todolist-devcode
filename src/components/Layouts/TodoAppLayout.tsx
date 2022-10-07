import { Typography } from "@mui/material"
import { layoutWidth } from "../../styles/theme"

interface PLayout{
  children:React.ReactNode
}

const headerHeight=72;

const Layout:React.FC<PLayout>=(props)=>{
  return (
    <>
      <div style={{height:headerHeight,width:"100%",backgroundColor:"#16ABF8",boxShadow:"0px 4px 10px rgba(0, 0, 0, 0.1)"}}>
        <div style={{maxWidth:layoutWidth,margin:"auto",display:"flex",alignItems:"center",height:"100%"}}>
          <Typography variant="h1" textAlign="center" color="#FFFFFF">
            To Do List App
          </Typography>
        </div>
      </div>
      <div style={{maxWidth:layoutWidth,margin:"auto",padding:16}}>{props.children}</div>
    </>
  )
}

export default Layout