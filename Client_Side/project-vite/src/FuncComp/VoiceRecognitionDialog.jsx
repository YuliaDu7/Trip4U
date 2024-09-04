import React, { useState, useRef } from 'react';
import MicIcon from '@mui/icons-material/Mic';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';

const VoiceRecognitionDialog = ({ onResult }) => {
  const [isListening, setIsListening] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const recognitionRef = useRef(null);
  const silenceTimerRef = useRef(null);
  const collectedResultsRef = useRef([]);

  const startListening = () => {
    if (!('webkitSpeechRecognition' in window)) {
      setOpenDialog(true);
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      return;
    }

    const recognition = new window.webkitSpeechRecognition();
    recognitionRef.current = recognition;
    recognition.lang = 'he-IL';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.continuous = true;

    recognition.onstart = () => {
      setIsListening(true);
      collectedResultsRef.current = [];
    };

    recognition.onend = () => {
      setIsListening(false);
      clearTimeout(silenceTimerRef.current); 

      if (collectedResultsRef.current.length > 0) {
        onResult(collectedResultsRef.current.join(' '));
      }
    };

    recognition.onresult = (event) => {
      const speechResult = event.results[event.results.length - 1][0].transcript;
      collectedResultsRef.current.push(speechResult);
      clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = setTimeout(() => {
        recognition.stop();
      }, 3000);
    };

    recognition.onerror = (event) => {
      console.error('Recognition error:', event.error);
      setIsListening(false);
      clearTimeout(silenceTimerRef.current);
    };

    recognition.onspeechend = () => {
      silenceTimerRef.current = setTimeout(() => {
        recognition.stop();
      }, 3000); 
    };

    recognition.start();
  };

  return (
    <div>
      <MicIcon 
        style={{
          position: "absolute",
          left: "-20",
          top: "50%",
          transform: "translateY(-50%)",
          color: isListening ? "red" : "#697e42",
          cursor: 'pointer',
        }}
        onClick={startListening}
      />

      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        dir='rtl'
      >
        <DialogTitle id="alert-dialog-title">דפדפן זה אינו תומך בזיהוי דיבור</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
אנא נסו דפדפן אחר או הקלידו את הטיול המבוקש          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            style={{ color: 'white', backgroundColor: "#7C99AB", border: `1px solid #7C99AB`, borderRadius: '10px', padding: '5px 20px', margin: '5px' }}
            onClick={() => setOpenDialog(false)}
            autoFocus
          >
            סגור
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default VoiceRecognitionDialog;
