import React, { useEffect, useRef, useState } from 'react';
import {AppBar, Tab, Tabs} from "@material-ui/core";
import {TabPanel, TabContext} from "@material-ui/lab";
import Store from "electron-store";
import DailyStatus from "./pages/dailyStatus";
import { shell } from "electron";

const store = new Store();
const initial = store.get("selectedTab", "daily_status") as string;
const storedScrapboxRoot = store.get("scrapboxRoot", "") as string;
const storedScrapboxInitial = store.get("scrapboxInitial", "") as string;

const App: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState(initial);
  let value = selectedTab;

  const [scrapboxRoot, setScrapBoxRoot] = useState(storedScrapboxRoot);
  let scrapboxRootValue = scrapboxRoot;

  const [scrapboxInitial, setScrapboxInitial] = useState(storedScrapboxInitial);
  let scrapboxInitialValue = scrapboxInitial;

  const taskchuteView = useRef<HTMLWebViewElement>(null);
  const scrapboxView = useRef<HTMLWebViewElement>(null);

  useEffect(() => {
    const openExternal = (webview: HTMLWebViewElement | null ) => {
      if (webview != null) {
        webview.addEventListener('new-window', (e: any) => {
          shell.openExternal(e.url);
        });
      }
    }
    openExternal(taskchuteView.current);
    openExternal(scrapboxView.current);
  })

  const handleChange = (event: React.ChangeEvent<{}>, value: any) => {
    store.set("selectedTab", value);
    setSelectedTab(value);
  }

  const handleRootChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    store.set("scrapboxRoot", event.target.value);
    setScrapBoxRoot(event.target.value);
  }

  const handleInitialChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    store.set("scrapboxInitial", event.target.value);
    setScrapboxInitial(event.target.value);
    console.log(encodeURI(event.target.value));
  }

  const style = {
    width: "100%",
    height: "100%",
    minHeight: "890px"
  }

  return (
    <div className="App">
      <TabContext value={value}>
        <AppBar position="static">
          <Tabs value={value} onChange={handleChange} aria-label="simple tabs example">
            <Tab label={"DailyStatus"} value="daily_status"/>
            <Tab label={"Taskchute"} value="taskchute"/>
            <Tab label={"Scrapbox"} value="scrapbox"/>
          </Tabs>
        </AppBar>
        <TabPanel value="daily_status">
          <DailyStatus />
        </TabPanel>
        <TabPanel value="taskchute">
          <webview ref={taskchuteView} src="https://taskchute.cloud/tasks" style={style} />
        </TabPanel>
        <TabPanel value="scrapbox">
          <div>Root Url: <input size={50} value={scrapboxRootValue} onChange={handleRootChange} /></div>
          <div>Initial Page: <input size={50} value={scrapboxInitialValue} onChange={handleInitialChange} /></div>
          <webview ref={scrapboxView} src={"https://scrapbox.io/" + scrapboxRoot + "/" + encodeURIComponent(scrapboxInitialValue)} style={style} />
        </TabPanel>
      </TabContext>
    </div>
  );
};

export default App;
