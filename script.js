let cart = [];
let products = [];

const phRegions = {
    Luzon: ['Abra','Apayao','Benguet','Ifugao','Kalinga','Mountain Province','Ilocos Norte','Ilocos Sur','La Union','Pangasinan','Batanes','Cagayan','Isabela','Nueva Vizcaya','Quirino','Aurora','Bataan','Bulacan','Nueva Ecija','Pampanga','Tarlac','Zambales','Batangas','Cavite','Laguna','Quezon','Rizal','Marinduque','Occidental Mindoro','Oriental Mindoro','Palawan','Romblon','Albay','Camarines Norte','Camarines Sur','Catanduanes','Masbate','Sorsogon'],
    Visayas: ['Aklan','Antique','Capiz','Guimaras','Iloilo','Negros Occidental','Bohol','Cebu','Negros Oriental','Siquijor','Biliran','Eastern Samar','Leyte','Northern Samar','Samar','Southern Leyte'],
    Mindanao: ['Basilan','Lanao del Norte','Lanao del Sur','Maguindanao del Norte','Maguindanao del Sur','Sulu','Tawi-Tawi','Zamboanga del Norte','Zamboanga del Sur','Zamboanga Sibugay','Bukidnon','Camiguin','Davao de Oro','Davao del Norte','Davao del Sur','Davao Occidental','Davao Oriental','Cotabato','Sarangani','South Cotabato','Sultan Kudarat','Agusan del Norte','Agusan del Sur','Dinagat Islands','Surigao del Norte','Surigao del Sur','Misamis Occidental','Misamis Oriental']
};

const provinceCities = {
    'Abra': ['Bangued','Tayum','La Paz','Tubo','Boliney'],
    'Aklan': ['Kalibo','Malay','Buruanga','Lezo','Numancia'],
    'Cebu': ['Cebu City','Mandaue City','Lapu-Lapu City','Toledo City','Talisay City'],
    'Laguna': ['Santa Rosa','Calamba','San Pablo','Biñan','San Pedro'],
    'Cavite': ['Imus','Dasmarañas','Bacoor','Tagaytay','Cavite City'],
    'Rizal': ['Antipolo','Cainta','Taytay','Angono','San Mateo'],
    'Pangasinan': ['Dagupan','Urdaneta','Alaminos','San Carlos','Binmaley'],
    'Quezon': ['Lucena','Tayabas','Gumaca','Sariaya','Candelaria'],
    'Davao del Norte': ['Tagum','Panabo','Samal','Kaputian','Asuncion'],
    'Davao del Sur': ['Digos','Padada','Bansalan','Matanao','Hagonoy'],
    'Iloilo': ['Iloilo City','Oton','Pavia','Leganes','Santa Barbara'],
    'Bohol': ['Tagbilaran','Ubay','Dauis','Talibon','Carmen']
};

const cityBarangays = {
    'Bangued': ['Bagong Barrio','Beddeng','Baybay','Poblacion East','Poblacion West'],
    'Kalibo': ['Poblacion','Poblacion East','Poblacion West','Singolong','Tinigban'],
    'Cebu City': ['Lahug','Mabolo','Banilad','Apas','Talamban'],
    'Santa Rosa': ['Balibago','Ciudad Real','Malitlit','San Lorenzo','Wawa'],
    'Antipolo': ['Dela Paz','Mayamot','San Roque','Calawis','Tinajeros'],
    'Dagupan': ['Bonuan Binloc','Bonuan Boquig','Bonuan Gueset','Pogo','Carosucan'],
    'Lucena': ['Ithaca','Cotta','Ilayang Iyam','Dagatan','Sariaya Heights']
};

function populateProvinceOptions(region) {
    const provinceSelect = document.getElementById('province');
    if (!provinceSelect) return;
    provinceSelect.innerHTML = '<option value="">Select Province</option>';
    if (!region || !phRegions[region]) {
        provinceSelect.disabled = true;
        return;
    }
    phRegions[region].forEach(province => {
        const option = document.createElement('option');
        option.value = province;
        option.textContent = province;
        provinceSelect.appendChild(option);
    });
    provinceSelect.disabled = false;
}

function resetLocationSelectors() {
    const citySelect = document.getElementById('city');
    const cityOther = document.getElementById('city-other');
    if (citySelect) {
        citySelect.innerHTML = '<option value="">Select City / Municipality</option>';
        citySelect.disabled = true;
    }
    if (cityOther) cityOther.style.display = 'none';
}

function populateCityOptions(province) {
    const citySelect = document.getElementById('city');
    const cityOther = document.getElementById('city-other');
    if (!citySelect) return;
    citySelect.innerHTML = '<option value="">Select City / Municipality</option>';
    if (!province) {
        resetLocationSelectors();
        return;
    }
    const cities = provinceCities[province] || [];
    cities.forEach(city => {
        const option = document.createElement('option');
        option.value = city;
        option.textContent = city;
        citySelect.appendChild(option);
    });
    citySelect.insertAdjacentHTML('beforeend', '<option value="other">Other / Enter manually</option>');
    citySelect.disabled = false;
    if (cityOther) cityOther.style.display = 'none';
}

function initializeShippingSelectors() {
    populateProvinceOptions();
    const regionSelect = document.getElementById('region');
    const provinceSelect = document.getElementById('province');
    const citySelect = document.getElementById('city');
    const cityOther = document.getElementById('city-other');
    const phoneInput = document.getElementById('phone-number');
    const postalInput = document.getElementById('postal-code');

    if (regionSelect && provinceSelect) {
        regionSelect.addEventListener('change', () => {
            populateProvinceOptions(regionSelect.value);
            resetLocationSelectors();
        });
    }

    if (provinceSelect) {
        provinceSelect.addEventListener('change', function() {
            populateCityOptions(this.value);
        });
    }

    if (citySelect) {
        citySelect.addEventListener('change', function() {
            if (this.value === 'other') {
                if (cityOther) cityOther.style.display = 'block';
            } else {
                if (cityOther) cityOther.style.display = 'none';
            }
        });
    }

    if (phoneInput) {
        phoneInput.addEventListener('input', function() {
            this.value = this.value.replace(/\D/g, '').slice(0, 11);
        });
    }

    if (postalInput) {
        postalInput.addEventListener('input', function() {
            this.value = this.value.replace(/\D/g, '').slice(0, 4);
        });
    }

    resetLocationSelectors();
}

function loadProducts() {
    let stored = localStorage.getItem('products');
    if (stored) {
        products = JSON.parse(stored);
    } else {
        products = [
            {id:1, name:'iPhone 16 Pro', price:999, description:'Latest Apple flagship', image:'📱', promoDiscount:0},
            {id:2, name:'Samsung S26 Ultra', price:1199, description:'Premium Samsung flagship smartphone', image:'📱', promoDiscount:0},
            {id:3, name:'Xiaomi 15 Pro', price:899, description:'High performance Xiaomi device', image:'📱', promoDiscount:0},
            {id:4, name:'OnePlus 13', price:799, description:'Fast and smooth OnePlus experience', image:'📱', promoDiscount:0}
        ];
    }
}

function renderFeaturedProducts() {
    const grid = document.querySelector('.products-grid');
    if (!grid) return; // Only render if on home page

    grid.innerHTML = '';
    products.slice(0, 4).forEach(product => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <div class="product-image">
                ${typeof product.image === 'string' && product.image.startsWith('data:') 
                    ? `<img src="${product.image}" alt="${product.name}" style="width: 100%; height: 100%; object-fit: cover;">` 
                    : product.image}
            </div>
            <div class="product-info">
                <div class="product-name">${product.name}</div>
                <div class="product-price">$${product.price.toLocaleString()}</div>
                <button class="add-to-cart-btn" onclick="addToCart('${product.name}', ${product.price})">Add to Cart</button>
            </div>
        `;
        grid.appendChild(card);
    });
}

document.addEventListener('DOMContentLoaded', function() {
    loadProducts();
    renderFeaturedProducts();
    renderPromoBanner();
    initializeShippingSelectors();
});

function renderPromoBanner() {
    const promoProducts = products.filter(p => p.promoDiscount > 0);
    const banner = document.querySelector('.promo-banner');
    if (promoProducts.length === 0) {
        banner.innerHTML = `
            <div class="promo-content">
                <div style="font-size: 20px; color: #999;">Limited time offer on selected smartphones.</div>
                <div>
                    <span class="promo-text">Up to</span>
                    <span class="promo-discount">30% OFF</span>
                </div>
                <div class="promo-description">No promo deals available at the moment.</div>
                <button class="promo-btn" onclick="window.location.href='products.html'">Shop All Products</button>
            </div>
        `;
        return;
    }
    banner.innerHTML = `
        <div class="promo-content">
            <h2>Promo Deals</h2>
        </div>
        <div class="promo-grid">
            ${promoProducts.slice(0,4).map(product => {
                let displayPrice = product.price;
                let priceHtml = `$${product.price.toLocaleString()}`;
                if (product.promoDiscount > 0) {
                    displayPrice = product.price * (1 - product.promoDiscount / 100);
                    priceHtml = `<span style="text-decoration: line-through; color: #999;">$${product.price.toLocaleString()}</span> $${displayPrice.toLocaleString()}`;
                }
                return `
                <div class="product-card">
                    <div class="product-image">
                        ${typeof product.image === 'string' && product.image.startsWith('data:') 
                            ? `<img src="${product.image}" alt="${product.name}" style="width: 100%; height: 100%; object-fit: cover;">` 
                            : product.image}
                    </div>
                    <div class="product-info">
                        <div class="product-name">${product.name}</div>
                        <div class="product-price">${priceHtml}</div>
                        <button class="add-to-cart-btn" onclick="addToCart('${product.name}', ${displayPrice})">Add to Cart</button>
                    </div>
                </div>
                `;
            }).join('')}
        </div>
    `;
}

function addToCart(name, price) {
    const existingItem = cart.find(item => item.name === name);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            name: name,
            price: price,
            quantity: 1
        });
    }
    
    updateCart();
    showNotification(`${name} added to cart!`);
}

function removeFromCart(index) {
    cart.splice(index, 1);
    updateCart();
}

function updateQuantity(index, change) {
    cart[index].quantity += change;
    if (cart[index].quantity <= 0) {
        removeFromCart(index);
    } else {
        updateCart();
    }
}

function updateCart() {
    const cartItemsDiv = document.getElementById('cart-items');
    const cartCountBadge = document.getElementById('cart-count');
    const cartTotalDiv = document.getElementById('cart-total');
    const checkoutBtn = document.getElementById('checkout-btn');
    
    let totalAmount = 0;
    let totalItems = 0;

    if (cart.length === 0) {
        cartItemsDiv.innerHTML = '<div class="empty-cart"><p>Your cart is empty</p></div>';
        cartCountBadge.textContent = '0';
        cartTotalDiv.textContent = '$0';
        checkoutBtn.disabled = true;
    } else {
        cartItemsDiv.innerHTML = cart.map((item, index) => `
            <div class="cart-item">
                <button class="remove-btn" onclick="removeFromCart(${index})">✕</button>
                <div class="cart-item-image">📱</div>
                <div class="cart-item-details">
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-price">$${item.price.toLocaleString()}</div>
                    <div class="cart-item-quantity">
                        <button class="quantity-btn" onclick="updateQuantity(${index}, -1)">−</button>
                        <span>${item.quantity}</span>
                        <button class="quantity-btn" onclick="updateQuantity(${index}, 1)">+</button>
                    </div>
                </div>
            </div>
        `).join('');

        cart.forEach(item => {
            totalAmount += item.price * item.quantity;
            totalItems += item.quantity;
        });

        cartCountBadge.textContent = totalItems;
        cartTotalDiv.textContent = `$${totalAmount.toLocaleString()}`;
        checkoutBtn.disabled = false;
    }
}

function toggleCart() {
    const cartModal = document.getElementById('cart-modal');
    cartModal.classList.toggle('active');
}

function checkout() {
    if (cart.length === 0) return;
    openModal('checkout-modal');
}

function submitOrder() {
    const name = document.getElementById('full-name').value.trim();
    const phone = document.getElementById('phone-number').value.trim();
    const region = document.getElementById('region').value;
    const province = document.getElementById('province').value;
    const citySelect = document.getElementById('city');
    const cityOtherInput = document.getElementById('city-other');
    const rawCity = citySelect ? citySelect.value : '';
    const city = rawCity === 'other' ? (cityOtherInput ? cityOtherInput.value.trim() : '') : rawCity;
    const barangay = document.getElementById('barangay').value.trim();
    const postal = document.getElementById('postal-code').value.trim();
    const street = document.getElementById('street-name').value.trim();
    const building = document.getElementById('building').value.trim();
    const house = document.getElementById('house-number').value.trim();

    if (!name || !phone || !region || !province || !city || !barangay || !postal || !street || !house) {
        alert('Please fill all required fields.');
        return;
    }

    if (!/^[0-9]{10,11}$/.test(phone)) {
        alert('Please enter a valid mobile number with only digits (10 to 11 digits).');
        return;
    }

    if (!/^[0-9]{4}$/.test(postal)) {
        alert('Postal code must be exactly 4 digits.');
        return;
    }

    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    const order = {
        id: Date.now(),
        items: [...cart],
        total: total,
        shipping: {
            name, phone, region, province, city, barangay, postal, street, building, house
        },
        status: 'pending',
        date: new Date().toISOString()
    };

    let orders = JSON.parse(localStorage.getItem('orders') || '[]');
    orders.push(order);
    localStorage.setItem('orders', JSON.stringify(orders));

    // Clear form
    document.getElementById('full-name').value = '';
    document.getElementById('phone-number').value = '';
    document.getElementById('region').value = '';
    document.getElementById('province').value = '';
    populateProvinceOptions('');
    document.getElementById('city').value = '';
    document.getElementById('barangay').value = '';
    document.getElementById('city-other').value = '';
    document.getElementById('postal-code').value = '';
    document.getElementById('street-name').value = '';
    document.getElementById('building').value = '';
    document.getElementById('house-number').value = '';
    resetLocationSelectors();

    cart = [];
    updateCart();
    closeModal('checkout-modal');
    toggleCart();
    alert('Order placed successfully! Waiting for admin approval.');
}

function openModal(modalId) {
    document.getElementById(modalId).classList.add('active');
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('active');
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background-color: #0088ff;
        color: white;
        padding: 15px 20px;
        border-radius: 6px;
        z-index: 300;
        animation: slideIn 0.3s ease-out;
    `;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    }, 2000);
}