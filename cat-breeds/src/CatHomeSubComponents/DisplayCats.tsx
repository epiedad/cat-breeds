import React, { FC, useRef } from "react";
import { Col } from "react-bootstrap";

interface CatItem {
  id: string;
  url: string;
}
interface CatItems {
  listItems?: Array<CatItem>;
}

const DisplayCats: FC<CatItems> = ({ listItems }) => {
  const renderItem = useRef<Array<JSX.Element> | undefined>();
  if (listItems) {
    renderItem.current = listItems?.map((cat: any) => {
      return (
        <Col md={3} sm={6} xs={12} key={cat.id}>
          <div className="card">
            <img className="card-img-top" src={cat.url}></img>
            <div className="card-body">
              <a className="btn btn-primary btn-block" href={"/" + cat.id}>
                View Details
              </a>
            </div>
          </div>
        </Col>
      );
    });
  } else {
    return (
      <div className="col-12" style={{ marginBottom: "20px" }}>
        No cats available
      </div>
    );
  }

  return <React.Fragment>{renderItem.current}</React.Fragment>;
};

export default DisplayCats;
