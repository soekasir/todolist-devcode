import { Box, Button, Grid, Modal, TextField } from "@mui/material";
import { useContext, useRef } from "react";
import { apiCreateActivity } from "../../../api";
import { NotifContext } from "../../../context";
import AddIcon from "@mui/icons-material/Add";

const boxStyle = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "#FFF",
  boxShadow: 24,
  p: 2,
};

const ModalAddActivity = ({
  open,
  onClose,
  afterSubmit,
}: {
  open: boolean;
  onClose: () => void;
  afterSubmit: () => void;
}) => {
  const refForm = useRef({
    title: "",
  });
  const notifContext = useContext(NotifContext);

  const submit = () => {
    console.log(refForm.current);
    apiCreateActivity(refForm.current)
      .then(() => {
        afterSubmit();
      })
      .finally(() => {
        onClose();
        notifContext?.setConfig({
          message: "berhasil menambahkan activity",
          open: true,
          type: "success",
        });
      });
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={{ ...boxStyle, width: 200 }}>
        <Grid container gap={2}>
          <TextField
            required
            id="outlined-required"
            label="Title"
            onChange={(e) => {
              refForm.current.title = e.currentTarget.value;
            }}
          />
          <Button
            color="primary"
            variant="contained"
            sx={{ borderRadius: 45, boxShadow: "none" }}
            startIcon={<AddIcon />}
            onClick={submit}
          >
            create
          </Button>
        </Grid>
      </Box>
    </Modal>
  );
};

export default ModalAddActivity;
