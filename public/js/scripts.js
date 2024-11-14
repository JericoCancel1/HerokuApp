function uploadImage() {
    const fileInput = document.getElementById('imageUpload');
    const uploadStatus = document.getElementById('uploadStatus');
    const imagePreview = document.getElementById('imagePreview');

    if (fileInput.files.length > 0) {
        const file = fileInput.files[0];

        // Display preview of the uploaded image
        const reader = new FileReader();
        reader.onload = function (e) {
            imagePreview.src = e.target.result;
        };
        reader.readAsDataURL(file);

        // Prepare to send the image to another URL
        uploadStatus.textContent = `We're analyzing "${file.name}" to find your perfect match...`;

        // Create FormData and append the file
        const formData = new FormData();
        formData.append('image', file);

        // Use fetch to send the image
        fetch('https://ai-api-capstone-64300388693f.herokuapp.com/api/upload', {
            method: 'POST',
            body: formData,
            headers:{
                'Accept': 'application/json'
            }
        })
        .then(response => response.blob())  // Adjust response handling based on your server's response format
        .then(blob => {
            const returnedImageURL = URL.createObjectURL(blob);
            imagePreview.src = returnedImageURL;  // Show returned image in the imagePreview element
            uploadStatus.textContent = 'Image analyzed! Your personalized suggestions are ready.';
        })
        .catch(error => {
            uploadStatus.textContent = 'Error uploading the image. Please try again.';
            console.error('Error:', error);
        });
    } else {
        uploadStatus.textContent = 'Please select an image to upload.';
    }
}

function getRecommendations() {
    const colorScheme = document.getElementById('colorScheme').value;
    const material = document.getElementById('material').value;
    const style = document.getElementById('style').value;

    const productList = document.getElementById('productList');
    productList.innerHTML = '';

    const products = [
        {
            name: 'Modern Sofa',
            image: 'https://via.placeholder.com/300x200?text=Modern+Sofa',
            description: 'A sleek and minimalist modern sofa.',
            link: 'https://www.ikea.com/us/en/catalog/products/sofa-modern'
        },
        {
            name: 'Abstract Wall Art',
            image: 'https://via.placeholder.com/300x200?text=Abstract+Wall+Art',
            description: 'An abstract wall art piece that adds a bold touch to your room.',
            link: 'https://www.wayfair.com/decor-wallart'
        },
        {
            name: 'Rustic Coffee Table',
            image: 'https://via.placeholder.com/300x200?text=Rustic+Coffee+Table',
            description: 'A charming rustic coffee table with a wood finish.',
            link: 'https://www.wayfair.com/furniture-coffee-table'
        }
    ];

    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.classList.add('product-card');

        productCard.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <h3>${product.name}</h3>
            <p>${product.description}</p>
            <a href="${product.link}" target="_blank">View on retailer site</a>
        `;

        productList.appendChild(productCard);
    });
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