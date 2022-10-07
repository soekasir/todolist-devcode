import { Button, Grid, Modal, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { IAlertDelete } from "../icons";

const boxStyle = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "#FFF",
  boxShadow: 24,
  p: 2,
  borderRadius: "12px",
};

export const AlertDelete = ({
  message,
  open,
  onClose,
  onOk,
}: {
  message: any;
  open: boolean;
  onClose: () => void;
  onOk: () => void;
}) => {
  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={{ ...boxStyle, width: 400 }}>
        <Grid
          container
          gap={4}
          justifyContent="center"
          direction="column"
          p={3}
        >
          <Grid style={{ margin: "auto" }}>
            <IAlertDelete />
          </Grid>
          <Grid style={{ margin: "auto" }}>
            <Typography textAlign="center">{message}</Typography>
          </Grid>
          <Grid item container gap={2} justifyContent="center">
            <Button
              variant="contained"
              color="error"
              onClick={onClose}
              style={{ borderRadius: 45, boxShadow: "none", width: 100 }}
            >
              Batal
            </Button>
            <Button
              onClick={onOk}
              variant="contained"
              style={{
                color: "#4A4A4A",
                backgroundColor: "#F4F4F4",
                borderRadius: 45,
                boxShadow: "none",
                width: 100
              }}
            >
              Hapus
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Modal>
  );
};
