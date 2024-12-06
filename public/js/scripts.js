function fetchRecommendations() {
    const fileInput = document.getElementById('imageUpload');
    const uploadStatus = document.getElementById('uploadStatus');
    const productContainer = document.getElementById('productContainer');
    const imagePreview = document.getElementById('imagePreview');

    if (fileInput.files.length > 0) {
        const file = fileInput.files[0];

        // Display preview of the uploaded image
        const reader = new FileReader();
        reader.onload = function (e) {
            imagePreview.src = e.target.result;
        };
        reader.readAsDataURL(file);

        // Prepare to send the image
        uploadStatus.textContent = `We're analyzing "${file.name}" to find your perfect match...`;

        // Create FormData and append the file
        const formData = new FormData();
        formData.append('image', file);

        // Clear previous product recommendations
        productContainer.innerHTML = '<p>Loading recommendations...</p>';

        // Use fetch to send the image and get recommendations
        fetch('https://flask-ai-api-91c1f2095b0f.herokuapp.com/api/recommendations', {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json'
            }
        })
            .then(response => response.json())
            .then(data => {
                uploadStatus.textContent = 'Image analyzed! Recommendations are here:';

                // Display recommendations
                productContainer.innerHTML = '';
                const recommendations = data.slice(0, 5); // Ensure at least 5 recommendations

                recommendations.forEach(product => {
                    const productCard = document.createElement('div');
                    productCard.className = 'product-card';
                    productCard.innerHTML = `
                        <img src="${product.image}" alt="${product.name}" style="width: 100%; border-radius: 10px;">
                        <h3>${product.name}</h3>
                        <p>${product.description}</p>
                        <p><strong>Price:</strong> ${product.price}</p>
                    `;
                    productContainer.appendChild(productCard);
                });
            })
            .catch(error => {
                uploadStatus.textContent = 'Error processing the image. Please try again.';
                productContainer.innerHTML = '<p>Failed to load recommendations. Please try again later.</p>';
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
