import { storage } from './firebase.js'; // Import the storage instance
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage"; // Firebase Storage functions

function uploadFile() {
  const file = document.getElementById('fileInput').files[0];
  const progressBar = document.getElementById('progressBar');
  const statusMessage = document.getElementById('statusMessage');

  if (!file) {
    statusMessage.textContent = 'Please select a file.';
    return;
  }

  // Reset progress bar and status message
  progressBar.style.width = '0%';
  statusMessage.textContent = '';

  const storageRef = ref(storage, 'uploads/' + file.name); // Create a reference to upload the file

  // Start the file upload
  const uploadTask = uploadBytesResumable(storageRef, file);

  // Track the progress and completion of the upload
  uploadTask.on('state_changed',
    (snapshot) => {
      // Calculate the upload progress
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      progressBar.style.width = progress + '%';
      statusMessage.textContent = `Uploading... ${progress.toFixed(0)}%`;
    },
    (error) => {
      console.error('Upload failed:', error);
      statusMessage.textContent = 'Upload failed. Please try again.';
    },
    () => {
      // Get the download URL after the upload is complete
      getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
        statusMessage.textContent = `Upload successful! File available at: ${downloadURL}`;
      });
    }
  );
}
