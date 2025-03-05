<template>
    <div v-if="hasSocialLinks" class="social-media-links">
        <h2 class="fw-bold">Redes Sociales</h2>
        <ul class="list-unstyled">
            <li v-for="(link, platform) in socialLinks" :key="platform">
                <a v-if="link" :href="link" target="_blank" rel="noopener noreferrer" class="text-decoration-none">
                    <i :class="getIconClass(platform)"></i> @{{ getUsername(link) }}
                </a>
            </li>
        </ul>
    </div>
</template>

<script setup>
const props = defineProps({
    socialLinks: {
        type: Object,
        default: () => ({}),
    },
});

// Check if there are any social links
const hasSocialLinks = computed(() => {
    return Object.values(props.socialLinks).some(link => link);
});

// Get the appropriate Font Awesome icon for each platform
const getIconClass = (platform) => {
    const icons = {
        ig: 'fa-brands fa-instagram',
        fb: 'fa-brands fa-facebook',
        telegram: 'fa-brands fa-telegram',
        tiktok: 'fa-brands fa-tiktok',
        whatsapp: 'fa-brands fa-whatsapp',
        line: 'fa-brands fa-line',
        skype: 'fa-brands fa-skype',
        x: 'fa-brands fa-x-twitter',
        tumblr: 'fa-brands fa-tumblr',
        threads: 'fa-brands fa-threads',
        reddit: 'fa-brands fa-reddit',
        snapchat: 'fa-brands fa-snapchat',
        chaturbate: 'fa-solid fa-circle-user', // Fallback for Chaturbate
        phub: 'fa-solid fa-circle-user', // Fallback for Pornhub
    };
    return icons[platform] || 'fa-solid fa-circle-user'; // Default fallback
};

// Extract the username from the URL
const getUsername = (url) => {
    try {
        const urlObj = new URL(url);
        const pathParts = urlObj.pathname.split('/').filter(part => part); // Remove empty parts
        return pathParts[pathParts.length - 1]; // Get the last part of the path
    } catch (error) {
        return 'username'; // Fallback if URL parsing fails
    }
};
</script>

<style scoped>
.social-media-links {
    margin-top: 20px;
}

.social-media-links h2 {
    font-size: 1.5rem;
    margin-bottom: 10px;
}

.social-media-links ul {
    padding-left: 0;
}

.social-media-links li {
    margin-bottom: 8px;
}

.social-media-links a {
    color: #007bff;
    text-decoration: none;
    display: flex;
    align-items: center;
    gap: 8px;
}

.social-media-links a:hover {
    color: #0056b3;
    text-decoration: underline;
}

.social-media-links i {
    font-size: 1.2rem;
}
</style>