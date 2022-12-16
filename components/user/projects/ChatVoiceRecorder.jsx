import { BsMic } from 'react-icons/bs'
import React, { useEffect, useState } from 'react'

let recordingInterval;

function ChatVoiceRecorder({ setVoiceFile, isRecording, setIsRecording, setRecordingTime }) {

    // const [isRecording, setIsRecording] = useState(false);
    const [recorder, setRecorder] = useState(null);

    useEffect(() => {
        if (!recorder) {
            if (isRecording) {
                requestAudioRecording().then(setRecorder).catch(() => {
                    setIsRecording(false);
                    alert("No Audio found")
                });
            }
            return;
        }


        if (isRecording) {
            recorder.start();
            recordingInterval = setInterval(() => {
                setRecordingTime(prev => prev + 1);
            }, 1000);
        } else {
            recorder?.stop();
            clearInterval(recordingInterval);
            setRecordingTime(0);
        }

        recorder.addEventListener("dataavailable", (e) => {
            setVoiceFile(e.data);
        })

    }, [recorder, isRecording])

    async function requestAudioRecording() {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
            return new MediaRecorder(stream);
        } catch (e) {
            setIsRecording(false);
            alert("No audio device found")
            return null;
        }
    }

    function handleRecordStart() {
        setIsRecording(true);
    }
    function handleRecordStop() {
        setIsRecording(false);
    }

    return (
        <>
            {
                isRecording ?
                    <span className='h-7 w-7 cursor-pointer font-bold   text-gray-600 mr-3' onClick={handleRecordStop} ><p>Done</p></span>
                    :
                    <BsMic className='h-5 w-5 cursor-pointer self-center text-gray-600' onClick={handleRecordStart} />
            }
        </>
    )
}

export default ChatVoiceRecorder