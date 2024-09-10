import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { getUsers } from "./friendSlice";

function AddFriend() {
  const [filterName, setFilterName] = useState("");
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getUsers({ filterName, page: page + 1, limit: rowsPerPage }));
  }, [filterName, page, rowsPerPage, dispatch]);

  return (
    <div>
      <h1>Add Friend</h1>
    </div>
  );
}

export default AddFriend;
