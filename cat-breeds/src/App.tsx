import React from "react";
import { Switch, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import CatDetails from "./CatDetails";
import CatHome from "./CatHome";

function App() {
  const renderCatDetails = (props: any) => {
    return <CatDetails {...props} />;
  };
  return (
    <React.Fragment>
      <div className="App">
        <Switch>
          <Route exact={true} path="/" component={CatHome} />
          <Route path="/:breedid" render={renderCatDetails} />
        </Switch>
      </div>
    </React.Fragment>
  );
}
export default App;
