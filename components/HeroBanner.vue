<template>
    <section class="hero-banner" :class="{
        'has-parallax': parallax,
        'has-overlay': overlay,
        'has-background-image': backgroundImage,
        'has-gradient': gradient
    }" :style="heroStyles">
        <div v-if="parallax" class="parallax-bg" :style="parallaxStyles"></div>
        <div v-if="backgroundImage && !parallax" class="background-image" :style="backgroundImageStyles"></div>

        <div class="hero-container" :class="containerClass">
            <div class="hero-content" :class="contentClass">
                <!-- Content remains the same -->
                <slot>
                    <h1 v-if="title" class="hero-title" :class="titleClass">{{ title }}</h1>
                    <p v-if="subtitle" class="hero-subtitle lead-6" :class="subtitleClass">{{ subtitle }}</p>
                </slot>

                <slot name="stats"></slot>

                <slot name="cta">
                    <button v-if="ctaText" class="hero-cta" :class="ctaClass" @click="$emit('cta-click')">
                        {{ ctaText }}
                    </button>
                </slot>

                <slot name="content"></slot>
            </div>
        </div>
    </section>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
    // Content props
    title: String,
    subtitle: String,
    ctaText: String,

    // Style props
    height: {
        type: String,
        default: '70vh'
    },
    minHeight: {
        type: String,
        default: '400px'
    },
    textColor: {
        type: String,
        default: '#ffffff'
    },
    align: {
        type: String,
        default: 'center',
        validator: (value) => ['left', 'center', 'right'].includes(value)
    },

    // Background props
    backgroundImage: String,
    backgroundPosition: {
        type: String,
        default: 'center'
    },
    backgroundSize: {
        type: String,
        default: 'cover'
    },
    parallax: Boolean,
    overlay: {
        type: Boolean,
        default: true
    },
    overlayOpacity: {
        type: Number,
        default: 0.5
    },
    gradient: {
        type: [Boolean, String],
        default: false
    },

    // Container props
    containerClass: String,
    contentClass: String,
    titleClass: String,
    subtitleClass: String,
    ctaClass: String,
    textContainerClass: String
});

const emit = defineEmits(['cta-click']);

const heroStyles = computed(() => ({
    '--hero-height': props.height,
    '--hero-min-height': props.minHeight,
    '--hero-text-color': props.textColor,
    '--hero-align': props.align,
    '--overlay-opacity': props.overlayOpacity,
    '--gradient': props.gradient
}));

const parallaxStyles = computed(() => ({
    backgroundImage: props.backgroundImage ? `url('${props.backgroundImage}')` : '',
    backgroundPosition: props.backgroundPosition,
    backgroundSize: props.backgroundSize
}));

const backgroundImageStyles = computed(() => ({
    backgroundImage: props.backgroundImage ? `url('${props.backgroundImage}')` : '',
    backgroundPosition: props.backgroundPosition,
    backgroundSize: props.backgroundSize
}));

const gradientStyles = computed(() => {
    if (!props.gradient) return '';
    if (typeof props.gradient === 'string') return props.gradient;
    return 'linear-gradient(to bottom right, #ff7eb9, #ff758c)';
});
</script>

<style scoped>
.hero-banner {
    position: relative;
    height: var(--hero-height);
    min-height: var(--hero-min-height);
    color: var(--hero-text-color);
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: var(--hero-align);
    overflow: hidden;
    width: 100%;
}

/* Background elements */
.parallax-bg {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: -1;
    background-attachment: fixed;
}

.background-image {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: -1;
    background-repeat: no-repeat;
}

.hero-banner.has-overlay::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, var(--overlay-opacity));
    z-index: 0;
}

.hero-banner.has-gradient {
    background: v-bind(gradientStyles);
}

/* Content container */
.hero-container {
    position: relative;
    z-index: 1;
    width: 100%;
    padding: 2rem;
    background-color: rgba(226, 43, 156, 0.241) !important;
    padding-top: 5vw;
    padding-bottom: 5vw;
    
}

.hero-content {
    max-width: 1200px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin: 0 auto;
    
}

/* Typography */
.hero-title {
    font-size: clamp(2rem, 5vw, 3.5rem);
    font-weight: 700;
    margin-bottom: 1.5rem;
    line-height: 1.2;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
    color:rgb(250, 36, 122) !important;
    z-index: 2;
}

.hero-subtitle {
    font-size: clamp(1rem, 2vw, 1.5rem);
    margin-bottom: 2rem;
    max-width: 75vw;
    line-height: 1.25;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
    color: rgb(255, 255, 255) !important;
    z-index: 2;
}

/* CTA Button */
.hero-cta {
    padding: 0.75rem 2rem;
    font-size: 1.1rem;
    font-weight: 600;
    border-radius: 50px;
    background-color: rgba(219, 74, 132);
    color: white !important;
    border: none;
    cursor: pointer;
    transition: all 0.3s ease;
    text-decoration: none;
    display: inline-block;
}

.hero-cta:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

/* Text container for magazine style */
.text-container {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 15px;
    backdrop-filter: blur(5px);
    padding: 2rem;
    transition: all 0.3s ease;
    max-width: 900px;
    margin: 0 auto;
}

/* Responsive adjustments */
@media (max-width: 992px) {
    .hero-banner {
        height: auto;
        padding: 4rem 1rem;
    }

    .text-container {
        padding: 1.5rem;
    }
}

@media (max-width: 768px) {
    .hero-title {
        font-size: 2.25rem;
    }

    .hero-subtitle {
        font-size: 1.1rem;
    }

    .hero-cta {
        padding: 0.6rem 1.5rem;
        font-size: 1rem;
    }

    .hero-container{
        border-radius: 10px;
    }
}
</style>