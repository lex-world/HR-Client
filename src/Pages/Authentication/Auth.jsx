import React, { Component } from "react";
import {
  loadModels,
  getFullFaceDescription,
  createMatcher,
} from "../../API/face";
import "./style.scss";

/**
 * @assets
 */
import FacialAuthBanner from "../../assets/images/facial.jpg";

/**
 * @packages npm registry package
 */
import Webcam from "react-webcam";
import { Button } from "@mui/material";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import Axios from "axios";

/**
 * * @dev Import face profile from server later but used mock for dev environment
 */
const JSON_PROFILE = require("../../Mock/Employees.json");

/**
 * @constants
 */
const WIDTH = 420;
const HEIGHT = 420;
const inputSize = 160;

class Auth extends Component {
  constructor(props) {
    super(props);
    this.webcam = React.createRef();

    this.state = {
      fullDesc: null,
      detections: null,
      descriptors: null,
      faceMatcher: null,
      match: null,
      facingMode: null,
      cameraOpened: false,
      allDescriptors: {},
    };
  }

  /** @dev auto mount when page is loaded */
  componentDidMount = async () => {
    await loadModels();
    Axios.get("http://localhost:4000/api/v1/employee/get-all-employee")
      .then((res) => {
        (async () => {
          this.setState({
            // allDescriptors: JSON.stringify(res.data),
            // faceMatcher: await createMatcher(JSON_PROFILE),
            faceMatcher: await createMatcher(res.data),
          });
        })()
      })
      // .then(() =>
      // (async () => {
      //     // console.log(this.state.allDescriptors)
      //     this.setState({
      //       faceMatcher: await createMatcher(JSON_PROFILE),
      //       // faceMatcher: await createMatcher(this.state.allDescriptors),
      //     });
      //   })()
      // );
  };

  /**
   * @dev activate camera on device
   */
  setInputDevice = () => {
    this.setState({ cameraOpened: true });
    navigator.mediaDevices.enumerateDevices().then(async (devices) => {
      let inputDevice = await devices.filter(
        (device) => device.kind === "videoinput"
      );
      if (inputDevice.length < 2) {
        await this.setState({
          facingMode: "user",
        });
      } else {
        await this.setState({
          facingMode: { exact: "environment" },
        });
      }
    });
  };

  /**
   * @dev capture employee image and recognize
   */
  capture = async () => {
    if (!!this.webcam.current) {
      await getFullFaceDescription(
        this.webcam.current.getScreenshot(),
        inputSize
      ).then((fullDesc) => {
        if (!!fullDesc)
          this.setState({
            detections: fullDesc.map((fd) => fd.detection),
            descriptors: fullDesc.map((fd) => fd.descriptor),
          });
      });

      if (!!this.state.descriptors && !!this.state.faceMatcher) {
        let match = await this.state.descriptors.map((descriptor) =>
          this.state.faceMatcher.findBestMatch(descriptor)
        );
        this.setState({ match });
      }
    }
  };

  getEmployeeData = (data) => {
    console.log(data);
  };

  render() {
    const { detections, match, facingMode } = this.state;

    let videoConstraints = null;

    if (!!facingMode) {
      videoConstraints = {
        width: WIDTH,
        height: HEIGHT,
        facingMode: facingMode,
      };
    }

    let drawBox = null;

    /**
     * @dev mount drawbox either employee is recognized or not
     */
    if (!!detections)
      drawBox = detections.map((detection, i) => {
        let _H = detection.box.height;
        let _W = detection.box.width;
        let _X = detection.box._x;
        let _Y = detection.box._y;
        return (
          <div key={i}>
            {/**
             * * @dev check if employee face is registered or not
             * * Also if registered then recognize
             */}
            {!!match && !!match[i] && match[i]._label !== "unknown" ? (
              <div
                style={{
                  position: "absolute",
                  border: "solid",
                  borderColor: "blue",
                  height: _H,
                  width: _W,
                  transform: `translate(${_X}px,${_Y}px)`,
                }}
              >
                <p
                  style={{
                    backgroundColor: "blue",
                    border: "solid",
                    borderColor: "blue",
                    width: _W,
                    marginTop: 0,
                    color: "#fff",
                    transform: `translate(-3px,${_H}px)`,
                  }}
                >
                  {match[i]._label}
                  {this.getEmployeeData(match[i])}
                </p>
              </div>
            ) : (
              <div
                style={{
                  position: "absolute",
                  border: "solid",
                  borderColor: "red",
                  height: _H,
                  width: _W,
                  transform: `translate(${_X}px,${_Y}px)`,
                }}
              >
                <p
                  style={{
                    backgroundColor: "red",
                    border: "solid",
                    borderColor: "red",
                    width: _W,
                    marginTop: 0,
                    color: "#fff",
                    transform: `translate(-3px,${_H}px)`,
                  }}
                >
                  Unknown Person!
                </p>
              </div>
            )}
          </div>
        );
      });

    return (
      <div className="auth__container">
        <h1>Hash Technologies</h1>
        {/**
         * * @dev By default camera is turned off to reduce error
         * * On button click the camera is turned on
         */}
        {!this.state.cameraOpened && (
          <div className="auth__container__openCamera">
            <img src={FacialAuthBanner} alt="Facial Biometrics Banner" />
            <Button onClick={this.setInputDevice} variant="outlined">
              Open Camera <CameraAltIcon />
            </Button>
          </div>
        )}

        <div
          style={{
            width: WIDTH,
            height: HEIGHT,
          }}
        >
          {/**
           * * @section => Webcam container
           */}
          <div style={{ position: "relative", width: WIDTH }}>
            {!!videoConstraints ? (
              <div style={{ position: "absolute" }}>
                <Webcam
                  audio={false}
                  width={WIDTH}
                  height={HEIGHT}
                  ref={this.webcam}
                  screenshotFormat="image/jpeg"
                  videoConstraints={videoConstraints}
                  mirrored={true}
                />
              </div>
            ) : null}
            {!!drawBox ? drawBox : null}
          </div>
        </div>
        <Button
          className="auth__container__captureImageBtn"
          onClick={this.capture}
          variant="outlined"
        >
          Click Picture <CameraAltIcon />
        </Button>
      </div>
    );
  }
}

export default Auth;
