import React, { useState, useEffect  } from 'react';
import logo from './images/logo.png';
import './App.css';

function App() {
  const [processed, setProcessed] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    let timer;
    if (showSuccess) {
      timer = setTimeout(() => {
        setShowSuccess(false);
      }, 3000); // سيختفي بعد 3 ثواني
    }
    return () => clearTimeout(timer);
  }, [showSuccess]);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file || file.type !== 'text/plain') {
      alert('Please upload a text file only (.txt)');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target.result;
      const lines = content.split('\n');
      let output = '';

      lines.forEach(line => {
        if (line.trim() === '') return;
        
        const parts = line.split(',');
        if (parts.length < 2) {
          output += `${line.trim()} - Incorrect format\n`;
          return;
        }

        const name = parts[0].trim();
        const score = parseInt(parts[1].trim(), 10);
        
        let grade = '';
        if (score >= 9) grade = 'excellent';
        else if (score >= 7) grade = 'very good';
        else if (score >= 5) grade = 'good';
        else if (score >= 1) grade = 'acceptable';
        else grade = 'Invalid degree';

        output += `${name} - ${grade}\n`;
      });

      // Create downloadable file
      const blob = new Blob([output], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'Student results.txt';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      setProcessed(true);
      setShowSuccess(true);
    };

    reader.readAsText(file);
  };


  return (
    <div className="App">
      <header className="header">
        <div className='logo'><img src={logo} alt='no-picture'></img></div>
        <div className='title'><h1>Title School</h1></div>
      </header>
      <hr />
      <div className='upload-file-body'>
        <div className='upload-file'>
          <h2>Please upload the student results file</h2>
          <input 
            type="file" 
            id="fileInput" 
            accept=".txt"
            onChange={handleFileUpload}
            style={{ display: 'none' }}
          />
          <label 
            htmlFor="fileInput" 
            className='btn-upload'
          >
            Select a file
          </label>
          {showSuccess && (
            <p className="success-message">
              Created successfully! Download will start automatically
            </p>
          )}
        </div>
      </div>

      <footer className="main-footer">
        <div className="footer-content">
          <p>© 2024 Title School. All rights reserved</p>
          <div className="footer-links">
            <a href="/privacy">Privacy Policy</a>
            <a href="/terms">Terms of Service</a>
            <a href="/contact">Contact Us</a>
          </div>
        </div>
      </footer>
      
    </div>
  );
}

export default App;
