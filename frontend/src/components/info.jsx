import { useEffect } from "react";

const Info = ({loadPopup}) => {
  useEffect(() => {
    console.log(loadPopup);
  }, [loadPopup])
}

export default Info;