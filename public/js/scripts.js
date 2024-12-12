function uploadImage() {
    const fileInput = document.getElementById('imageUpload');
    const uploadStatus = document.getElementById('uploadStatus');
    const imagePreview = document.getElementById('imagePreview');
    const imageLink = document.getElementById('imageLink');

    if (fileInput.files.length > 0) {
        const file = fileInput.files[0];

        // Display preview of the uploaded image
        const reader = new FileReader();
        reader.onload = function (e) {
            imagePreview.src = e.target.result;
        };
        reader.readAsDataURL(file);

        // Update status message
        uploadStatus.textContent = `We're analyzing "${file.name}" to find your perfect match...`;

        // Create FormData and append the file
        const formData = new FormData();
        formData.append('image', file);

        // Send the request
        fetch('https://flask-ai-api-91c1f2095b0f.herokuapp.com/api/upload', {
            method: 'POST',
            body: formData,
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            for (let [key, value] of response.headers.entries()) { 
                console.log(`${key}: ${value}`); 
            }
            const link = response.headers.get('X-Image-URL');
            console.log('Retrieved link:', link);
            if (!link) {
                throw new Error('No link returned');
            }
            return response.blob().then(blob => ({ blob, link }));  // Adjust this based on server response (e.g., .json())
        })
        .then(({ blob, link }) => {
            const returnedImageURL = URL.createObjectURL(blob);
            imagePreview.src = returnedImageURL;  // Show returned image in the imagePreview element
            uploadStatus.textContent = 'Image analyzed! Your personalized suggestions are ready.';

            // Display the link
            imageLink.href = link; // Set the link URL
            imageLink.textContent = 'Click here to view product'; // Set the link text
        })
        .catch(error => {
            uploadStatus.textContent = 'Error uploading the image. Please try again.';
            console.error('Error:', error);
        });
    } else {
        uploadStatus.textContent = 'Please select an image to upload.';
    }
}

function setView(view) {
    const productList = document.getElementById('productList');
    if (view === 'list') {
        productList.classList.remove('gallery-view');
        productList.classList.add('list-view');
    } else {
        productList.classList.remove('list-view');
        productList.classList.add('gallery-view');
    }
}


function shareSite() {
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`;
    const xUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent('Check out this amazing design recommendation site!')}`;

    const shareContainer = document.getElementById('shareContainer');
    shareContainer.innerHTML = `
        <a href="${facebookUrl}" target="_blank">Share on Facebook</a><br>
        <a href="${xUrl}" target="_blank">Share on X</a>
    `;
}


document.addEventListener('DOMContentLoaded', () => {
    const shareContainer = document.createElement('div');
    shareContainer.id = 'shareContainer';
    shareContainer.style.textAlign = 'center';
    shareContainer.style.marginTop = '20px';
    document.body.appendChild(shareContainer);
    

    const shareButton = document.createElement('button');
    shareButton.textContent = 'Share on Social Media';
    shareButton.style.padding = '10px 20px';
    shareButton.style.backgroundColor = '#4CAF50';
    shareButton.style.color = 'white';
    shareButton.style.border = 'none';
    shareButton.style.borderRadius = '8px';
    shareButton.style.cursor = 'pointer';
    shareButton.style.fontSize = '1em';
    shareButton.style.transition = 'background-color 0.3s ease';
    shareButton.addEventListener('click', shareSite);

    shareButton.onmouseover = () => {
        shareButton.style.backgroundColor = '#45a049';
    };

    shareButton.onmouseout = () => {
        shareButton.style.backgroundColor = '#4CAF50';
    };

    shareContainer.appendChild(shareButton);
});