// SimpleWebCamera.js - A direct DOM implementation
// Add this to your project and import it in your HomeScreen

export const initializeWebCamera = (containerId, onStatusChange) => {
    // Get the container element
    const container = document.getElementById(containerId);
    if (!container) {
      console.error(`Container with ID ${containerId} not found`);
      return { success: false };
    }
  
    // Clear any existing content
    container.innerHTML = '';
    
    // Create video element
    const video = document.createElement('video');
    video.id = 'camera-stream';
    video.autoplay = true;
    video.playsInline = true;
    video.muted = true;
    video.style.width = '100%';
    video.style.height = '100%';
    video.style.objectFit = 'cover';
    video.style.backgroundColor = '#000';
    
    // Create canvas element (for taking pictures)
    const canvas = document.createElement('canvas');
    canvas.id = 'camera-canvas';
    canvas.style.display = 'none';
    
    // Add elements to container
    container.appendChild(video);
    container.appendChild(canvas);
    
    // Status indicator
    const statusDiv = document.createElement('div');
    statusDiv.id = 'camera-status';
    statusDiv.style.position = 'absolute';
    statusDiv.style.bottom = '10px';
    statusDiv.style.left = '0';
    statusDiv.style.right = '0';
    statusDiv.style.backgroundColor = 'rgba(0,0,0,0.5)';
    statusDiv.style.color = 'white';
    statusDiv.style.padding = '10px';
    statusDiv.style.textAlign = 'center';
    statusDiv.innerText = 'Initializing camera...';
    container.appendChild(statusDiv);
    
    // Store the stream globally so we can access it later
    let mediaStream = null;
    
    // Function to initialize camera
    const startCamera = async () => {
      try {
        setStatus('Requesting camera permission...');
        
        // Check if mediaDevices is available
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          throw new Error('Camera API not available in this browser');
        }
        
        // Get camera stream
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        console.log('Camera permission granted');
        
        // Store stream reference
        mediaStream = stream;
        
        // Connect stream to video element
        video.srcObject = stream;
        
        // Wait for video to be ready
        video.onloadedmetadata = () => {
          console.log('Video metadata loaded');
          video.play()
            .then(() => {
              console.log('Camera is streaming');
              setStatus('Camera active');
              if (onStatusChange) onStatusChange(true);
            })
            .catch(err => {
              console.error('Error playing video:', err);
              setStatus(`Error: ${err.message}`);
              if (onStatusChange) onStatusChange(false);
            });
        };
      } catch (err) {
        console.error('Camera error:', err);
        setStatus(`Error: ${err.message}`);
        if (onStatusChange) onStatusChange(false);
      }
    };
    
    // Start camera immediately
    startCamera();
    
    // Update status text
    function setStatus(text) {
      const statusElement = document.getElementById('camera-status');
      if (statusElement) {
        statusElement.innerText = text;
      }
      console.log('Camera status:', text);
    }
    
    // Function to take a picture
    const takePicture = () => {
      return new Promise((resolve) => {
        try {
          if (!video || !canvas) {
            resolve(null);
            return;
          }
          
          // Set canvas size to match video dimensions
          const videoWidth = video.videoWidth || 640;
          const videoHeight = video.videoHeight || 480;
          
          canvas.width = videoWidth;
          canvas.height = videoHeight;
          
          // Draw video frame to canvas
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            resolve(null);
            return;
          }
          
          // Draw the current video frame to the canvas
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          
          // Convert canvas to data URL (JPEG format)
          const dataUrl = canvas.toDataURL('image/jpeg');
          
          // Return photo data
          resolve({
            uri: dataUrl,
            width: canvas.width,
            height: canvas.height
          });
        } catch (err) {
          console.error('Error taking picture:', err);
          resolve(null);
        }
      });
    };
    
    // Function to stop the camera
    const stopCamera = () => {
      if (mediaStream) {
        mediaStream.getTracks().forEach(track => track.stop());
        mediaStream = null;
      }
      
      if (video) {
        video.srcObject = null;
      }
      
      setStatus('Camera stopped');
    };
    
    // Return controller object
    return {
      success: true,
      takePicture,
      stopCamera
    };
  };