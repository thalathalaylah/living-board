import React from 'react';
import {TextField} from "@material-ui/core";
import Store from "electron-store";
import {useState} from "react";

const store = new Store();

const DailyStatus = () => {
  const initial = store.get("dailyStatus", "");
  const [dailyStatus, setDailyStatus] = useState(initial);

  return (
    <TextField
      required
      id="entry-status"
      multiline={true}
      rows="20"
      fullWidth={true}
      value={dailyStatus}
      onChange={(event) => {
        console.log('changed')
        setDailyStatus(event.target.value);
        store.set("dailyStatus", event.target.value);
      }}
    />
  )
}

export default DailyStatus;
