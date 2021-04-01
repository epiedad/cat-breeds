import React, { FC, useRef } from "react";

interface CatOption {
  id: string;
  name: string;
}
interface CatListOptions {
  listItems?: Array<CatOption>;
}

const DisplayCatOptions: FC<CatListOptions> = ({ listItems }) => {
  const renderItem = useRef<Array<JSX.Element> | undefined>();
  if (listItems) {
    renderItem.current = listItems?.map((breed: any) => {
      return (
        <option key={breed.id} value={breed.id}>
          {breed.name}
        </option>
      );
    });
  }
  return <React.Fragment>{renderItem.current}</React.Fragment>;
};

export default DisplayCatOptions;
