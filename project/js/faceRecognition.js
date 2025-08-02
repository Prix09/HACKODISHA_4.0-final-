// Face Recognition Module
class FaceRecognition {
    constructor() {
        this.enrolledFaces = new Map(); // Store face data for enrolled users
        this.currentStream = null;
        this.isProcessing = false;
    }

    // Initialize camera stream
    async initCamera(videoElement) {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: {
                    width: { ideal: 640 },
                    height: { ideal: 480 },
                    facingMode: 'user'
                }
            });
            
            videoElement.srcObject = stream;
            this.currentStream = stream;
            return true;
        } catch (error) {
            console.error('Camera access denied:', error);
            alert('Camera access is required for facial recognition. Please allow camera access and try again.');
            return false;
        }
    }

    // Stop camera stream
    stopCamera() {
        if (this.currentStream) {
            this.currentStream.getTracks().forEach(track => track.stop());
            this.currentStream = null;
        }
    }

    // Capture face data during enrollment
    async captureFaceData(videoElement, canvasElement, userId) {
        return new Promise((resolve) => {
            const canvas = canvasElement;
            const ctx = canvas.getContext('2d');
            
            // Set canvas dimensions to match video
            canvas.width = videoElement.videoWidth;
            canvas.height = videoElement.videoHeight;
            
            // Draw current video frame to canvas
            ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
            
            // Get image data
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            
            // Simulate face detection and feature extraction
            const faceData = this.extractFaceFeatures(imageData);
            
            if (faceData) {
                // Store the face data for this user
                this.enrolledFaces.set(userId, faceData);
                console.log(`Face data enrolled for user: ${userId}`);
                resolve(true);
            } else {
                resolve(false);
            }
        });
    }

    // Extract face features (simplified simulation)
    extractFaceFeatures(imageData) {
        // In a real implementation, this would use a face detection library
        // For demo purposes, we'll create a simplified face signature
        const data = imageData.data;
        let faceSignature = [];
        
        // Sample pixels from face region (center area)
        const centerX = imageData.width / 2;
        const centerY = imageData.height / 2;
        const faceRegionSize = 100;
        
        for (let y = centerY - faceRegionSize/2; y < centerY + faceRegionSize/2; y += 10) {
            for (let x = centerX - faceRegionSize/2; x < centerX + faceRegionSize/2; x += 10) {
                const index = (Math.floor(y) * imageData.width + Math.floor(x)) * 4;
                if (index < data.length) {
                    // Create a simple feature vector from RGB values
                    faceSignature.push(data[index], data[index + 1], data[index + 2]);
                }
            }
        }
        
        return faceSignature.length > 0 ? faceSignature : null;
    }

    // Verify face against enrolled users
    async verifyFace(videoElement, canvasElement, cardId) {
        return new Promise((resolve) => {
            const canvas = canvasElement;
            const ctx = canvas.getContext('2d');
            
            // Set canvas dimensions to match video
            canvas.width = videoElement.videoWidth;
            canvas.height = videoElement.videoHeight;
            
            // Draw current video frame to canvas
            ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
            
            // Get image data
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            
            // Extract features from current face
            const currentFaceData = this.extractFaceFeatures(imageData);
            
            if (!currentFaceData) {
                resolve({
                    success: false,
                    message: 'No face detected. Please position your face clearly in the camera.',
                    userId: null
                });
                return;
            }

            // Find authorized users for this card
            const authorizedUsers = window.appData.authorizedUsers.filter(user => 
                user.cardAccess.includes(cardId) && user.facialDataEncoded && user.isActive
            );

            if (authorizedUsers.length === 0) {
                resolve({
                    success: false,
                    message: 'No authorized users found for this card.',
                    userId: null
                });
                return;
            }

            // Compare with enrolled faces
            let bestMatch = null;
            let bestSimilarity = 0;
            const threshold = 0.7; // Similarity threshold for face matching

            for (const user of authorizedUsers) {
                const enrolledFaceData = this.enrolledFaces.get(user.id);
                if (enrolledFaceData) {
                    const similarity = this.calculateSimilarity(currentFaceData, enrolledFaceData);
                    if (similarity > bestSimilarity) {
                        bestSimilarity = similarity;
                        bestMatch = user;
                    }
                }
            }

            if (bestMatch && bestSimilarity > threshold) {
                resolve({
                    success: true,
                    message: `Welcome, ${bestMatch.name}! Face verified successfully.`,
                    userId: bestMatch.id,
                    confidence: Math.round(bestSimilarity * 100)
                });
            } else {
                resolve({
                    success: false,
                    message: 'Face not recognized. Access denied for security reasons.',
                    userId: null,
                    confidence: Math.round(bestSimilarity * 100)
                });
            }
        });
    }

    // Calculate similarity between two face signatures
    calculateSimilarity(face1, face2) {
        if (!face1 || !face2 || face1.length !== face2.length) {
            return 0;
        }

        // Calculate normalized correlation coefficient
        let sum1 = 0, sum2 = 0, sum1Sq = 0, sum2Sq = 0, pSum = 0;
        const n = face1.length;

        for (let i = 0; i < n; i++) {
            sum1 += face1[i];
            sum2 += face2[i];
            sum1Sq += face1[i] * face1[i];
            sum2Sq += face2[i] * face2[i];
            pSum += face1[i] * face2[i];
        }

        const num = pSum - (sum1 * sum2 / n);
        const den = Math.sqrt((sum1Sq - sum1 * sum1 / n) * (sum2Sq - sum2 * sum2 / n));

        if (den === 0) return 0;
        
        const correlation = num / den;
        
        // Convert correlation to similarity (0-1 range)
        return Math.max(0, (correlation + 1) / 2);
    }

    // Simulate enrollment progress
    async simulateEnrollmentProgress(progressCallback) {
        const steps = 10;
        for (let i = 0; i <= steps; i++) {
            await new Promise(resolve => setTimeout(resolve, 300));
            const progress = (i / steps) * 100;
            progressCallback(progress);
        }
    }

    // Check if user has enrolled face data
    hasEnrolledFace(userId) {
        return this.enrolledFaces.has(userId);
    }

    // Remove enrolled face data
    removeEnrolledFace(userId) {
        this.enrolledFaces.delete(userId);
    }

    // Get enrolled users count
    getEnrolledUsersCount() {
        return this.enrolledFaces.size;
    }
}

// Create global instance
window.faceRecognition = new FaceRecognition();

// Auto-enroll existing demo users with simulated face data
window.addEventListener('DOMContentLoaded', () => {
    // Simulate enrolled face data for demo users
    setTimeout(() => {
        if (window.appData && window.appData.authorizedUsers) {
            window.appData.authorizedUsers.forEach(user => {
                if (user.facialDataEncoded) {
                    // Create simulated face data for demo
                    const simulatedFaceData = Array.from({length: 300}, () => Math.random() * 255);
                    window.faceRecognition.enrolledFaces.set(user.id, simulatedFaceData);
                }
            });
        }
    }, 1000);
});