console.log('upload.js loaded');

import { storage } from '../firebase.js';
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

// Upload File Function
function uploadFile() {
  const fileInput = document.getElementById('fileInput');
  const file = fileInput.files[0];
  const progressBar = document.getElementById('progressBar');
  const statusMessage = document.getElementById('statusMessage');

  // Check if a file is selected
  if (!file) {
    statusMessage.textContent = 'Please select a file.';
    return;
  }

  // Reset progress bar and status message
  progressBar.style.width = '0%';
  progressBar.textContent = '';
  statusMessage.textContent = 'Uploading...';

  // Create a storage reference to the file in Firebase Storage
  const storageRef = ref(storage, 'uploads/' + file.name);

  // Start the file upload
  const uploadTask = uploadBytesResumable(storageRef, file);

  // Monitor the file upload progress
  uploadTask.on('state_changed',
    (snapshot) => {
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      progressBar.style.width = progress + '%';
      progressBar.textContent = `${progress.toFixed(0)}%`; // Show progress inside the progress bar
      statusMessage.textContent = `Uploading... ${progress.toFixed(0)}%`;
    },
    (error) => {
      console.error('Upload failed:', error);

      // Handle different types of errors
      switch (error.code) {
        case 'storage/unauthorized':
          statusMessage.textContent = 'Unauthorized. Please check your permissions.';
          break;
        case 'storage/canceled':
          statusMessage.textContent = 'Upload canceled.';
          break;
        case 'storage/unknown':
          statusMessage.textContent = 'Unknown error occurred. Please try again.';
          break;
        default:
          statusMessage.textContent = 'Upload failed. Please try again.';
      }
    },
    () => {
      // Upload completed successfully
      getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
        statusMessage.textContent = `Upload successful! File available at: ${downloadURL}`;
        console.log('File available at', downloadURL);
      }).catch((error) => {
        statusMessage.textContent = 'Error getting download URL. Please try again.';
        console.error('Error getting download URL:', error);
      });
    }
  );
}

// Make the upload function globally accessible
window.uploadFile = uploadFile;
