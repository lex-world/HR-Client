import React from "react";
import "./style.scss";

import Webcam from "react-webcam";

import { getFullFaceDescription, loadModels } from "../../API/face";

const videoConstraints = {
  width: 1280,
  height: 720,
  facingMode: "user",
};

export default function RegisterEmployee() {
  const webcamRef = React.useRef(null);

  React.useEffect(() => {
    (async () => {
      await loadModels();
    })();
  }, []);

  const capture = React.useCallback(() => {
    (async () => {
      if (!!webcamRef.current) {
        await getFullFaceDescription(
          webcamRef.current.getScreenshot(),
          160
        ).then((fullDesc) => {
            /**
             * * extract descriptors, format then store to db
             */
          if (!!fullDesc) console.log(fullDesc);
        });
      }
    })();
  }, [webcamRef]);

  return (
    <div className="registerEmployee__container">
      <h1>Hash Technologies</h1>
      <Webcam
        audio={false}
        height={400}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        width={400}
        videoConstraints={videoConstraints}
        style={{ objectFit: "cover" }}
        mirrored={true}
      />
      <button onClick={capture}>Capture photo</button>
    </div>
  );
}
