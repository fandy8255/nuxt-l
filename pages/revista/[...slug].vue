<template>
    <div id="main-article-container">
      <div class="container-xl">
        <!-- Hero Section -->
        <SimpleHeroArticle class="mt-1" :imgUrl="data.image" :title="data.title" :subtitle="data.meta.subtitle" />
  
        <!-- Main Content Layout -->
        <div class="row">
          <!-- Table of Contents (Left Column for md-xl, Top for sm) -->
          <div class="col-md-3 col-12 order-md-1 order-2 mt-5" id="toc-column">
            <div class="toc-container">
              <ul id="toc-ul" class="border border-1">
                <li class="toc-li" :key="link.id" v-for="link in data.body.toc.links">
                  <a class="toc-link text-decoration-none" :href="`#${link.id}`"> {{ link.id }} </a>
                </li>
              </ul>
            </div>
          </div>
  
          <!-- Blog Content (Right Column for md-xl, Below TOC for sm) -->
          <div class="col-md-9 col-12 order-md-2 order-1">
            <!-- Frontmatter Details -->
            <div class="frontmatter-details mt-5">
              <div class="row">
                <div class="col-md-6">
                  <h2>Description</h2>
                  <p>{{ data.description }}</p>
                </div>
                <div class="col-md-6">
                  <h2>Details</h2>
                  <ul class="list-unstyled">
                    <li><strong>Published:</strong> {{ formatDate(data.date) }}</li>
                    <li><strong>Category:</strong> {{ data.meta.category }}</li>
                    <li><strong>Tags:</strong>
                      <span v-for="(tag, index) in data.meta.tags" :key="index" class="badge bg-secondary me-1">
                        {{ tag }}
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
  
            <!-- Blog Content -->
            <ContentRenderer v-if="data" :value="data" class="mb-5" :components="Gallery" />
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  const slug = useRoute().params.slug[0].toString();
  //const { data } = await useAsyncData(() => queryCollection('content').path('/articles/' + slug).first());
  const { data } = await useAsyncData(() => queryCollection('blog').path('/articles/' + slug).first());
  // Format date function
  const formatDate = (dateString) => {
  // Split the date string into year, month, and day
  const [year, month, day] = dateString.split('-');

  // Create a Date object in local time
  const date = new Date(year, month - 1, day); // Note: Months are 0-indexed in JavaScript

  // Format the date
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
};
  // SEO Meta
  useSeoMeta({
    title: `Latin Panty Revista | ${data.value?.title}`,
    ogTitle: `Latin Panty Revista | ${data.value?.title}`,
    description: data.value?.meta.description,
    ogDescription: data.value?.meta.description,
    ogImage: data.value?.meta.image,
    twitterCard: 'summary_large_image',
  });
  </script>
  
  <style scoped>
  #main-article-container {
    margin-top: 20px;
  }
  
  /* Table of Contents Styling */
  #toc-column {
    position: relative;
  }
  
  .toc-container {
    position: sticky;
    top: 100px; /* Adjust based on your header height */
    max-height: calc(100vh - 120px); /* Adjust based on your layout */
    overflow-y: auto; /* Make TOC scrollable if content exceeds height */
  }
  
  #toc-ul {
    list-style: none;
    padding: 10px;
    border-radius: 8px;
    background: #f8f9fa;
  }
  
  .toc-li {
    margin: 8px 0;
  }
  
  .toc-link {
    color: green;
    text-decoration: none;
  }
  
  .toc-link:hover {
    color: greenyellow !important;
  }
  
  /* Frontmatter Details Styling */
  .frontmatter-details {
    background: #f8f9fa;
    padding: 20px;
    border-radius: 10px;
    margin-top: 40px;
  }
  
  .badge {
    font-size: 0.9em;
    padding: 0.5em 0.75em;
  }
  
  /* Responsive Layout */
  @media (max-width: 767.98px) {
    .toc-container {
      position: static;
      max-height: 30vh;
      overflow-y: auto;
      margin-bottom: 20px;
    }
  
    #toc-ul {
      padding: 10px 20px;
    }
  }
  </style>