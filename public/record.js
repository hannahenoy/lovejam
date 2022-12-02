const trash = document.getElementsByClassName("fa-trash");
const record = document.querySelector('.record');
const stop = document.querySelector('.stop');
const soundClips = document.querySelector('.sound-clips');
const fileInput = document.getElementById('sound-clips')
const canvas = document.querySelector('.visualizer');
const mainSection = document.querySelector('.main-controls');


Array.from(trash).forEach(function(element) {
      element.addEventListener('click', function(){
        const name = this.parentNode.parentNode.childNodes[1].innerText
        const spelling = this.parentNode.parentNode.childNodes[3].innerText
        const role = this.parentNode.parentNode.childNodes[5].innerText
        fetch('deleteLibrary', {
          method: 'delete',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            'name': name,
            'spelling': spelling,
            'role':role,
          })
        }).then(function (response) {
          window.location.reload()
        })
      });
});


//audio

if (navigator.mediaDevices.getUserMedia) {
  console.log('getUserMedia supported.');

  const constraints = { audio: true };
  let chunks = [];

  let onSuccess = function(stream) {
    const mediaRecorder = new MediaRecorder(stream);

    visualize(stream);

    record.onclick = function() {
      mediaRecorder.start();
      console.log(mediaRecorder.state);
      console.log("recorder started");
      record.style.background = "red";

      stop.disabled = false;
      record.disabled = true;
    }

    stop.onclick = function() {
      mediaRecorder.stop();
      console.log(mediaRecorder.state);
      console.log("recorder stopped");
      record.style.background = "";
      record.style.color = "";
      // mediaRecorder.requestData();

      stop.disabled = true;
      record.disabled = false;
    }

    mediaRecorder.onstop = function(e) {
      console.log("data available after MediaRecorder.stop() called.");

      const clipName = prompt('Enter name:','i.e. Hannah');

      const clipContainer = document.createElement('article');
      const clipLabel = document.createElement('p');
      const audio = document.createElement('audio');
      const deleteButton = document.createElement('button');

      clipContainer.classList.add('clip');
      audio.setAttribute('controls', '');
      deleteButton.textContent = 'Delete';
      deleteButton.className = 'delete';

      if(clipName === null) {
        clipLabel.textContent = 'My Name Recording';
      } else {
        clipLabel.textContent = clipName;
      }

      clipContainer.appendChild(audio);
      clipContainer.appendChild(clipLabel);
      clipContainer.appendChild(deleteButton);
      soundClips.appendChild(clipContainer);

      audio.controls = true;
      const blob = new Blob(chunks, { 'type' : 'audio/mp3; codecs=opus' });
      chunks = [];
      const audioURL = window.URL.createObjectURL(blob);
      audio.src = audioURL;
      console.log("recorder stopped");

      deleteButton.onclick = function(e) {
        let evtTgt = e.target;
        evtTgt.parentNode.parentNode.removeChild(evtTgt.parentNode);
      }
    }

    mediaRecorder.ondataavailable = function(e) {
      chunks.push(e.data);
    }
  }

  let onError = function(err) {
    console.log('The following error occured: ' + err);
  }

  navigator.mediaDevices.getUserMedia(constraints).then(onSuccess, onError);

} else {
   console.log('getUserMedia not supported on your browser!');
}
// WAVEFORM
// https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API/Visualizations_with_Web_Audio_API
let audioContext;
const canvasCtx = canvas.getContext("2d");

function visualize(stream) {
  if(!audioContext) {
    audioCtx = new AudioContext();
  }

  const source = audioCtx.createMediaStreamSource(stream);
  const analyser = audioCtx.createAnalyser();

  analyser.fftSize = 256;
  const bufferLength = analyser.frequencyBinCount;
  const dataArray = new Uint8Array(bufferLength);

  source.connect(analyser);

  draw()

  function draw() {
    const WIDTH = canvas.width
    const HEIGHT = canvas.height;
    const barWidth = (WIDTH / bufferLength) * 2.5;

    requestAnimationFrame(draw);

    analyser.getByteTimeDomainData(dataArray);
    canvasCtx.fillStyle = "rgb(0, 0, 0)";
    canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);

    let barHeight;
    let x = 0;

  for (let i = 0; i < bufferLength; i++) {
    barHeight = dataArray[i] / 2;

    canvasCtx.fillStyle = `rgb(${barHeight + 200}, 200, 200)`;
    canvasCtx.fillRect(x, HEIGHT - barHeight / 2, barWidth, barHeight);

    x += barWidth + 1;
  }
}
}


window.onresize = function() {
  canvas.width = mainSection.offsetWidth;
}

window.onresize();