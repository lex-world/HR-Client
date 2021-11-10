import React from "react";
import "./style.scss";

import Webcam from "react-webcam";
import { Button } from "@mui/material";

import { getFullFaceDescription, loadModels } from "../../API/face";

import FacialImg from "../../assets/images/facial.jpg";

const videoConstraints = {
  width: 1280,
  height: 720,
  facingMode: "user",
};

export default function RegisterEmployee() {
  const webcamRef = React.useRef(null);
  const [cameraOpened, setCameraOpened] = React.useState(false);
  const [employeeImage, setEmployeeImage] = React.useState({
    captured: false,
    image: null,
  });
  const [employeeImageDescriptor, setEmployeeImageDescriptor] = React.useState(
    []
  );

  /**
   * @dev form elements
   */
  const [fullName, setFullName] = React.useState("");
  const [dob, setDob] = React.useState(Date.now());
  const [contactNumber, setContactNumber] = React.useState("");
  const [joinedAt, setJoinedAt] = React.useState(Date.now());

  React.useEffect(() => {
    (async () => {
      await loadModels();
    })();
  }, []);

  const capture = React.useCallback(() => {
    setEmployeeImage({
      captured: true,
      image: webcamRef.current.getScreenshot(),
    });

    (async () => {
      if (!!webcamRef.current) {
        await getFullFaceDescription(
          webcamRef.current.getScreenshot(),
          160
        ).then((fullDesc) => {
          /**
           * * extract descriptors, format then store to db
           */
          if (!!fullDesc) setEmployeeImageDescriptor(fullDesc[0].descriptor);
        });
      }
    })();
  }, [webcamRef]);

  const handleCameraOpen = () => {
    setCameraOpened(true);
  };

  const handleRegisterEmployee = () => {
    console.log(employeeImageDescriptor);
  };

  return (
    <div className="registerEmployee__container">
      <h1>Hash Technologies</h1>

      {/**
       * * Check if camera is opened or not
       */}
      {!!cameraOpened ? (
        <div className="registerEmployee__container__cameraOpened">
          {!employeeImage.captured ? (
            <div className="registerEmployee__container__cameraOpened__camera">
              <Webcam
                audio={false}
                height={250}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                width={250}
                videoConstraints={videoConstraints}
                style={{ objectFit: "cover" }}
                mirrored={true}
              />
              <Button onClick={capture}>Capture photo</Button>
            </div>
          ) : (
            <div className="registerEmployee__container__cameraOpened__camera">
              <img src={employeeImage.image} alt="employee" />
              <Button
                variant="contained"
                onClick={() =>
                  setEmployeeImage({ captured: false, image: null })
                }
              >
                Take Again
              </Button>
            </div>
          )}

          <form>
            <label htmlFor="">Full Name</label>
            <input type="text" placeholder="Himitsu Fushigi" />

            <label htmlFor="">Date of Birth</label>
            <input type="date" />

            <label htmlFor="">Contact Number</label>
            <input type="text" placeholder="9812345678" />

            <label htmlFor="">Joined At</label>
            <input type="date" />

            <Button onClick={handleRegisterEmployee} variant="contained">
              Register Employee
            </Button>
          </form>
        </div>
      ) : (
        <div className="registerEmployee__container__cameraNotOpened">
          <img src={FacialImg} />
          <Button onClick={handleCameraOpen}>Open Camera</Button>
        </div>
      )}
    </div>
  );
}
