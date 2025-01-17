<template>
    <div>
        <Navbar id="navbar" />
        <div class="slot-wrapper mt-1">
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
    font-weight: 400;
    font-style: normal;
    
}

p{
    color: rgb(47, 45, 45) !important;
}

#navbar {
    z-index: 1000;
    margin: 0 !important;
    top: 0 !important;
}

a {
    color: rgb(0, 0, 0) !important;
}


a:hover{
    color: blue !important;
}

h2 {
    /*font-family: "Fira Sans", sans-serif;*/
    font-weight: 500;
    font-style: normal;
}

* {
    color: rgb(59, 59, 59) !important;
    text-decoration: none;
}

.slot-wrapper {
    margin-top: 10px !important;
}
</style>