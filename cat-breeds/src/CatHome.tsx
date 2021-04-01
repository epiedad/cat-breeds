import React, { useEffect, useState, useRef } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import DisplayCats from "./CatHomeSubComponents/DisplayCats";
import CatBreedOptions from "./CatHomeSubComponents/CatBreedOptions";

const CatHome = (props: any) => {
  const [catBreedsOptions, setCatBreedsOptions] = useState<
    ReturnType<typeof CatBreedOptions>
  >();
  const [pageCount, setPageCount] = useState(1);
  const [catResultLimit, setcatResultLimit] = useState(10);
  const [disabledLoadMoreBtn, setDisabledLoadMoreBtn] = useState(true);
  const [disabledBreedOptions, setDisabledBreedOptions] = useState(true);
  const [catList, setCatList] = useState<ReturnType<typeof DisplayCats>>();
  const [breed, setBreed] = useState("");
  const [loadingText, setLoadingText] = useState(true);
  const [markUp, setMarkUp] = useState([]);
  const [hideLoadMoreBtn, setHideLoadMoreBtn] = useState(false);
  const initialPageLoad = useRef(0);

  //Fetch all the cat breeds
  const showCatBreedOptions = async () => {
    setLoadingText(true);

    try {
      let fetchUrl = "https://api.thecatapi.com/v1/breeds";
      const catBreedResponse = await fetch(fetchUrl);

      if (catBreedResponse.ok) {
        setDisabledBreedOptions(false);
        setLoadingText(false);
        const catBreedsJson = await catBreedResponse.json();

        if (catBreedsJson) {
          setCatBreedsOptions(<CatBreedOptions listItems={catBreedsJson} />);
        }
      }
    } catch (error) {
      console.log("Failed to fetch the cat breeds API. Error was", error);
    }
  };

  //Load More
  const loadMore = () => {
    const inc = Number(pageCount + 1);
    setPageCount(inc);
    loadCats(breed, inc);
  };

  //Remove returned array object duplicates
  const removeDuplicates = (arrayObj: any) => {
    var obj: any = {};

    for (var i = 0, len = arrayObj.length; i < len; i++)
      obj[arrayObj[i]["id"]] = arrayObj[i];

    arrayObj.id = new Array();
    for (var key in obj) arrayObj.id.push(obj[key]);
    return arrayObj.id;
  };

  /*
    Load the cats base on some optional arguments: 
      id:string - this is the cat breed to display.
      newPageCount:number - this is used on 'Load More' button to show the page number.
      isNewBreed:boolean - wheter we need to load the a new cat breed or not.
  */
  const loadCats = async (
    id?: string,
    newPageCount?: number,
    isNewBreed?: boolean
  ) => {
    setLoadingText(true); //Sets the Loading

    try {
      const catDisplayResponse = await fetch(
        `https://api.thecatapi.com/v1/images/search?page=${
          newPageCount ? newPageCount : pageCount
        }&limit=${catResultLimit}&breed_id=${id ? id : breed}`
      );

      if (catDisplayResponse.ok) {
        //Display the JSON if we get response
        const catsJsonArr = await catDisplayResponse.json();

        if (catsJsonArr.length > 0) {
          setLoadingText(false);
          setDisabledLoadMoreBtn(false);
          let resultArr: any = [];

          //Check if we need to load a new breed
          if (isNewBreed) {
            resultArr = catsJsonArr;
            setCatList(null);
            setMarkUp([]);
          } else {
            //This is for the Load More where we need to join the previous and current results together
            resultArr = [...markUp, ...catsJsonArr];
          }

          //Removed duplicates from joined (array of objects)
          resultArr = removeDuplicates(resultArr);
          setMarkUp(resultArr);

          //We only display the results
          if (resultArr) {
            setCatList(<DisplayCats listItems={resultArr} />);

            if (markUp.length > 0) {
              //Find the duplicate base from the stored markUp and the currently fetch results.
              const foundDuplicate = markUp.find((cat: any) => {
                return cat.id === resultArr[resultArr.length - 1]["id"];
              });

              //Hide/Show 'Load More' button if we found a duplicate from the returned results.
              if (foundDuplicate) {
                setHideLoadMoreBtn(true);
              } else {
                setHideLoadMoreBtn(false);
              }
            }
          } else {
            //Hide if there's no return results
            setHideLoadMoreBtn(true);
          }
        } else {
          //Disable the 'Load More' button if the response returns empty
          setDisabledLoadMoreBtn(true);
          setCatList(null);
        }
      }
    } catch (error) {
      console.log("Failed to fetch cat API. Error was:", error);
    }
  };

  //Load/Display the breed of cats from the select option
  const onSelectChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    initialPageLoad.current++;
    let selectedBreed = e.target.value;
    if (selectedBreed.toLowerCase().indexOf("select") == 0) {
      //If option is "Select Breed"
      setCatList(null);
      setBreed("");
      setMarkUp([]);
      setHideLoadMoreBtn(false);
    } else if (selectedBreed && selectedBreed !== breed) {
      // We start a new breed to load if its a new breed selection
      setBreed(selectedBreed);
      setCatList(null);
      setMarkUp([]);
      setPageCount(1);
      loadCats(selectedBreed, 1, true);
    }
  };

  //Load/Set the cat breed from the URL param
  const loadBreedParams = () => {
    const urlParam = new URLSearchParams(window.location.search);
    const breedName = urlParam.get("breed");
    if (breedName) {
      setBreed(breedName);
      loadCats(breedName, 1, true);
    }
  };

  //Check if we need to load/display the cats from the URL param
  const checkBreed = () => {
    if (!breed && initialPageLoad.current == 1) {
      loadBreedParams();
    }
  };

  useEffect(() => {
    initialPageLoad.current++; //determines if the page has been reloaded (1) or not (1>)
    checkBreed();
    showCatBreedOptions();

    //Disable the Load More button if there's no breed
    if (breed) {
      setPageCount(1);
    } else {
      setDisabledLoadMoreBtn(true);
    }
  }, [breed]);

  return (
    <React.Fragment>
      <div className="Home">
        <Container>
          <h1>Cat Browser</h1>
          <Row style={{ padding: "10px 0px" }}>
            <Col md={3} sm={6} xs={12}>
              <Form.Group>
                <Form.Label htmlFor="breed">Breed</Form.Label>
                <Form.Control
                  as="select"
                  onChange={onSelectChange}
                  value={breed}
                  disabled={disabledBreedOptions}
                >
                  <option>Select Breed</option>
                  {catBreedsOptions}
                </Form.Control>
              </Form.Group>
            </Col>
          </Row>
          <Row>{catList}</Row>
          <Row>
            <Col md={3} sm={6} xs={12}>
              <Button
                variant="success"
                disabled={disabledLoadMoreBtn}
                onClick={loadMore}
                className={hideLoadMoreBtn ? "d-none" : ""}
              >
                {loadingText ? "Loading..." : "Load More"}
              </Button>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};
export default CatHome;
