let stream = null,
  audio = null,
  mixedStream = null,
  chunks = [],
  recorder = null,
  recordedVideo = null;

let startBtn = document.getElementById("start");
let stopBtn = document.getElementById("stop");

async function setupstream() {
  /* try {
    // stream = await navigator.mediaDevices.getDisplayMedia({ video: true });
    audio = await navigator.mediaDevices.getUserMedia({
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
        sampleRate: 44100,
      },
    });

    mixedStream = new MediaStream(audio.getTracks());
    recorder = new AudioBuffer(mixedStream);
    recorder.ondataavailable = handleDataAvailable;

    recorder.onstop = handleStop;
    recorder.start();
  } catch (error) {
    console.log(error);
  }*/

  navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
    recorder = new MediaRecorder(stream);
    recorder.start();
    recorder.addEventListener("dataavailable", (event) => {
      chunks.push(event.data);
    });

    //recorder.ondataavailable = handleDataAvailable;
    recorder.addEventListener("stop", handleStop);

    //recorder.onstop = handleStop;
  });
}

function handleDataAvailable(e) {
  chunks.push(e.data);
  console.log({ chunks });
}

function stopRecording() {
  recorder.stop();
}

function handleStop() {
  const blob = new Blob(chunks, { type: "audio/ogg; codecs=opus" });

  chunks = [];
  const url = URL.createObjectURL(blob);

  const audiodiv = document.createElement("audio");
  audiodiv.src = url;
  audiodiv.controls = true;
  audiodiv.play();

  const adiv = document.createElement("a");
  adiv.href = url;
  let name = Math.floor(Math.random() * 10000).toString();
  adiv.setAttribute("download", name);
  adiv.click();

  // audio.getTracks().forEach((track) => track.stop());
}

startBtn.addEventListener("click", setupstream);
stopBtn.addEventListener("click", stopRecording);
