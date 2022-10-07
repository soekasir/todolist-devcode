/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef, useState, useContext } from "react";
import {
  ActivityDto,
  apiCreateItem,
  apiDeleteItem,
  apiGetActivity,
  apiGetAllToDo,
  apiUpdateItem,
  CreateTodoDto,
  Priority,
  TodoDto,
} from "../../api";
import Layout from "../../components/Layouts/TodoAppLayout";
import { Sticky } from "../../components/Sticky";
import { getParameterByName } from "../../hooks";
import {
  Button,
  Grid,
  IconButton,
  Typography,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  Checkbox,
  Popover,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import { Link } from "react-router-dom";
import CircleIcon from "@mui/icons-material/Circle";
import {
  ISortAZ,
  ISortNewest,
  ISortOldest,
  ISortUnfinished,
  ISortZA,
  SortIcon,
} from "./icons";
import { IDelete } from "../../components/icons";
import { AlertDelete } from "../../components/Alert/AlertDelete";
import { NotifContext } from "../../context";

interface Data {
  activity: ActivityDto | null;
  items: TodoDto[] | null;
}

type TPriorityColor = {
  [key: string]: string;
};

const PriorityColor: TPriorityColor = {
  "very-high": "#ED4C5C",
  high: "#F8A541",
  medium: "#00A790",
  low: "#428BC1",
  "very-low": "#B01AFF",
};

const defaultForm = (activityId: string | null) => ({
  title: "",
  priority: "",
  activity_group_id: parseInt(activityId ?? "0"),
});

enum SortType{
  Newest="newest", Oldest="oldest", AZ="az", ZA="za", Unfinished="unfinished"
}

const sortItems=(items: TodoDto[],sortType:SortType)=>{
  // eslint-disable-next-line array-callback-return
  return items.sort((a,b)=>{
    if(sortType===SortType.Newest) return a.id>b.id?-1:1;
    if(sortType===SortType.Oldest) return a.id<b.id?-1:1;
    if(sortType===SortType.AZ) return a.title<b.title?-1:1;
    if(sortType===SortType.ZA) return a.title>b.title?-1:1;
    if(sortType===SortType.Unfinished) return a.is_active===1?-1:0;
    return 0;
  })
}

//http://localhost:3000/listitem?activity=676
const ListItem = () => {
  const [data, setData] = useState<Data>({
    activity: null,
    items: null,
  });
  const [isDialogAddOpen, setIsDialogAddOpen] = useState<boolean>(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const activityId = getParameterByName("activity");
  const open = !!anchorEl;
  const id = open ? "sort-popover" : undefined;
  const refForm = useRef<CreateTodoDto>(
    defaultForm(activityId) as CreateTodoDto
  );
  const [sortBy,setSortBy]=useState<SortType>(SortType.Newest);
  const notifContext=useContext(NotifContext)

  const fillItems = () => {
    if (activityId) {
      apiGetAllToDo(activityId).then((data) => {
        const sortedData=sortItems(data,sortBy)
        setData((prev) => ({ ...prev, items: sortedData }));
      });
    }
  };

  useEffect(()=>{
    setData((prev) => ({ ...prev, items: data.items ? sortItems(data.items,sortBy) : data.items }));
  },[sortBy])

  const handleClickSort = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleCloseSort = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    if (activityId) {
      Promise.all([apiGetActivity(activityId), apiGetAllToDo(activityId)]).then(
        (res) => {
          setData({
            activity: res[0],
            items: res[1],
          });
          console.log(res[1]);
        }
      );
    }
  }, [activityId]);

  const handleCheckBox = (id: number, is_active: boolean, index: number) => {
    apiUpdateItem(id, { is_active: !is_active }).then(() => {
      const newDataItems = data.items;
      if (newDataItems) {
        newDataItems[index].is_active = !is_active ? 1 : 0;
        setData((prev) => ({ ...prev, items: newDataItems }));
      }
    });
  };

  const handleDelete = () => {
    if (deleteId) {
      apiDeleteItem(deleteId).then(() => {
        setDeleteId(null);
        fillItems();
        notifContext?.setConfig({
          message:"item berhasil dihapus",
          open:true,
          type: "success"
        })
      });
    }
  };

  const handleSubmitForm = () => {
    apiCreateItem(refForm.current).then(() => {
      fillItems();
      setIsDialogAddOpen(false);
      refForm.current = defaultForm(activityId) as CreateTodoDto;
      notifContext?.setConfig({
        message:"berhasil menambahkan item",
        open:true,
        type: "success"
      })
    });
  };

  const getDeleteTitle = () => {
    let filtered=data.items?.filter((item) => item.id === deleteId);
    if(filtered && filtered[0]){
      return filtered[0].title
    }
    return ""
  };

  return (
    <Layout>
      <Dialog
        fullWidth
        open={isDialogAddOpen}
        onClose={() => setIsDialogAddOpen(false)}
      >
        <DialogTitle>Tambah List Item</DialogTitle>
        <DialogContent
          sx={{ display: "flex", flexDirection: "column", gap: 4 }}
        >
          <TextField
            required
            id="outlined-required"
            label="Tambahkan nama list item"
            onChange={(e) => {
              refForm.current.title = e.currentTarget.value;
            }}
          />
          <FormControl sx={{ width: 200 }}>
            <InputLabel id="demo-select-small">Priority</InputLabel>
            <Select
              labelId="demo-select-small"
              id="demo-select-small"
              label="Age"
              required
              onChange={(e) => {
                refForm.current.priority = e.target.value as Priority;
              }}
            >
              {Object.keys(PriorityColor).map((key) => {
                return (
                  <MenuItem value={key}>
                    <Grid container gap={1}>
                      <CircleIcon
                        style={{
                          color: PriorityColor[key],
                          height: 12,
                          width: 12,
                        }}
                      />
                      <Typography>
                        {key
                          .split("-")
                          .map(
                            (string) =>
                              string[0].toUpperCase() + string.substring(1)
                          )
                          .join(" ")}
                      </Typography>
                    </Grid>
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button
            color="primary"
            variant="contained"
            sx={{ borderRadius: 45, boxShadow: "none" }}
            onClick={handleSubmitForm}
          >
            Simpan
          </Button>
        </DialogActions>
      </Dialog>
      <AlertDelete
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        message={<>apakah anda yakin menghapus list item <br/> "{getDeleteTitle()}"?</>}
        onOk={handleDelete}
      />
      <Sticky>
        <Grid
          container
          justifyContent="space-between"
          p={1}
          style={{ backgroundColor: "#F4F4F4" }}
        >
          <Grid item display="flex" direction="row" alignItems="center">
            <Link to="/activity">
              <IconButton>
                <ArrowBackIosNewIcon />
              </IconButton>
            </Link>
            <Typography color="#111111" variant="h3">
              {data.activity?.title ?? "Title Activity"}
            </Typography>
          </Grid>
          <Grid item>
            <IconButton>
              <SortIcon onClick={handleClickSort} />
              <Popover
                id={id}
                open={open}
                anchorEl={anchorEl}
                onClose={handleCloseSort}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "left",
                }}
              >
                <Grid width={200}>
                  <Grid
                    container
                    direction="row"
                    gap={2}
                    className="btn"
                    style={{
                      borderRadius: "6px 6px 0px 0px",
                      border: "1px solid #E5E5E5",
                      backgroundColor: "#FFFFFF",
                      padding: 14,
                    }}
                    onClick={() => setSortBy(SortType.Newest)}
                  >
                    <ISortNewest />
                    <Typography>Terbaru</Typography>
                  </Grid>
                  <Grid
                    container
                    direction="row"
                    gap={2}
                    className="btn"
                    style={{
                      border: "1px solid #E5E5E5",
                      backgroundColor: "#FFFFFF",
                      padding: 14,
                    }}
                    onClick={() => setSortBy(SortType.Oldest)}
                  >
                    <ISortOldest />
                    <Typography>Terlama</Typography>
                  </Grid>
                  <Grid
                    container
                    direction="row"
                    gap={2}
                    className="btn"
                    style={{
                      border: "1px solid #E5E5E5",
                      backgroundColor: "#FFFFFF",
                      padding: 14,
                    }}
                    onClick={() => setSortBy(SortType.AZ)}
                  >
                    <ISortAZ />
                    <Typography>A-Z</Typography>
                  </Grid>
                  <Grid
                    container
                    direction="row"
                    gap={2}
                    className="btn"
                    style={{
                      border: "1px solid #E5E5E5",
                      backgroundColor: "#FFFFFF",
                      padding: 14,
                    }}
                    onClick={() => setSortBy(SortType.ZA)}
                  >
                    <ISortZA />
                    <Typography>Z-A</Typography>
                  </Grid>
                  <Grid
                    container
                    direction="row"
                    gap={2}
                    className="btn"
                    style={{
                      borderRadius: "0px 0px 6px 6px",
                      border: "1px solid #E5E5E5",
                      backgroundColor: "#FFFFFF",
                      padding: 14,
                    }}
                    onClick={() => setSortBy(SortType.Unfinished)}
                  >
                    <ISortUnfinished />
                    <Typography>Belum Selesai</Typography>
                  </Grid>
                </Grid>
              </Popover>
            </IconButton>
            <Button
              color="primary"
              variant="contained"
              sx={{ borderRadius: 45, boxShadow: "none" }}
              startIcon={<AddIcon />}
              onClick={() => setIsDialogAddOpen(true)}
            >
              Add
            </Button>
          </Grid>
        </Grid>
      </Sticky>
      <Grid container gap={3} mt="20px" direction="column">
        {data.items?.map((item, index) => {
          return (
            <Grid
              style={{
                boxShadow: "0px 6px 10px rgba(0, 0, 0, 0.1)",
                borderRadius: 12,
                padding: 24,
                display: "flex",
                flexDirection: "row",
                gap: 8,
                backgroundColor: "#FFFFFF",
              }}
            >
              <Grid display="flex" alignItems="center">
                <Checkbox
                  checked={!!!item.is_active}
                  onChange={() =>
                    handleCheckBox(item.id, !!item.is_active, index)
                  }
                />
              </Grid>
              <Grid display="flex" alignItems="center">
                <CircleIcon
                  style={{
                    color: PriorityColor[item.priority],
                    height: 12,
                    width: 12,
                  }}
                />
              </Grid>
              <Grid flexGrow={1} display="flex" alignItems="center">
                <Typography
                  color={!!item.is_active ? "#000000" : "#888888"}
                  style={{
                    textDecoration: !!item.is_active ? "none" : "line-through",
                  }}
                >
                  {item.title}
                </Typography>
              </Grid>
              <Grid display="flex" alignItems="center">
                <IconButton onClick={() => setDeleteId(item.id)}>
                  <IDelete />
                </IconButton>
              </Grid>
            </Grid>
          );
        })}
      </Grid>
    </Layout>
  );
};

export default ListItem;
