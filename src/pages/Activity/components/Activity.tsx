import { Grid, IconButton, Paper, Typography, useMediaQuery, useTheme } from "@mui/material"
import { ActivityDto } from "../../../api"
import { format } from "date-fns";
import { Link } from "react-router-dom";
import { layoutWidth } from "../../../styles/theme";
import { IDelete } from "../../../components/icons";

interface PActivity{
  data:ActivityDto,
  onDelete:()=>void
}

const Activity:React.FC<PActivity>=(props)=>{
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  return <Paper style={{width: isSmallScreen ? "100%" : layoutWidth/5, height: 140, padding: 16, borderRadius: 12}}>
    <Grid position="relative" display="flex" direction="column" justifyContent="space-between" width="100%" height="100%">
      <Grid item>
          <Link to={"/listitem?activity="+props.data.id} style={{textDecoration:"none"}}>
            <Typography color="#111111" variant="h6">
              {props.data.title}
            </Typography>
          </Link>
      </Grid>
      <Grid item container direction="row" alignItems="center" justifyContent="space-between" position="absolute" bottom={0}>
        <Grid item>
            <Typography color="#888888" variant="body1">
              {format(new Date(props.data.created_at),"dd MMMM yyyy")}
            </Typography>
        </Grid>
        <Grid item>
          <IconButton onClick={props.onDelete}>
            <IDelete/>
          </IconButton>
        </Grid>
      </Grid>
    </Grid>
  </Paper>
}

export default Activity