const API = "https://dummyjson.com/products?limit=30";

// Helper: generate star string from rating number
const stars = (rating) =>
    "★".repeat(Math.round(rating)) + "☆".repeat(5 - Math.round(rating));

// Render product detail in left rail
const showDetail = (product) => {
    document.getElementById("detail").innerHTML = `
    <img class="detail-img" src="${product.images?.[0] ?? product.thumbnail}" alt="${product.title}">
    <h2>${product.title}</h2>
    <div class="price">$${product.price}</div>
    <div class="rating">${stars(product.rating)} (${product.rating})</div>
    <p class="description">${product.description}</p>
  `;
};

// Render thumbnail list in right rail
const renderList = (products) => {
    const list = document.getElementById("product-list");

    list.innerHTML = products
        .map(
            (p) => `
    <div class="thumb-card" data-id="${p.id}">
      <img src="${p.thumbnail}" alt="${p.title}">
      <div class="thumb-title">${p.title}</div>
    </div>`
        )
        .join("");

    // Single click handler on parent (event delegation)
    list.onclick = ({ target }) => {
        const card = target.closest(".thumb-card");
        if (!card) return;

        // Highlight active
        list.querySelector(".active")?.classList.remove("active");
        card.classList.add("active");

        // Find product and show detail
        const product = products.find((p) => p.id === +card.dataset.id);
        if (product) showDetail(product);
    };
};

// Fetch and kick off
const init = async () => {
    try {
        const { products } = await (await fetch(API)).json();
        renderList(products);

        // Auto-select first product
        showDetail(products[0]);
        document.querySelector(".thumb-card")?.classList.add("active");
    } catch (e) {
        console.error("Failed to load products:", e);
    }
};

init();