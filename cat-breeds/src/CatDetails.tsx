import React, { FC, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { Container } from "react-bootstrap";

interface CatProps {
  history: any;
  match: any;
}

const CatDetails: FC<CatProps> = (props) => {
  const [catDetail, setCatDetail] = useState<Array<JSX.Element>>();
  const [hideLoading, sethideLoading] = useState(false);
  const [noCatFound, setNoCatFound] = useState<JSX.Element>();
  const history = useHistory();

  const onClickGoback = () => {
    history.goBack();
  };

  const getCatDetail = async () => {
    try {
      const catResponse = await fetch(
        `https://api.thecatapi.com/v1/images/${props.match.params.breedid}`
      );
      let notFound = () => {
        return (
          <div className="col-12" style={{ marginBottom: "20px" }}>
            No cats available
          </div>
        );
      };
      if (catResponse.ok) {
        const catResponseJson = await catResponse.json();
        if (catResponseJson) {
          sethideLoading(true);
          const catBreed = catResponseJson.breeds;
          const getCatDetail = catBreed.map((cat: any) => {
            return (
              <div className="card">
                <div className="card-header">
                  <a
                    className="btn btn-primary"
                    href={"/?breed=" + cat.id}
                    onClick={onClickGoback}
                  >
                    Back
                  </a>
                </div>
                <img className="card-img" src={catResponseJson.url} />
                <div className="card-body">
                  <h4>{cat.name}</h4>
                  <h5>Origin: {cat.origin}</h5>
                  <h6>{cat.temperament}</h6>
                  <p>{cat.description}</p>
                </div>
              </div>
            );
          });
          setCatDetail(getCatDetail);
        }
      } else {
        setNoCatFound(notFound);
      }
    } catch (error) {
      console.log("There was an error. Error was", error);
    }
  };
  useEffect(() => {
    getCatDetail();
  }, []);
  return (
    <React.Fragment>
      <div className="Cat">
        <Container>
          <h4 className={hideLoading ? "d-none" : ""}>Loading...</h4>
          {catDetail}
          {noCatFound}
        </Container>
      </div>
    </React.Fragment>
  );
};
export default CatDetails;
