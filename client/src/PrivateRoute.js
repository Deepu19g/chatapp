import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import ChatLanding from "./ChatLanding";
import MobileLanding from "./MobileLanding";

function PrivateRoute() {
  const [isDesktop, setDesktop] = useState(window.innerWidth > 576);
  useEffect(() => {
    window.addEventListener("resize", updateMedia);
    return () => window.removeEventListener("resize", updateMedia);
  }, []);

  const updateMedia = () => {
    setDesktop(window.innerWidth > 576);
  };

  let { email } = useParams();

  console.log(isDesktop);
  return (
    <div>
      {isDesktop && (window.innerWidth > window.innerHeight) ? (
        <ChatLanding email={email}></ChatLanding>
      ) : (
        <MobileLanding email={email}></MobileLanding>
      )}
    </div>
  );
}

export default PrivateRoute;
