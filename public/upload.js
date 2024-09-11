// Firebase Config
const firebaseConfig = {
    apiKey: "AIzaSyBBBILoBkKNTp6M8m8PO-tMgthx__3YB1U",
    authDomain: "photo-upload-qr.firebaseapp.com",
    projectId: "photo-upload-qr",
    storageBucket: "photo-upload-qr.appspot.com",
    messagingSenderId: "722722859500",
    appId: "1:722722859500:web:51d79f23a8ce3d130f38c9",
};
  
  // Initialize Firebase
  const app = firebase.initializeApp(firebaseConfig);
  const storage = firebase.storage();
  
  // Upload File Function
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
  
    const storageRef = storage.ref('uploads/' + file.name); // Reference to Firebase Storage
  
    // Start upload
    const uploadTask = storageRef.put(file);
  
    // Track the progress and completion of the upload
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        // Calculate the upload progress
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        progressBar.style.width = progress + '%';
        progressBar.textContent = progress.toFixed(0) + '%';
        statusMessage.textContent = `Uploading... ${progress.toFixed(0)}%`;
      },
      (error) => {
        // Handle errors
        console.error('Upload failed:', error);
        statusMessage.textContent = 'Upload failed. Please try again.';
      },
      () => {
        // On successful upload, get the download URL
        uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
          statusMessage.textContent = `Upload successful! File available at: ${downloadURL}`;
        });
      }
    );
  }
  