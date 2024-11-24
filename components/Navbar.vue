<template>
    <nav class="navbar navbar-expand-lg w-100 position-fixed">
        <div class="container-fluid">
            <div class="d-flex">
            <NuxtLink to="/" class="navbar-brand">
                <NuxtImg src="/assets/images/panty-icon.png" width="auto" height="50" />
            </NuxtLink>
            <h4 class="text-light lead my-auto">
                Colombian Panties
            </h4>
            
        </div>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav"
                aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarNav">
                <ul class="navbar-nav ms-auto gap-2">
                    <li class="nav-item">
                        <NuxtLink to="/contacto" class="nav-link  text-decoration-none">Contacto</NuxtLink>
                    </li>
                    <li class="nav-item">
                        <NuxtLink class="nav-link  text-decoration-none fs-bold" to="/sobre-nosotros">Sobre Nosotros</NuxtLink>
                    </li>
                    <li class="nav-item">
                        <NuxtLink class="nav-link  text-decoration-none" to="/blog">Blog</NuxtLink>
                    </li>
                    <li class="nav-item">
                        <NuxtLink to="/tienda" class="nav-link  text-decoration-none">Tienda</NuxtLink>
                    </li>
                </ul>
            </div>
        </div>
    </nav>

</template>

<script>

</script>

<style>

a:hover{
    color: white !important;
}

.router-link-active {
    color: rgb(13, 0, 255)
}

.nav-link {
    /*font-family: "Fira Sans", sans-serif;*/
    font-weight: 900;
    font-style: normal;
    color: white !important;
}

nav{
    position:sticky !important;
    background: rgb(205, 89, 213) !important;
    margin: 0;
}
</style>