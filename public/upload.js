import { storage } from './firebase.js'; // Import storage from your firebase.js
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage"; // Import Firebase storage functions

// Upload File Function
function uploadFile() {
  const fileInput = document.getElementById('fileInput');  // Get file input element
  const file = fileInput.files[0];  // Get the selected file from the input
  const progressBar = document.getElementById('progressBar');  // Progress bar element
  const statusMessage = document.getElementById('statusMessage');  // Status message element

  // Check if a file has been selected
  if (!file) {
    statusMessage.textContent = 'Please select a file.';
    return;
  }

  // Reset progress bar and status message
  progressBar.style.width = '0%';
  statusMessage.textContent = 'Uploading...';

  // Create a reference to Firebase Storage with the file name
  const storageRef = ref(storage, 'uploads/' + file.name);

  // Start the file upload
  const uploadTask = uploadBytesResumable(storageRef, file);

  // Monitor the file upload progress
  uploadTask.on('state_changed',
    (snapshot) => {
      // Calculate the upload progress as a percentage
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      progressBar.style.width = progress + '%';
      progressBar.textContent = `${progress.toFixed(0)}%`;
      statusMessage.textContent = `Uploading... ${progress.toFixed(0)}%`;
    },
    (error) => {
      // Handle upload errors
      console.error('Upload failed:', error);
      statusMessage.textContent = 'Upload failed. Please try again.';
    },
    () => {
      // Get the download URL when the upload is complete
      getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
        statusMessage.textContent = `Upload successful! File available at: ${downloadURL}`;
        console.log('File available at', downloadURL);  // Log the file download URL
      });
    }
  );
}

// Export the uploadFile function
window.uploadFile = uploadFile;  // Make the function globally available
