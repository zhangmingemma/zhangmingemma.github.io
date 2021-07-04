<template>
    <div class="m-page">
        <Nav/>
        <router-view/>
    </div>
</template>

<style lang="scss">
.m-page {
    box-sizing: border-box;
    min-height: 100%;
    overflow: auto;
    padding-bottom: 12rem;
    animation: fade-in-down .6s ease;
}

@keyframes fade-in-down {
    0% {
        opacity: 0;
        transform: translateY(-2rem);
    }
    100% {
        opacity: 1;
        transform: translateY(0);
    }
}
</style>
