<template>
    <div>
        <Navbar id="navbar" />
        <div class="slot-wrapper">
            <slot class="main-content" />
        </div>
        <Footer />
    </div>
</template>

<script>




</script>

<style>
* {
    font-family: "Geist", sans-serif;
    font-optical-sizing: auto;
    font-weight: 600;
    font-style: normal;
    
}

#navbar {
    z-index: 1000;
    margin: 0 !important;
    top: 0 !important;
}

a {
    color: rgb(74, 121, 0) !important;
}




h2 {
    /*font-family: "Fira Sans", sans-serif;*/
    font-weight: 700;
    font-style: normal;
}

* {
    color: rgb(59, 59, 59) !important;
    text-decoration: none;
}

.slot-wrapper {
    /*margin-top: 100px !important;*/
}
</style>