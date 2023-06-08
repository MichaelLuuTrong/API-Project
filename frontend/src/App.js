import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Route, Switch } from "react-router-dom";
import * as sessionActions from "./store/session";
import Navigation from "./components/Navigation";

import SpotsIndex from "./components/SpotsIndex"
import SpotPage from "./components/SpotPage"
import CreateSpot from "./components/CreateSpot"
import ManageSpots from "./components/ManageSpots"

function App() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => setIsLoaded(true));
  }, [dispatch]);

  return (
    <>
      <Navigation isLoaded={isLoaded} />
      {isLoaded && <Switch>
        <Route exact path="/" component={SpotsIndex} />
        <Route exact path="/spots/new" component={CreateSpot} />
        <Route exact path="/spots/current" component={ManageSpots} />
        <Route exact path="/spots/:spotId" component={SpotPage} />
      </Switch>}
    </>
  );
}

export default App;
