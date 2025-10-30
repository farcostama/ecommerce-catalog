<template>
  <!-- Root container: class binding menentukan tema halaman berdasarkan kategori -->
  <div :class="pageClass" class="product-page">
    <div class="product-card">
      <!-- Loading State: tampilkan spinner saat data produk sedang dimuat -->
      <div v-if="isLoading" class="loading">
        <div class="spinner"></div>
      </div>

      <!-- Product Available: tampilkan informasi produk jika kategori valid -->
      <div v-else-if="isAvailable">
        <div class="product-info">
          <!-- Gambar produk -->
          <img :src="product.image" alt="Product Image" class="product-image" loading="lazy" :class="{ loading: isImageLoading }" @load="isImageLoading = false" />

          <!-- Detail produk -->
          <div class="product-details">
            <h2>{{ product.title }}</h2>

            <!-- Kategori dan rating produk -->
            <div class="category-rating" v-if="product.rating">
              <p class="category">{{ product.category }}</p>
              <div class="rating">
                <span>{{ product.rating.rate }}/5</span>
                <span class="stars">
                  <span v-for="n in 5" :key="n" class="star" :class="{ filled: n <= Math.round(Number(product.rating.rate)) }"> ● </span>
                </span>
              </div>
            </div>

            <!-- Deskripsi dan harga -->
            <p class="desc">{{ product.description }}</p>
            <p class="price">${{ product.price }}</p>

            <!-- Tombol aksi -->
            <div class="buttons">
              <button class="buy-btn">Buy now</button>
              <button class="next-btn" :disabled="isLoading" @click="nextProduct">
                {{ isLoading ? "Loading..." : "Next product" }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Product Unavailable: fallback tampilan jika kategori tidak valid atau terjadi error -->
      <div v-else class="unavailable">
        <div class="sad-face">
          <img src="../assets/sad-face.svg" alt="Sad face" />
        </div>
        <p>{{ errorMessage || "This product is unavailable to show" }}</p>
        <button class="next-btn" :disabled="isLoading" @click="nextProduct">
          {{ isLoading ? "Loading..." : "Next product" }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "ProductDisplay",

  data() {
    return {
      index: 1, // ID produk aktif (1–20)
      product: {}, // Data produk dari API
      isAvailable: false, // Status produk valid / tidak
      isLoading: false, // Status loading untuk data produk
      isImageLoading: true, // Status loading untuk gambar produk
      errorMessage: "", // Pesan error yang ditampilkan ke user
      pageClass: "page-unavailable", // Class dinamis (menentukan tema tampilan)
    };
  },

  methods: {
    /**
     * Fetch data produk dari FakeStore API berdasarkan index aktif.
     * Menentukan class halaman (page-men, page-women, atau page-unavailable)
     * sesuai kategori produk.
     */
    async fetchProduct() {
      this.isLoading = true;
      this.errorMessage = "";
      this.isImageLoading = true;

      try {
        const res = await axios.get(`https://fakestoreapi.com/products/${this.index}`);
        const data = res.data;
        this.product = data;

        // Tentukan tema halaman berdasarkan kategori produk
        if (data.category?.includes("men")) {
          this.pageClass = "page-men";
          this.isAvailable = true;
        } else if (data.category?.includes("women")) {
          this.pageClass = "page-women";
          this.isAvailable = true;
        } else {
          this.pageClass = "page-unavailable";
          this.isAvailable = false;
        }
      } catch (err) {
        console.error("Failed to fetch product:", err);
        this.isAvailable = false;
        this.pageClass = "page-unavailable";

        // Tampilkan pesan error yang sesuai konteks kesalahan
        if (err.response) {
          this.errorMessage = "Server error. Please try again later.";
        } else if (err.request) {
          this.errorMessage = "Network error. Please check your connection.";
        } else {
          this.errorMessage = "Something went wrong. Please refresh the page.";
        }
      } finally {
        // Reset state loading setelah proses selesai (sukses/gagal)
        this.isLoading = false;
      }
    },

    /**
     * Ambil produk berikutnya.
     * Jika index mencapai batas (20), reset kembali ke produk pertama.
     */
    nextProduct() {
      if (this.isLoading) return; // Hindari klik ganda saat loading
      this.index++;
      if (this.index > 20) this.index = 1;
      this.fetchProduct();
    },
  },

  /**
   * Lifecycle hook: otomatis fetch produk pertama
   * saat komponen pertama kali dimount.
   */
  mounted() {
    this.fetchProduct();
  },
};
</script>
