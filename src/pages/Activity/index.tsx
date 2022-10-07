import { Button, Grid, Typography, useMediaQuery, useTheme } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { ActivityDto, apiDeleteActivity, apiGetAllActivity } from "../../api";
import Activity from "./components/Activity";
import AddIcon from "@mui/icons-material/Add";
import Layout from "../../components/Layouts/TodoAppLayout";
import { Sticky } from "../../components/Sticky";
import ModalAddActivity from "./components/ModalAddActivity";
import { AlertDelete } from "../../components/Alert/AlertDelete";
import { NotifContext } from "../../context";

import emptyPng from'../../components/icons/empty.png';

const ActivityDashboard = () => {
  const [activities, setActivities] = useState<ActivityDto[] | null>(null);
  const [isModalAddOpen, setIsModalAddOpen] = useState<boolean>(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const notifContext=useContext(NotifContext)
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const fillActivities = () => {
    apiGetAllActivity().then((data) => {
      setActivities(data);
    });
  };

  useEffect(() => {
    fillActivities();
  }, []);

  const handleDelete = () => {
    if (deleteId) {
      apiDeleteActivity(deleteId).then(()=>{
        setDeleteId(null);
        fillActivities();
        notifContext?.setConfig({
          message:"activity berhasil dihapus",
          open:true,
          type: "success"
        })
      })
    }
  };

  const getDeleteTitle = () => {
    let filtered=activities?.filter((item) => item.id === deleteId);
    if(filtered && filtered[0]){
      return filtered[0].title
    }
    return ""
  };

  return (
    <Layout>
      <ModalAddActivity
        open={isModalAddOpen}
        onClose={() => setIsModalAddOpen(false)}
        afterSubmit={() => {
          fillActivities();
        }}
      />
      <AlertDelete
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        message={
          <>
            apakah anda yakin menghapus activity <br /> "{getDeleteTitle()}"?
          </>
        }
        onOk={handleDelete}
      />
      <Sticky>
        <Grid
          container
          justifyContent="space-between"
          p={1}
          style={{ backgroundColor: "#F4F4F4" }}
        >
          <Grid item data-cy="header-title">
            <Typography color="#111111" variant="h3">
              Activity
            </Typography>
          </Grid>
          <Grid item>
            <Button
              color="primary"
              variant="contained"
              sx={{ borderRadius: 45, boxShadow: "none" }}
              startIcon={<AddIcon />}
              onClick={() => setIsModalAddOpen(true)}
            >
              Add
            </Button>
          </Grid>
        </Grid>
      </Sticky>
      <Grid container gap={3} mt="40px">
        {!!activities &&
          activities.map((data) => {
            return (
              <Activity
                data={data}
                onDelete={()=>setDeleteId(data.id)}
              />
            );
          })}
        {
          activities && !activities[0] && <img alt="empty activity" width={isSmallScreen?"100%":undefined} src={emptyPng}></img>
        }
      </Grid>
    </Layout>
  );
};

export default ActivityDashboard;
